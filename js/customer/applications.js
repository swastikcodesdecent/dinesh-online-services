/**
 * DINESH ONLINE SOLUTION - MY APPLICATIONS & PROGRESS TRACKING
 */

document.addEventListener('DOMContentLoaded', async () => {
  const customer = DOSAuthSession.getCustomer();
  if (!customer) return;

  const applicationsListContainer = document.getElementById('myApplicationsContainer');
  const searchInput = document.getElementById('applicationSearchInput');
  const filterTabsContainer = document.getElementById('applicationFilterTabs');

  if (!applicationsListContainer) return;

  let allCustomerApps = [];
  let currentFilter = 'All';
  let searchQuery = '';

  async function fetchApplications() {
    if (window.DOS_CONFIG && window.DOS_CONFIG.isLive) {
      try {
        const db = window.DOS_CONFIG.getDb();
        const snapshot = await db.collection('applications')
          .where('customerMobile', '==', customer.mobile)
          .orderBy('createdAt', 'desc')
          .get();
        allCustomerApps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (e) {
        console.warn('Live fetch error, falling back to local demo:', e);
      }
    }

    if (allCustomerApps.length === 0) {
      const allApps = DOSUtils.demoStore.get('applications', []);
      allCustomerApps = allApps.filter(a => a.customerMobile === customer.mobile);
    }

    renderApplications();
  }

  function renderApplications() {
    let filtered = allCustomerApps;

    if (currentFilter !== 'All') {
      filtered = filtered.filter(a => a.status === currentFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(a =>
        (a.applicationId || '').toLowerCase().includes(q) ||
        (a.serviceName || '').toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      applicationsListContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <i data-lucide="file-question"></i>
          </div>
          <h4 class="empty-state-title">No applications found</h4>
          <p class="empty-state-text">No records match the current filter. Apply for new digital services anytime!</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons({ root: applicationsListContainer });
      return;
    }

    applicationsListContainer.innerHTML = filtered.map(app => {
      const statusBadgeClass = {
        'Under Review': 'badge-under-review',
        'Processing': 'badge-processing',
        'Completed': 'badge-completed',
        'Documents Required': 'badge-docs-required',
        'Payment Pending': 'badge-pending',
        'Rejected': 'badge-failed'
      }[app.status] || 'badge-pending';

      return `
        <div class="app-card-item animate-fade-in">
          <div class="app-card-header">
            <div>
              <span class="app-id-tag">${DOSUtils.escapeHtml(app.applicationId || app.id)}</span>
              <h4 style="font-size:1.1rem; margin-top:0.35rem; font-weight:700;">${DOSUtils.escapeHtml(app.serviceName)}</h4>
            </div>
            <span class="badge ${statusBadgeClass}">${DOSUtils.escapeHtml(app.status)}</span>
          </div>

          <div class="app-details-grid">
            <div>
              <span class="app-meta-label">Applied Date</span>
              <span class="app-meta-value">${DOSUtils.formatDate(app.createdAt, true)}</span>
            </div>
            <div>
              <span class="app-meta-label">Total Fee Paid</span>
              <span class="app-meta-value">${DOSUtils.formatINR(app.amount)}</span>
            </div>
            <div>
              <span class="app-meta-label">Payment ID</span>
              <span class="app-meta-value" style="font-family:monospace;">${DOSUtils.escapeHtml(app.paymentId || '—')}</span>
            </div>
            <div>
              <span class="app-meta-label">Applicant Name</span>
              <span class="app-meta-value">${DOSUtils.escapeHtml(app.customerName)}</span>
            </div>
          </div>

          ${app.remarks ? `
            <div style="background:var(--bg-alt); padding:0.6rem 0.8rem; border-radius:var(--radius-md); font-size:0.8125rem; margin-bottom:1rem;">
              <strong>Operator Remark:</strong> ${DOSUtils.escapeHtml(app.remarks)}
            </div>
          ` : ''}

          <div style="display:flex; justify-content:flex-end; gap:0.5rem; flex-wrap:wrap;">
            <button class="btn btn-outline btn-sm" onclick="window.CustomerApplications.viewTimeline('${app.id || app.applicationId}')">
              <i data-lucide="activity"></i> Track Progress
            </button>
            <button class="btn btn-secondary btn-sm" onclick="DOSReceipts.generateReceipt(${JSON.stringify(app).replace(/"/g, '&quot;')})">
              <i data-lucide="receipt"></i> Receipt
            </button>
            ${app.status === 'Documents Required' ? `
              <button class="btn btn-primary btn-sm" onclick="window.location.href='profile.html#uploadDocs'">
                <i data-lucide="upload"></i> Upload Docs
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons({ root: applicationsListContainer });
  }

  // Filter tabs click
  if (filterTabsContainer) {
    filterTabsContainer.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        filterTabsContainer.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentFilter = pill.getAttribute('data-status');
        renderApplications();
      });
    });
  }

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', DOSUtils.debounce(() => {
      searchQuery = searchInput.value;
      renderApplications();
    }, 200));
  }

  await fetchApplications();
  window.loadMyApplications = fetchApplications;
});

const CustomerApplications = {
  viewTimeline(appId) {
    let app = null;
    const allApps = DOSUtils.demoStore.get('applications', []);
    app = allApps.find(a => (a.applicationId === appId || a.id === appId));

    if (!app) {
      window.showToast('Application details not found.', 'error');
      return;
    }

    const steps = [
      { id: 1, label: 'Payment Received', desc: 'Fee verified via Razorpay gateway.', completed: true, active: false },
      { id: 2, label: 'Under Review', desc: 'Verification of identity and documents by operator.', completed: app.status !== 'Payment Pending', active: app.status === 'Under Review' },
      { id: 3, label: 'Operator Processing', desc: 'Form uploaded to relevant government / agency portal.', completed: ['Processing', 'Completed'].includes(app.status), active: app.status === 'Processing' },
      { id: 4, label: 'Final Output & Completed', desc: 'Certificate / acknowledgement delivered.', completed: app.status === 'Completed', active: false }
    ];

    let overlay = document.getElementById('timelineModalOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'timelineModalOverlay';
      overlay.className = 'modal-overlay';
      document.body.appendChild(overlay);
    }

    const timelineStepsHtml = steps.map(s => {
      const cls = s.completed ? 'completed' : (s.active ? 'active' : '');
      const icon = s.completed ? '✓' : s.id;
      return `
        <div class="timeline-step ${cls}">
          <div class="timeline-marker">${icon}</div>
          <div class="timeline-title">${s.label}</div>
          <div class="timeline-time">${s.desc}</div>
        </div>
      `;
    }).join('');

    overlay.innerHTML = `
      <div class="modal-container" style="max-width: 520px;">
        <div class="modal-header">
          <div>
            <span class="app-id-tag">${DOSUtils.escapeHtml(app.applicationId || app.id)}</span>
            <h3 class="modal-title" style="margin-top:0.25rem;">Application Progress</h3>
          </div>
          <button class="modal-close" onclick="document.getElementById('timelineModalOverlay').classList.remove('active')">&times;</button>
        </div>

        <div class="modal-body">
          <div style="background:#f8fafc; padding:1rem; border-radius:8px; margin-bottom:1.5rem;">
            <div style="font-weight:700; color:var(--primary-navy);">${DOSUtils.escapeHtml(app.serviceName)}</div>
            <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:2px;">Applicant: ${DOSUtils.escapeHtml(app.customerName)} | Applied: ${DOSUtils.formatDate(app.createdAt, true)}</div>
            <div style="margin-top:0.5rem;"><span class="badge badge-under-review">Current Status: ${DOSUtils.escapeHtml(app.status)}</span></div>
          </div>

          <div class="timeline">
            ${timelineStepsHtml}
          </div>

          ${app.remarks ? `
            <div style="margin-top:1.5rem; padding:0.75rem 1rem; background:#EFF6FF; border-left:3px solid var(--royal-blue); border-radius:4px; font-size:0.85rem;">
              <strong>Latest Remark:</strong> ${DOSUtils.escapeHtml(app.remarks)}
            </div>
          ` : ''}
        </div>

        <div class="modal-footer">
          <button class="btn btn-outline" onclick="document.getElementById('timelineModalOverlay').classList.remove('active')">Close</button>
          <button class="btn btn-primary" onclick="DOSReceipts.generateReceipt(${JSON.stringify(app).replace(/"/g, '&quot;')})">
            <i data-lucide="receipt"></i> View Official Receipt
          </button>
        </div>
      </div>
    `;

    overlay.classList.add('active');
    if (window.lucide) window.lucide.createIcons({ root: overlay });
  }
};

window.CustomerApplications = CustomerApplications;

