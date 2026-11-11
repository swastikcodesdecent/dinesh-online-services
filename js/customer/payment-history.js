/**
 * DINESH ONLINE SOLUTION - CUSTOMER PAYMENT HISTORY
 */

document.addEventListener('DOMContentLoaded', async () => {
  const customer = DOSAuthSession.getCustomer();
  if (!customer) return;

  const tableBody = document.getElementById('paymentHistoryTableBody');
  const searchInput = document.getElementById('paymentSearchInput');

  if (!tableBody) return;

  let allPayments = [];

  async function fetchPayments() {
    if (window.DOS_CONFIG && window.DOS_CONFIG.isLive) {
      try {
        const db = window.DOS_CONFIG.getDb();
        const snapshot = await db.collection('payments')
          .where('customerMobile', '==', customer.mobile)
          .orderBy('createdAt', 'desc')
          .get();
        allPayments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (e) {
        console.warn('Live payments fetch error:', e);
      }
    }

    if (allPayments.length === 0) {
      const demoPayments = DOSUtils.demoStore.get('payments', []);
      allPayments = demoPayments.filter(p => p.customerMobile === customer.mobile);

      // Seed if empty
      if (allPayments.length === 0) {
        const seed = [
          {
            id: 'pay_Lw7a89B10c',
            paymentId: 'pay_Lw7a89B10c',
            applicationId: 'DOS-20261101-4821',
            serviceName: 'New PAN Card Application',
            customerName: customer.name,
            customerMobile: customer.mobile,
            amount: 257,
            serviceFee: 150,
            govtFee: 107,
            status: 'Successful',
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
          },
          {
            id: 'pay_K99104cXZ',
            paymentId: 'pay_K99104cXZ',
            applicationId: 'DOS-20261028-1934',
            serviceName: 'Electricity Bill Payment',
            customerName: customer.name,
            customerMobile: customer.mobile,
            amount: 680,
            serviceFee: 20,
            govtFee: 660,
            status: 'Successful',
            createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
          }
        ];
        allPayments = seed;
        demoPayments.push(...seed);
        DOSUtils.demoStore.set('payments', demoPayments);
      }
    }

    renderPayments(allPayments);
  }

  function renderPayments(list) {
    if (list.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center" style="padding: 2.5rem;">
            <p class="text-muted">No payment records found.</p>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = list.map(item => `
      <tr>
        <td>${DOSUtils.formatDate(item.createdAt, true)}</td>
        <td><span style="font-family:monospace; font-weight:600; color:var(--royal-blue);">${DOSUtils.escapeHtml(item.paymentId || item.id)}</span></td>
        <td><span class="app-id-tag">${DOSUtils.escapeHtml(item.applicationId || '—')}</span></td>
        <td><strong>${DOSUtils.escapeHtml(item.serviceName)}</strong></td>
        <td><span class="font-bold">${DOSUtils.formatINR(item.amount)}</span></td>
        <td><span class="badge badge-success">${DOSUtils.escapeHtml(item.status || 'Successful')}</span></td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="DOSReceipts.generateReceipt(${JSON.stringify(item).replace(/"/g, '&quot;')})">
            <i data-lucide="printer"></i> Receipt
          </button>
        </td>
      </tr>
    `).join('');

    if (window.lucide) window.lucide.createIcons({ root: tableBody });
  }

  if (searchInput) {
    searchInput.addEventListener('input', DOSUtils.debounce(() => {
      const q = searchInput.value.toLowerCase().trim();
      const filtered = allPayments.filter(p =>
        (p.paymentId || '').toLowerCase().includes(q) ||
        (p.applicationId || '').toLowerCase().includes(q) ||
        (p.serviceName || '').toLowerCase().includes(q)
      );
      renderPayments(filtered);
    }, 200));
  }

  fetchPayments();
});

