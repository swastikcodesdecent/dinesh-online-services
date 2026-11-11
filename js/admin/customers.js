/**
 * DINESH ONLINE SOLUTION - ADMIN CUSTOMER MANAGEMENT
 */

document.addEventListener('DOMContentLoaded', async () => {
  const tableBody = document.getElementById('adminCustomersTableBody');
  const searchInput = document.getElementById('adminCustomerSearchInput');

  if (!tableBody) return;

  let customers = [];

  async function fetchCustomers() {
    if (window.DOS_CONFIG && window.DOS_CONFIG.isLive) {
      try {
        const db = window.DOS_CONFIG.getDb();
        const snap = await db.collection('users').get();
        customers = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (e) {
        console.warn('Live customers fetch error:', e);
      }
    }

    if (customers.length === 0) {
      customers = DOSUtils.demoStore.get('users', [
        { customerId: 'CID-100234', name: 'Dinesh Kumar', mobile: '9876543210', email: 'dinesh@example.com', status: 'active', createdAt: '2026-10-15' },
        { customerId: 'CID-100235', name: 'Ramesh Singh', mobile: '9812345678', email: 'ramesh@example.com', status: 'active', createdAt: '2026-10-20' },
        { customerId: 'CID-100236', name: 'Pooja Verma', mobile: '9798765432', email: 'pooja@example.com', status: 'active', createdAt: '2026-10-25' }
      ]);
      DOSUtils.demoStore.set('users', customers);
    }

    renderCustomers(customers);
  }

  function renderCustomers(list) {
    if (list.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted" style="padding:2rem;">No customers found.</td></tr>`;
      return;
    }

    tableBody.innerHTML = list.map((c, idx) => {
      const isActive = (c.status || 'active') === 'active';
      const custName = c.name || c.customerName || 'Citizen User';
      const custMobile = c.mobile || c.customerMobile || '—';

      return `
        <tr>
          <td><span class="badge-code">${DOSUtils.escapeHtml(c.customerId || 'CID-100' + idx)}</span></td>
          <td><strong>${DOSUtils.escapeHtml(custName)}</strong></td>
          <td>${custMobile.startsWith('+') ? DOSUtils.escapeHtml(custMobile) : '+91 ' + DOSUtils.escapeHtml(custMobile)}</td>
          <td>${DOSUtils.escapeHtml(c.email || '—')}</td>
          <td>${DOSUtils.formatDate(c.createdAt)}</td>
          <td>
            <span class="badge ${isActive ? 'badge-completed' : 'badge-failed'}">
              ${isActive ? 'Active' : 'Suspended'}
            </span>
          </td>
          <td>
            <div style="display:flex; gap:0.5rem;">
              <button class="btn btn-outline btn-sm" onclick="window.viewCustomerHistory('${c.mobile}')">
                History
              </button>
              <button class="btn ${isActive ? 'btn-danger' : 'btn-primary'} btn-sm" onclick="window.toggleCustomerStatus('${c.mobile}', '${c.status || 'active'}')">
                ${isActive ? 'Suspend' : 'Reactivate'}
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  if (searchInput) {
    searchInput.addEventListener('input', DOSUtils.debounce(() => {
      const q = searchInput.value.toLowerCase().trim();
      const filtered = customers.filter(c =>
        (c.name || '').toLowerCase().includes(q) ||
        (c.mobile || '').includes(q) ||
        (c.customerId || '').toLowerCase().includes(q)
      );
      renderCustomers(filtered);
    }, 200));
  }

  window.toggleCustomerStatus = async function (mobile, currentStatus) {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const confirmed = await window.notificationManager.confirm({
      title: `${nextStatus === 'suspended' ? 'Suspend' : 'Reactivate'} Customer`,
      message: `Are you sure you want to change account status for mobile ${mobile} to ${nextStatus}?`,
      isDanger: nextStatus === 'suspended',
      confirmText: `Yes, ${nextStatus}`
    });

    if (!confirmed) return;

    if (window.DOS_CONFIG && window.DOS_CONFIG.isLive) {
      const db = window.DOS_CONFIG.getDb();
      await db.collection('users').doc(mobile).update({ status: nextStatus });
    } else {
      const users = DOSUtils.demoStore.get('users', []);
      const idx = users.findIndex(u => u.mobile === mobile);
      if (idx !== -1) {
        users[idx].status = nextStatus;
        DOSUtils.demoStore.set('users', users);
      }
    }

    window.showToast(`Customer account is now ${nextStatus}.`, 'success');
    fetchCustomers();
  };

  window.viewCustomerHistory = function (mobile) {
    const allApps = DOSUtils.demoStore.get('applications', []);
    const customerApps = allApps.filter(a => a.customerMobile === mobile);

    let overlay = document.getElementById('customerHistoryModal');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'customerHistoryModal';
      overlay.className = 'modal-overlay';
      document.body.appendChild(overlay);
    }

    const appsHtml = customerApps.length ? customerApps.map(a => `
      <div style="border-bottom:1px solid var(--border-light); padding:0.75rem 0;">
        <div style="display:flex; justify-content:space-between;">
          <strong>${DOSUtils.escapeHtml(a.serviceName)}</strong>
          <span class="badge badge-under-review">${a.status}</span>
        </div>
        <div class="text-meta" style="margin-top:2px;">App ID: ${a.applicationId} | Fee: ${DOSUtils.formatINR(a.amount)} | Date: ${DOSUtils.formatDate(a.createdAt, true)}</div>
      </div>
    `).join('') : '<p class="text-muted">No applications found for this customer.</p>';

    overlay.innerHTML = `
      <div class="modal-container" style="max-width: 540px;">
        <div class="modal-header">
          <h4 class="modal-title">Service History: +91 ${mobile}</h4>
          <button class="modal-close" onclick="document.getElementById('customerHistoryModal').classList.remove('active')">&times;</button>
        </div>
        <div class="modal-body" style="max-height: 400px; overflow-y:auto;">
          ${appsHtml}
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="document.getElementById('customerHistoryModal').classList.remove('active')">Close</button>
        </div>
      </div>
    `;

    overlay.classList.add('active');
  };

  fetchCustomers();
});

