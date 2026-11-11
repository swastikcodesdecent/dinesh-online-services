/**
 * DINESH ONLINE SOLUTION - CUSTOMER DASHBOARD
 */

document.addEventListener('DOMContentLoaded', async () => {
  const customer = DOSAuthSession.getCustomer();
  if (!customer) return;

  // Populate Customer Info in Header & Sidebar
  document.querySelectorAll('.customer-name-display').forEach(el => {
    el.textContent = customer.name || 'Citizen Customer';
  });

  document.querySelectorAll('.customer-id-display').forEach(el => {
    el.textContent = customer.customerId || 'CID-100000';
  });

  document.querySelectorAll('.customer-mobile-display').forEach(el => {
    el.textContent = `+91 ${customer.mobile}`;
  });

  document.querySelectorAll('.customer-avatar-display').forEach(el => {
    el.textContent = (customer.name || 'C').slice(0, 2).toUpperCase();
  });

  await loadCustomerDashboardData(customer.mobile);

  // Check URL query for apply trigger (e.g. ?apply=pan-new)
  const urlParams = new URLSearchParams(window.location.search);
  const applyServiceId = urlParams.get('apply');
  if (applyServiceId && window.CustomerBooking) {
    window.CustomerBooking.openBookingModal(applyServiceId);
  }
});

async function loadCustomerDashboardData(mobile) {
  let applications = [];

  if (window.DOS_CONFIG && window.DOS_CONFIG.isLive) {
    try {
      const db = window.DOS_CONFIG.getDb();
      const snapshot = await db.collection('applications')
        .where('customerMobile', '==', mobile)
        .orderBy('createdAt', 'desc')
        .get();

      applications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.warn('Live fetch error, falling back to local demo:', e);
    }
  }

  if (applications.length === 0) {
    const allApps = DOSUtils.demoStore.get('applications', []);
    applications = allApps.filter(a => a.customerMobile === mobile);
    
    // Seed default sample applications for demo if user has none yet
    if (applications.length === 0) {
      const seedApps = [
        {
          id: 'DOS-20261101-4821',
          applicationId: 'DOS-20261101-4821',
          customerName: DOSAuthSession.getCustomer()?.name || 'Customer',
          customerMobile: mobile,
          serviceId: 'pan-new',
          serviceName: 'New PAN Card Application',
          category: 'PAN Services',
          amount: 257,
          serviceFee: 150,
          govtFee: 107,
          paymentStatus: 'Paid',
          status: 'Under Review',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          paymentId: 'pay_Lw7a89B10c',
          remarks: 'Documents received and queued for operator processing.'
        },
        {
          id: 'DOS-20261028-1934',
          applicationId: 'DOS-20261028-1934',
          customerName: DOSAuthSession.getCustomer()?.name || 'Customer',
          customerMobile: mobile,
          serviceId: 'bill-electricity',
          serviceName: 'Electricity Bill Payment',
          category: 'Recharge & Bill Payments',
          amount: 680,
          serviceFee: 20,
          govtFee: 660,
          paymentStatus: 'Paid',
          status: 'Completed',
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          paymentId: 'pay_K99104cXZ',
          remarks: 'Payment cleared successfully. Official discom transaction receipt issued.'
        }
      ];
      applications = seedApps;
      allApps.push(...seedApps);
      DOSUtils.demoStore.set('applications', allApps);
    }
  }

  // Calculate statistics
  const totalApps = applications.length;
  const pendingApps = applications.filter(a => !['Completed', 'Rejected', 'Cancelled'].includes(a.status)).length;
  const completedApps = applications.filter(a => a.status === 'Completed').length;
  const totalPayments = applications.reduce((sum, a) => sum + (Number(a.amount) || 0), 0);

  // Update stat counters
  const totalServicesEl = document.getElementById('statTotalServices');
  const pendingAppsEl = document.getElementById('statPendingApps');
  const completedAppsEl = document.getElementById('statCompletedApps');
  const totalPaymentsEl = document.getElementById('statTotalPayments');

  if (totalServicesEl) totalServicesEl.textContent = totalApps;
  if (pendingAppsEl) pendingAppsEl.textContent = pendingApps;
  if (completedAppsEl) completedAppsEl.textContent = completedApps;
  if (totalPaymentsEl) totalPaymentsEl.textContent = DOSUtils.formatINR(totalPayments);

  // Render Recent Applications Table / List
  const recentTableBody = document.getElementById('recentApplicationsTableBody');
  if (recentTableBody) {
    if (applications.length === 0) {
      recentTableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center" style="padding: 2.5rem;">
            <p class="text-muted">No applications found. Click <strong>Browse Services</strong> to start!</p>
          </td>
        </tr>
      `;
      return;
    }

    const recentItems = applications.slice(0, 5);
    recentTableBody.innerHTML = recentItems.map(app => {
      const statusBadgeClass = {
        'Under Review': 'badge-under-review',
        'Processing': 'badge-processing',
        'Completed': 'badge-completed',
        'Documents Required': 'badge-docs-required',
        'Payment Pending': 'badge-pending',
        'Rejected': 'badge-rejected'
      }[app.status] || 'badge-pending';

      return `
        <tr>
          <td><span class="app-id-tag">${DOSUtils.escapeHtml(app.applicationId || app.id)}</span></td>
          <td><strong>${DOSUtils.escapeHtml(app.serviceName)}</strong></td>
          <td>${DOSUtils.formatDate(app.createdAt, true)}</td>
          <td>${DOSUtils.formatINR(app.amount)}</td>
          <td><span class="badge ${statusBadgeClass}">${DOSUtils.escapeHtml(app.status)}</span></td>
          <td>
            <div style="display:flex; gap:0.35rem;">
              <button class="btn btn-outline btn-sm" onclick="window.CustomerApplications.viewTimeline('${app.id || app.applicationId}')">
                Track
              </button>
              <button class="btn btn-secondary btn-sm" onclick="DOSReceipts.generateReceipt(${JSON.stringify(app).replace(/"/g, '&quot;')})">
                Receipt
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }
}

window.loadCustomerDashboardData = loadCustomerDashboardData;

