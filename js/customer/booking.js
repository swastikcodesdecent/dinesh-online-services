/**
 * DINESH ONLINE SOLUTION - SERVICE APPLICATION BOOKING & CHECKOUT
 */

const CustomerBooking = {
  activeService: null,
  uploadedFiles: [],

  async openBookingModal(serviceId) {
    if (!window.DOSServices.getAll().length) {
      await window.DOSServices.loadServices();
    }
    const service = window.DOSServices.getById(serviceId);
    if (!service) {
      window.showToast('Selected service not found.', 'error');
      return;
    }

    const customer = DOSAuthSession.getCustomer();
    if (!customer) {
      window.showToast('Please login to apply.', 'warning');
      const isPagesDir = window.location.pathname.includes('/pages/');
      window.location.href = isPagesDir ? 'login.html' : 'pages/login.html';
      return;
    }

    this.activeService = service;
    this.uploadedFiles = [];

    let overlay = document.getElementById('bookingModalOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'bookingModalOverlay';
      overlay.className = 'modal-overlay';
      document.body.appendChild(overlay);
    }

    const price = service.totalPrice || (service.serviceFee + (service.govtFee || 0));

    overlay.innerHTML = `
      <div class="modal-container" style="max-width: 620px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-pending" style="font-size:0.7rem;">Application Booking</span>
            <h3 class="modal-title" style="margin-top:0.25rem;">${DOSUtils.escapeHtml(service.name)}</h3>
          </div>
          <button class="modal-close" onclick="CustomerBooking.close()">&times;</button>
        </div>

        <div class="modal-body">
          <form id="bookingSubmissionForm">
            <!-- Applicant Details -->
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label required">Applicant Full Name</label>
                <input type="text" id="bookingApplicantName" class="form-control" value="${DOSUtils.escapeHtml(customer.name)}" required>
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label required">Mobile Number</label>
                <input type="text" id="bookingApplicantMobile" class="form-control" value="${customer.mobile}" readonly style="background:#f8fafc;">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Application Notes / Special Instructions</label>
              <textarea id="bookingNotes" class="form-control" rows="2" placeholder="e.g. Correction in Date of Birth to 15/08/1995, electricity consumer number 12345678..."></textarea>
            </div>

            <!-- Document Upload Box -->
            <div class="form-group">
              <label class="form-label">Attach Required Documents (PDF, JPG, PNG - Max 5MB each)</label>
              <div class="upload-dropzone" id="bookingDropzone">
                <i data-lucide="upload-cloud" class="upload-icon"></i>
                <div style="font-weight:600; font-size:0.9rem;">Click or Drag documents here to attach</div>
                <div class="text-meta" style="margin-top:0.25rem;">
                  Required: ${(service.requiredDocs || ['Identification Proof']).join(', ')}
                </div>
                <input type="file" id="bookingFileInput" multiple accept=".pdf,.jpg,.jpeg,.png" style="display:none;">
              </div>
              <div id="bookingFilesList" class="uploaded-files-list"></div>
            </div>

            <!-- Pricing Summary -->
            <div class="fee-breakdown-card" style="margin: 1rem 0;">
              <div class="fee-row">
                <span>Facilitation Service Charge:</span>
                <span>${DOSUtils.formatINR(service.serviceFee)}</span>
              </div>
              <div class="fee-row">
                <span>Official Government / Portal Fee:</span>
                <span>${service.govtFee > 0 ? DOSUtils.formatINR(service.govtFee) : '₹0 (Free / Nil)'}</span>
              </div>
              <div class="fee-row total">
                <span>Total Amount Due:</span>
                <span class="color-royal font-bold">${DOSUtils.formatINR(price)}</span>
              </div>
            </div>

            <button type="submit" id="bookingPaySubmitBtn" class="btn btn-primary btn-full btn-lg">
              <i data-lucide="lock"></i> Pay ${DOSUtils.formatINR(price)} & Submit Application
            </button>
          </form>
        </div>
      </div>
    `;

    overlay.classList.add('active');
    if (window.lucide) window.lucide.createIcons({ root: overlay });

    // Setup dropzone & file input events
    const dropzone = overlay.querySelector('#bookingDropzone');
    const fileInput = overlay.querySelector('#bookingFileInput');

    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files) {
        CustomerBooking.handleFiles(Array.from(e.dataTransfer.files));
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files) {
        CustomerBooking.handleFiles(Array.from(fileInput.files));
      }
    });

    // Form submission
    const form = overlay.querySelector('#bookingSubmissionForm');
    form.addEventListener('submit', (e) => CustomerBooking.handleSubmit(e));
  },

  close() {
    const overlay = document.getElementById('bookingModalOverlay');
    if (overlay) overlay.classList.remove('active');
  },

  handleFiles(files) {
    const container = document.getElementById('bookingFilesList');
    if (!container) return;

    for (const file of files) {
      const val = DOSValidation.validateDocumentFile(file);
      if (!val.valid) {
        window.showToast(`${file.name}: ${val.message}`, 'error');
        continue;
      }
      this.uploadedFiles.push(file);
    }

    this.renderFilesList();
  },

  renderFilesList() {
    const container = document.getElementById('bookingFilesList');
    if (!container) return;

    if (this.uploadedFiles.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = this.uploadedFiles.map((file, idx) => {
      const sizeKb = Math.round(file.size / 1024);
      return `
        <div class="file-item-chip">
          <div class="file-meta">
            <i data-lucide="file-check" style="color:var(--success); font-size:1rem;"></i>
            <span><strong>${DOSUtils.escapeHtml(file.name)}</strong> (${sizeKb} KB)</span>
          </div>
          <button type="button" class="file-remove-btn" onclick="CustomerBooking.removeFile(${idx})">&times;</button>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons({ root: container });
  },

  removeFile(index) {
    this.uploadedFiles.splice(index, 1);
    this.renderFilesList();
  },

  async handleSubmit(e) {
    e.preventDefault();
    const customer = DOSAuthSession.getCustomer();
    if (!customer) return;

    const applicantName = document.getElementById('bookingApplicantName').value.trim();
    const notes = document.getElementById('bookingNotes').value.trim();
    const submitBtn = document.getElementById('bookingPaySubmitBtn');
    const service = this.activeService;

    if (!applicantName) {
      window.showToast('Please provide the applicant name.', 'error');
      return;
    }

    const price = service.totalPrice || (service.serviceFee + (service.govtFee || 0));
    const applicationId = DOSUtils.generateApplicationId();

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner spinner-sm spinner-white"></span> Initiating Payment...';

    try {
      // 1. Process payment via Razorpay
      const paymentResult = await DOSRazorpay.initiatePayment({
        amount: price,
        serviceName: service.name,
        serviceId: service.id,
        customerName: applicantName,
        customerMobile: customer.mobile,
        applicationId
      });

      if (!paymentResult.success) {
        throw new Error('Payment was not completed.');
      }

      submitBtn.innerHTML = '<span class="spinner spinner-sm spinner-white"></span> Submitting Application...';

      // Document references
      const docMetadata = this.uploadedFiles.map(f => ({
        name: f.name,
        size: f.size,
        type: f.type,
        uploadedAt: new Date().toISOString()
      }));

      const applicationData = {
        applicationId,
        serviceId: service.id,
        serviceName: service.name,
        category: service.category,
        customerName: applicantName,
        customerMobile: customer.mobile,
        notes,
        serviceFee: service.serviceFee,
        govtFee: service.govtFee || 0,
        amount: price,
        paymentId: paymentResult.paymentId,
        orderId: paymentResult.orderId,
        paymentStatus: 'Paid',
        status: 'Under Review',
        documents: docMetadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        remarks: 'Application submitted successfully. Under document verification by operator.'
      };

      // Store in Firebase or fallback demo store
      if (window.DOS_CONFIG && window.DOS_CONFIG.isLive) {
        const db = window.DOS_CONFIG.getDb();
        await db.collection('applications').doc(applicationId).set(applicationData);
        await db.collection('payments').doc(paymentResult.paymentId).set({
          applicationId,
          serviceId: service.id,
          serviceName: service.name,
          customerName: applicantName,
          customerMobile: customer.mobile,
          amount: price,
          serviceFee: service.serviceFee,
          govtFee: service.govtFee || 0,
          paymentId: paymentResult.paymentId,
          orderId: paymentResult.orderId,
          status: 'Successful',
          createdAt: new Date().toISOString()
        });
      } else {
        const apps = DOSUtils.demoStore.get('applications', []);
        apps.unshift(applicationData);
        DOSUtils.demoStore.set('applications', apps);

        const payments = DOSUtils.demoStore.get('payments', []);
        payments.unshift({
          applicationId,
          serviceName: service.name,
          customerName: applicantName,
          customerMobile: customer.mobile,
          amount: price,
          paymentId: paymentResult.paymentId,
          status: 'Successful',
          createdAt: new Date().toISOString()
        });
        DOSUtils.demoStore.set('payments', payments);
      }

      this.close();
      window.showToast(`Application ${applicationId} submitted successfully!`, 'success', 'Confirmed', 6000);

      // Offer receipt download immediately
      DOSReceipts.generateReceipt(applicationData);

      // Reload dashboard if present
      if (window.loadCustomerDashboardData) {
        window.loadCustomerDashboardData(customer.mobile);
      } else if (window.loadMyApplications) {
        window.loadMyApplications(customer.mobile);
      }

    } catch (err) {
      console.error(err);
      window.showToast(err.message || 'Payment or application submission failed.', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i data-lucide="lock"></i> Pay ${DOSUtils.formatINR(price)} & Submit Application`;
      if (window.lucide) window.lucide.createIcons({ root: submitBtn });
    }
  }
};

window.CustomerBooking = CustomerBooking;

