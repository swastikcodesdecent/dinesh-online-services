/**
 * DINESH ONLINE SOLUTION - SERVICE DETAILS MODAL
 */

const ServiceDetailsModal = {
  activeService: null,

  open(serviceId) {
    const service = window.DOSServices.getById(serviceId);
    if (!service) {
      window.showToast('Service details not found.', 'error');
      return;
    }
    this.activeService = service;

    let overlay = document.getElementById('serviceDetailsModalOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'serviceDetailsModalOverlay';
      overlay.className = 'modal-overlay';
      document.body.appendChild(overlay);
    }

    const docsListHtml = (service.requiredDocs || [])
      .map(doc => `<div class="doc-req-item"><i data-lucide="check-circle-2"></i> <span>${DOSUtils.escapeHtml(doc)}</span></div>`)
      .join('');

    const isPagesDir = window.location.pathname.includes('/pages/');
    const applyTarget = isPagesDir ? 'customer-dashboard.html' : 'pages/customer-dashboard.html';

    const customer = (window.DOSAuthSession && typeof window.DOSAuthSession.getCustomer === 'function')
      ? window.DOSAuthSession.getCustomer()
      : (function () {
        try {
          const raw = localStorage.getItem('dos_customer_session');
          return raw ? JSON.parse(raw) : null;
        } catch (e) {
          return null;
        }
      })();

    const feeSectionHtml = customer ? `
      <div class="fee-breakdown-card">
        <h5 style="font-weight: 700; margin-bottom: 0.5rem;">Transparent Pricing Breakdown</h5>
        <div class="fee-row">
          <span class="text-secondary">Facilitation & Service Charge:</span>
          <span class="font-semibold">${DOSUtils.formatINR(service.serviceFee)}</span>
        </div>
        <div class="fee-row">
          <span class="text-secondary">Official Government / Board Fee:</span>
          <span class="font-semibold">${service.govtFee > 0 ? DOSUtils.formatINR(service.govtFee) : '₹0 (Free / Pass-through)'}</span>
        </div>
        <div class="fee-row total">
          <span>Total Payable Amount:</span>
          <span class="color-royal font-bold">${DOSUtils.formatINR(service.totalPrice || (service.serviceFee + service.govtFee))}</span>
        </div>
      </div>
      <p class="text-meta" style="font-size: 0.75rem; color: var(--text-muted);">
        * Note: Government fees are charged exactly according to respective portal department norms. Receipts will be issued instantly upon successful submission.
      </p>
    ` : `
      <div class="fee-breakdown-card" style="background:var(--royal-blue-light); border:1px dashed rgba(37, 99, 235, 0.3); text-align:center; padding:1.25rem;">
        <i data-lucide="lock" style="width:26px; height:26px; color:var(--royal-blue); margin:0 auto 0.5rem; display:block;"></i>
        <h5 style="color:var(--primary-navy); margin-bottom:0.25rem; font-weight:700;">Service Pricing Protected</h5>
        <p class="text-body" style="font-size:0.8125rem; color:var(--text-secondary); margin-bottom:0.75rem;">
          Please sign in or create a customer account to view official government fees and service facilitation charges.
        </p>
        <button class="btn btn-primary btn-sm" onclick="ServiceDetailsModal.proceedToApply('${service.id}')">
          <i data-lucide="user-plus"></i> Create Account to View Pricing
        </button>
      </div>
    `;

    overlay.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <div class="service-modal-header">
            <div class="service-modal-icon">
              <i data-lucide="${service.icon || 'file-text'}"></i>
            </div>
            <div>
              <span class="badge badge-pending" style="font-size:0.7rem;">${DOSUtils.escapeHtml(service.category)}</span>
              <h3 class="modal-title" style="margin-top:0.25rem;">${DOSUtils.escapeHtml(service.name)}</h3>
            </div>
          </div>
          <button class="modal-close" onclick="ServiceDetailsModal.close()">&times;</button>
        </div>

        <div class="modal-body">
          <p class="text-body">${DOSUtils.escapeHtml(service.description)}</p>

          <h5 style="margin-top: 1.25rem; font-weight: 700;">Required Documents / Information:</h5>
          <div class="doc-req-list">
            ${docsListHtml || '<span class="text-muted">No special documents specified.</span>'}
          </div>

          ${feeSectionHtml}
        </div>

        <div class="modal-footer">
          <button class="btn btn-outline" onclick="ServiceDetailsModal.close()">Close</button>
          <button class="btn btn-primary" onclick="ServiceDetailsModal.proceedToApply('${service.id}')">
            <i data-lucide="${customer ? 'send' : 'lock'}"></i> ${customer ? 'Apply Now' : 'Sign In to Apply'}
          </button>
        </div>
      </div>
    `;

    overlay.classList.add('active');
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  },

  close() {
    const overlay = document.getElementById('serviceDetailsModalOverlay');
    if (overlay) overlay.classList.remove('active');
  },

  proceedToApply(serviceId) {
    this.close();
    const customer = (window.DOSAuthSession && typeof window.DOSAuthSession.getCustomer === 'function')
      ? window.DOSAuthSession.getCustomer()
      : (function () {
        try {
          const raw = localStorage.getItem('dos_customer_session');
          return raw ? JSON.parse(raw) : null;
        } catch (e) {
          return null;
        }
      })();
    const isPagesDir = window.location.pathname.includes('/pages/');

    if (!customer) {
      window.showToast('Please sign in or register to complete your application.', 'info');
      const loginUrl = isPagesDir ? 'login.html' : 'pages/login.html';
      const redirectUrl = isPagesDir ? `customer-dashboard.html?apply=${serviceId}` : `pages/customer-dashboard.html?apply=${serviceId}`;
      window.location.href = `${loginUrl}?redirect=${encodeURIComponent(redirectUrl)}`;
      return;
    }

    // If already in customer-dashboard
    if (window.location.pathname.includes('customer-dashboard.html') && window.CustomerBooking) {
      window.CustomerBooking.openBookingModal(serviceId);
    } else {
      const dashUrl = isPagesDir ? 'customer-dashboard.html' : 'pages/customer-dashboard.html';
      window.location.href = `${dashUrl}?apply=${serviceId}`;
    }
  }
};

window.ServiceDetailsModal = ServiceDetailsModal;

