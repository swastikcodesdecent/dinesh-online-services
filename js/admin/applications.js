/**
 * DINESH ONLINE SOLUTION - ADMIN APPLICATION MANAGEMENT
 */

document.addEventListener('DOMContentLoaded', async () => {
  const tableBody = document.getElementById('adminApplicationsTableBody');
  const searchInput = document.getElementById('adminAppSearchInput');
  const statusFilter = document.getElementById('adminAppStatusFilter');

  if (!tableBody) return;

  let allApps = [];

  async function fetchApplications() {
    if (window.DOS_CONFIG && window.DOS_CONFIG.isLive) {
      try {
        const db = window.DOS_CONFIG.getDb();
        const snap = await db.collection('applications').orderBy('createdAt', 'desc').get();
        allApps = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (e) {
        console.warn('Live admin apps fetch error:', e);
      }
    }

    if (allApps.length === 0) {
      allApps = DOSUtils.demoStore.get('applications', []);
      if (allApps.length === 0) {
        allApps = [
          {
            id: 'DOS-20261101-4821',
            applicationId: 'DOS-20261101-4821',
            customerName: 'Dinesh Kumar',
            customerMobile: '9876543210',
            serviceName: 'New PAN Card Application',
            amount: 257,
            serviceFee: 150,
            govtFee: 107,
            status: 'Under Review',
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            documents: [{ name: 'Aadhaar_Card.pdf', size: 1024000 }],
            remarks: 'Under initial operator scrutiny.'
          },
          {
            id: 'DOS-20261028-1934',
            applicationId: 'DOS-20261028-1934',
            customerName: 'Ramesh Singh',
            customerMobile: '9812345678',
            serviceName: 'Electricity Bill Payment',
            amount: 680,
            serviceFee: 20,
            govtFee: 660,
            status: 'Completed',
            createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
            documents: [],
            remarks: 'Discom acknowledgment verified.'
          }
        ];
        DOSUtils.demoStore.set('applications', allApps);
      }
    }

    renderApplications();
  }

  function renderApplications() {
    let filtered = allApps;
    const selectedStatus = statusFilter ? statusFilter.value : 'All';
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    if (selectedStatus && selectedStatus !== 'All') {
      filtered = filtered.filter(a => a.status === selectedStatus);
    }

    if (query) {
      filtered = filtered.filter(a =>
        (a.applicationId || '').toLowerCase().includes(query) ||
        (a.customerName || '').toLowerCase().includes(query) ||
        (a.customerMobile || '').includes(query) ||
        (a.serviceName || '').toLowerCase().includes(query)
      );
    }

    if (filtered.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted" style="padding:2rem;">No matching applications found.</td></tr>`;
      return;
    }

    tableBody.innerHTML = filtered.map(app => {
      const statuses = [
        'Under Review',
        'Processing',
        'Documents Required',
        'Completed',
        'Rejected'
      ];

      const optionsHtml = statuses.map(s => `
        <option value="${s}" ${app.status === s ? 'selected' : ''}>${s}</option>
      `).join('');

      const docsCount = (app.documents || []).length;

      const applicantName = app.customerName || app.name || app.applicantName || 'Citizen Applicant';
      const applicantMobile = app.customerMobile || app.mobile || app.phone || '9131171406';

      return `
        <tr>
          <td><span class="badge-code">${DOSUtils.escapeHtml(app.applicationId || app.id)}</span></td>
          <td>
            <strong>${DOSUtils.escapeHtml(applicantName)}</strong><br>
            <small class="text-muted">+91 ${DOSUtils.escapeHtml(applicantMobile)}</small>
          </td>
          <td><strong>${DOSUtils.escapeHtml(app.serviceName)}</strong></td>
          <td style="font-weight:600; color:var(--primary-navy);">${DOSUtils.formatINR(app.amount)}</td>
          <td>
            <select class="status-select" onchange="window.updateAppStatus('${app.id || app.applicationId}', this.value)">
              ${optionsHtml}
            </select>
          </td>
          <td>
            ${docsCount > 0 ? `
              <span class="doc-thumbnail" onclick="window.viewAppDocs('${app.id || app.applicationId}')">
                <i data-lucide="file-text"></i> ${docsCount} Doc(s)
              </span>
            ` : '<span class="text-meta" style="color:var(--text-muted);">None attached</span>'}
          </td>
          <td>
            <button class="btn btn-outline btn-sm" onclick="window.openRemarkModal('${app.id || app.applicationId}')">
              <i data-lucide="message-square"></i> Remark
            </button>
          </td>
        </tr>
      `;
    }).join('');

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  // Status changer
  window.updateAppStatus = async function (appId, newStatus) {
    if (window.DOS_CONFIG && window.DOS_CONFIG.isLive) {
      const db = window.DOS_CONFIG.getDb();
      await db.collection('applications').doc(appId).update({
        status: newStatus,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }

    const idx = allApps.findIndex(a => (a.applicationId === appId || a.id === appId));
    if (idx !== -1) {
      allApps[idx].status = newStatus;
      DOSUtils.demoStore.set('applications', allApps);
    }

    window.showToast(`Application ${appId} status updated to "${newStatus}".`, 'success');
  };

  // Remark modal
  window.openRemarkModal = function (appId) {
    const app = allApps.find(a => (a.applicationId === appId || a.id === appId));
    if (!app) return;

    let overlay = document.getElementById('adminRemarkModal');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'adminRemarkModal';
      overlay.className = 'modal-overlay';
      document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
      <div class="modal-container" style="max-width: 480px;">
        <div class="modal-header">
          <h4 class="modal-title">Admin Remark: ${app.applicationId}</h4>
          <button class="modal-close" onclick="document.getElementById('adminRemarkModal').classList.remove('active')">&times;</button>
        </div>
        <div class="modal-body">
          <label class="form-label">Internal Operator Note / Customer Update</label>
          <textarea id="adminRemarkText" class="form-control" rows="4">${DOSUtils.escapeHtml(app.remarks || '')}</textarea>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="document.getElementById('adminRemarkModal').classList.remove('active')">Cancel</button>
          <button class="btn btn-primary" onclick="window.saveAppRemark('${app.id || app.applicationId}')">Save Remark</button>
        </div>
      </div>
    `;

    overlay.classList.add('active');
  };

  window.saveAppRemark = async function (appId) {
    const remark = document.getElementById('adminRemarkText').value.trim();

    if (window.DOS_CONFIG && window.DOS_CONFIG.isLive) {
      const db = window.DOS_CONFIG.getDb();
      await db.collection('applications').doc(appId).update({
        remarks: remark,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }

    const idx = allApps.findIndex(a => (a.applicationId === appId || a.id === appId));
    if (idx !== -1) {
      allApps[idx].remarks = remark;
      DOSUtils.demoStore.set('applications', allApps);
    }

    document.getElementById('adminRemarkModal').classList.remove('active');
    window.showToast('Remark updated successfully.', 'success');
  };

  window.viewAppDocs = function (appId) {
    const app = allApps.find(a => (a.applicationId === appId || a.id === appId));
    if (!app || !app.documents) return;

    const listHtml = app.documents.map(d => `
      <div style="padding:0.75rem; border-bottom:1px solid var(--border-light); display:flex; justify-content:space-between; align-items:center;">
        <div>
          <strong>${DOSUtils.escapeHtml(d.name)}</strong>
          <div class="text-meta">${Math.round(d.size / 1024)} KB</div>
        </div>
        <span class="badge badge-completed">Verified</span>
      </div>
    `).join('');

    let overlay = document.getElementById('adminDocViewerModal');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'adminDocViewerModal';
      overlay.className = 'modal-overlay';
      document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
      <div class="modal-container" style="max-width: 480px;">
        <div class="modal-header">
          <h4 class="modal-title">Attached Documents</h4>
          <button class="modal-close" onclick="document.getElementById('adminDocViewerModal').classList.remove('active')">&times;</button>
        </div>
        <div class="modal-body">${listHtml}</div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="document.getElementById('adminDocViewerModal').classList.remove('active')">Close</button>
        </div>
      </div>
    `;
    overlay.classList.add('active');
  };

  if (searchInput) searchInput.addEventListener('input', DOSUtils.debounce(renderApplications, 200));
  if (statusFilter) statusFilter.addEventListener('change', renderApplications);

  // Check URL search param
  const urlSearch = new URLSearchParams(window.location.search).get('search');
  if (urlSearch && searchInput) {
    searchInput.value = urlSearch;
  }

  fetchApplications();
});

