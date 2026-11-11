/**
 * DINESH ONLINE SOLUTION - ADMIN PAYMENTS & REVENUE
 */

document.addEventListener('DOMContentLoaded', async () => {
  const tableBody = document.getElementById('adminPaymentsTableBody');
  const exportBtn = document.getElementById('exportPaymentsCsvBtn');

  if (!tableBody) return;

  let payments = [];

  async function fetchPayments() {
    if (window.DOS_CONFIG && window.DOS_CONFIG.isLive) {
      try {
        const db = window.DOS_CONFIG.getDb();
        const snap = await db.collection('payments').orderBy('createdAt', 'desc').get();
        payments = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (e) {
        console.warn('Live admin payments error:', e);
      }
    }

    if (payments.length === 0) {
      payments = DOSUtils.demoStore.get('payments', [
        {
          id: 'pay_Lw7a89B10c',
          paymentId: 'pay_Lw7a89B10c',
          applicationId: 'DOS-20261101-4821',
          serviceName: 'New PAN Card Application',
          customerName: 'Dinesh Kumar',
          customerMobile: '9876543210',
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
          customerName: 'Ramesh Singh',
          customerMobile: '9812345678',
          amount: 680,
          serviceFee: 20,
          govtFee: 660,
          status: 'Successful',
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
        }
      ]);
      DOSUtils.demoStore.set('payments', payments);
    }

    renderPayments();
    updateRevenueMetrics();
  }

  function updateRevenueMetrics() {
    const total = payments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
    const serviceFeeTotal = payments.reduce((s, p) => s + (Number(p.serviceFee) || Number(p.amount) || 0), 0);
    const govtFeeTotal = payments.reduce((s, p) => s + (Number(p.govtFee) || 0), 0);

    const elTotal = document.getElementById('revTotalVerified');
    const elService = document.getElementById('revServiceShare');
    const elGovt = document.getElementById('revGovtShare');

    if (elTotal) elTotal.textContent = DOSUtils.formatINR(total);
    if (elService) elService.textContent = DOSUtils.formatINR(serviceFeeTotal);
    if (elGovt) elGovt.textContent = DOSUtils.formatINR(govtFeeTotal);
  }

  function renderPayments() {
    if (payments.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted" style="padding:2rem;">No transaction records found.</td></tr>`;
      return;
    }

    tableBody.innerHTML = payments.map(p => {
      const custName = p.customerName || p.name || p.applicantName || 'Citizen Customer';
      const custMobile = p.customerMobile || p.mobile || p.phone || '9131171406';

      return `
        <tr>
          <td>${DOSUtils.formatDate(p.createdAt, true)}</td>
          <td><span class="badge-code" style="color:var(--royal-blue);">${DOSUtils.escapeHtml(p.paymentId || p.id)}</span></td>
          <td><span class="badge-code">${DOSUtils.escapeHtml(p.applicationId || '—')}</span></td>
          <td><strong>${DOSUtils.escapeHtml(custName)}</strong><br><small class="text-muted">+91 ${DOSUtils.escapeHtml(custMobile)}</small></td>
          <td style="font-weight:600;">${DOSUtils.formatINR(p.serviceFee || p.amount)}</td>
          <td style="color:var(--text-secondary);">${p.govtFee > 0 ? DOSUtils.formatINR(p.govtFee) : '<span style="color:var(--text-muted);">₹0</span>'}</td>
          <td><strong style="color:var(--primary-navy); font-size:1rem;">${DOSUtils.formatINR(p.amount)}</strong></td>
        </tr>
      `;
    }).join('');
  }

  // Export CSV
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      if (payments.length === 0) {
        window.showToast('No payment records to export.', 'warning');
        return;
      }

      const headers = ['Payment ID', 'Application ID', 'Customer Name', 'Mobile', 'Service Name', 'Service Fee', 'Govt Fee', 'Total Amount', 'Status', 'Date'];
      const rows = payments.map(p => [
        p.paymentId || p.id,
        p.applicationId || '',
        `"${(p.customerName || '').replace(/"/g, '""')}"`,
        p.customerMobile || '',
        `"${(p.serviceName || '').replace(/"/g, '""')}"`,
        p.serviceFee || 0,
        p.govtFee || 0,
        p.amount || 0,
        p.status || 'Successful',
        `"${DOSUtils.formatDate(p.createdAt, true)}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `dinesh_online_revenue_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.showToast('Revenue CSV report downloaded successfully.', 'success');
    });
  }

  fetchPayments();
});

