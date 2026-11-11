/**
 * DINESH ONLINE SOLUTION - ADMIN DASHBOARD
 */

document.addEventListener('DOMContentLoaded', async () => {
  const admin = DOSAuthSession.getAdmin();
  if (!admin) return;

  await loadAdminDashboardMetrics();
});

async function loadAdminDashboardMetrics() {
  let allApps = [];
  let allUsers = [];
  let allPayments = [];

  if (window.DOS_CONFIG && window.DOS_CONFIG.isLive) {
    try {
      const db = window.DOS_CONFIG.getDb();
      const [appsSnap, usersSnap, paySnap] = await Promise.all([
        db.collection('applications').get(),
        db.collection('users').get(),
        db.collection('payments').get()
      ]);
      allApps = appsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      allUsers = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      allPayments = paySnap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn('Live admin metrics fetch error:', e);
    }
  }

  if (allApps.length === 0) {
    allApps = DOSUtils.demoStore.get('applications', []);
  }
  if (allUsers.length === 0) {
    allUsers = DOSUtils.demoStore.get('users', []);
    if (allUsers.length === 0) {
      allUsers = [
        { customerId: 'CID-100234', name: 'Dinesh Kumar', mobile: '9876543210', status: 'active', createdAt: '2026-10-15' },
        { customerId: 'CID-100235', name: 'Ramesh Singh', mobile: '9812345678', status: 'active', createdAt: '2026-10-20' },
        { customerId: 'CID-100236', name: 'Pooja Verma', mobile: '9798765432', status: 'active', createdAt: '2026-10-25' }
      ];
      DOSUtils.demoStore.set('users', allUsers);
    }
  }
  if (allPayments.length === 0) {
    allPayments = DOSUtils.demoStore.get('payments', []);
  }

  // Calculate statistics
  const totalCustomers = allUsers.length;
  const totalApplications = allApps.length;
  const pendingApplications = allApps.filter(a => !['Completed', 'Rejected', 'Cancelled'].includes(a.status)).length;
  const completedApplications = allApps.filter(a => a.status === 'Completed').length;

  const totalRevenue = allPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const totalServiceRevenue = allPayments.reduce((sum, p) => sum + (Number(p.serviceFee) || Number(p.amount) || 0), 0);
  const totalGovtRevenue = allPayments.reduce((sum, p) => sum + (Number(p.govtFee) || 0), 0);

  // Update elements
  const elCust = document.getElementById('adminStatCustomers');
  const elApps = document.getElementById('adminStatApps');
  const elPending = document.getElementById('adminStatPending');
  const elCompleted = document.getElementById('adminStatCompleted');
  const elRevenue = document.getElementById('adminStatRevenue');
  const elServiceRev = document.getElementById('adminStatServiceRev');
  const elGovtRev = document.getElementById('adminStatGovtRev');

  if (elCust) elCust.textContent = totalCustomers;
  if (elApps) elApps.textContent = totalApplications;
  if (elPending) elPending.textContent = pendingApplications;
  if (elCompleted) elCompleted.textContent = completedApplications;
  if (elRevenue) elRevenue.textContent = DOSUtils.formatINR(totalRevenue);
  if (elServiceRev) elServiceRev.textContent = DOSUtils.formatINR(totalServiceRevenue);
  if (elGovtRev) elGovtRev.textContent = DOSUtils.formatINR(totalGovtRevenue);

  // Render recent admin applications table
  const adminRecentTable = document.getElementById('adminRecentAppsTableBody');
  if (adminRecentTable) {
    const recents = allApps.slice(0, 6);
    if (recents.length === 0) {
      adminRecentTable.innerHTML = `<tr><td colspan="7" class="text-center text-muted" style="padding:2rem;">No applications received yet.</td></tr>`;
      return;
    }

    adminRecentTable.innerHTML = recents.map(app => {
      const statusBadgeClass = {
        'Under Review': 'badge-under-review',
        'Processing': 'badge-processing',
        'Completed': 'badge-completed',
        'Documents Required': 'badge-docs-required',
        'Payment Pending': 'badge-pending',
        'Rejected': 'badge-failed'
      }[app.status] || 'badge-pending';

      const applicantName = app.customerName || app.name || app.applicantName || 'Citizen Applicant';
      const applicantMobile = app.customerMobile || app.mobile || app.phone || '9131171406';

      return `
        <tr>
          <td><span class="badge-code">${DOSUtils.escapeHtml(app.applicationId || app.id)}</span></td>
          <td>
            <strong>${DOSUtils.escapeHtml(applicantName)}</strong><br>
            <small class="text-muted">+91 ${DOSUtils.escapeHtml(applicantMobile)}</small>
          </td>
          <td>${DOSUtils.escapeHtml(app.serviceName)}</td>
          <td>${DOSUtils.formatINR(app.amount)}</td>
          <td><span class="badge ${statusBadgeClass}">${DOSUtils.escapeHtml(app.status)}</span></td>
          <td>${DOSUtils.formatDate(app.createdAt, true)}</td>
          <td>
            <a href="admin-applications.html?search=${encodeURIComponent(app.applicationId || app.id)}" class="btn btn-outline btn-sm">
              Manage
            </a>
          </td>
        </tr>
      `;
    }).join('');
  }
}

window.loadAdminDashboardMetrics = loadAdminDashboardMetrics;

