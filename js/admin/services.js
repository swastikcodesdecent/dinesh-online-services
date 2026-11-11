/**
 * DINESH ONLINE SOLUTION - ADMIN SERVICE & PRICING MANAGEMENT
 */

document.addEventListener('DOMContentLoaded', async () => {
  const tableBody = document.getElementById('adminServicesTableBody');
  const addServiceBtn = document.getElementById('addServiceBtn');
  const searchInput = document.getElementById('adminServiceSearch');
  const categoryFilter = document.getElementById('adminCategoryFilter');
  const countPill = document.getElementById('serviceCountPill');
  const statTotalServices = document.getElementById('statTotalServices');
  const statTotalCategories = document.getElementById('statTotalCategories');
  const statAvgFee = document.getElementById('statAvgFee');

  if (!tableBody) return;

  await window.DOSServices.loadServices();

  let searchQuery = '';
  let selectedCategory = 'All';

  // Helper to map category to styling class
  function getCategoryClass(category) {
    const cat = (category || '').toLowerCase();
    if (cat.includes('pan')) return 'cat-pan';
    if (cat.includes('aadhaar')) return 'cat-aadhaar';
    if (cat.includes('recharge') || cat.includes('bill') || cat.includes('utility')) return 'cat-utility';
    if (cat.includes('form') || cat.includes('job') || cat.includes('exam')) return 'cat-form';
    if (cat.includes('cert')) return 'cat-cert';
    return 'cat-default';
  }

  // Populate category filter dropdown
  function populateCategories() {
    if (!categoryFilter) return;
    const categories = window.DOSServices.getCategories().filter(c => c !== 'All Services');
    categoryFilter.innerHTML = '<option value="All">All Categories</option>' +
      categories.map(c => `<option value="${DOSUtils.escapeHtml(c)}">${DOSUtils.escapeHtml(c)}</option>`).join('');
  }

  // Calculate and update top stat widgets
  function updateStats(allServices) {
    if (statTotalServices) statTotalServices.textContent = `${allServices.length} Services`;
    const categories = window.DOSServices.getCategories().filter(c => c !== 'All Services');
    if (statTotalCategories) statTotalCategories.textContent = `${categories.length} Sectors`;

    if (statAvgFee && allServices.length > 0) {
      const totalFee = allServices.reduce((sum, s) => sum + (s.serviceFee || 0), 0);
      const avg = Math.round(totalFee / allServices.length);
      statAvgFee.textContent = DOSUtils.formatINR(avg);
    }
  }

  function renderServices() {
    let services = window.DOSServices.getAll();
    updateStats(services);

    // Apply category filter
    if (selectedCategory && selectedCategory !== 'All') {
      services = services.filter(s => s.category === selectedCategory);
    }

    // Apply search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      services = services.filter(s =>
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.id && s.id.toLowerCase().includes(q)) ||
        (s.category && s.category.toLowerCase().includes(q)) ||
        (s.description && s.description.toLowerCase().includes(q))
      );
    }

    if (countPill) {
      const total = window.DOSServices.getAll().length;
      countPill.textContent = `Showing ${services.length} of ${total} services`;
    }

    if (services.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding:3.5rem 1.5rem;">
            <div style="max-width:320px; margin:0 auto; color:var(--text-muted);">
              <i data-lucide="search-x" style="width:40px; height:40px; margin:0 auto 0.75rem; display:block; opacity:0.5;"></i>
              <div style="font-weight:700; color:var(--text-main); font-size:1rem; margin-bottom:0.25rem;">No services match your filter</div>
              <div style="font-size:0.8125rem;">Try adjusting your search query or reset the category dropdown.</div>
            </div>
          </td>
        </tr>
      `;
      if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
      return;
    }

    tableBody.innerHTML = services.map(s => {
      const price = s.totalPrice || (s.serviceFee + (s.govtFee || 0));
      const catClass = getCategoryClass(s.category);
      const docsCount = (s.requiredDocs || []).length;
      const docsLabel = docsCount === 1 ? '1 required doc' : `${docsCount} required docs`;

      return `
        <tr>
          <td>
            <span class="badge-code">${DOSUtils.escapeHtml(s.id)}</span>
          </td>
          <td>
            <div class="service-cell">
              <div class="service-cell-icon">
                <i data-lucide="${s.icon || 'file-text'}"></i>
              </div>
              <div class="service-cell-info">
                <span class="service-cell-name">${DOSUtils.escapeHtml(s.name)}</span>
                <span class="service-cell-sub">${docsLabel}</span>
              </div>
            </div>
          </td>
          <td>
            <span class="category-badge ${catClass}">
              ${DOSUtils.escapeHtml(s.category)}
            </span>
          </td>
          <td style="text-align:right;">
            <span class="fee-val-operator">${DOSUtils.formatINR(s.serviceFee)}</span>
          </td>
          <td style="text-align:right;">
            <span class="fee-val-govt">${s.govtFee > 0 ? DOSUtils.formatINR(s.govtFee) : '<span style="color:var(--text-muted);">₹0 (Free)</span>'}</span>
          </td>
          <td style="text-align:right;">
            <span class="fee-val-total">${DOSUtils.formatINR(price)}</span>
          </td>
          <td>
            <div class="action-btn-group" style="justify-content:center;">
              <button class="btn-action-edit" onclick="window.editService('${s.id}')" title="Edit Service">
                <i data-lucide="edit-3"></i> Edit
              </button>
              <button class="btn-action-delete" onclick="window.deleteService('${s.id}')" title="Delete Service">
                <i data-lucide="trash-2"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  // Real-time search and filter events
  if (searchInput) {
    searchInput.addEventListener('input', DOSUtils.debounce(() => {
      searchQuery = searchInput.value.trim();
      renderServices();
    }, 150));
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', () => {
      selectedCategory = categoryFilter.value;
      renderServices();
    });
  }

  // Edit / Add Modal with real-time fee calculation
  window.editService = function (serviceId, isNew = false) {
    let service = window.DOSServices.getById(serviceId);
    if (!service) {
      service = {
        id: serviceId,
        name: '',
        category: 'PAN Services',
        serviceFee: 100,
        govtFee: 0,
        description: '',
        requiredDocs: ['Aadhaar Card']
      };
    }

    let overlay = document.getElementById('editServiceModal');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'editServiceModal';
      overlay.className = 'modal-overlay';
      document.body.appendChild(overlay);
    }

    const categories = window.DOSServices.getCategories().filter(c => c !== 'All Services');
    const catOptions = categories.map(c => `
      <option value="${DOSUtils.escapeHtml(c)}" ${c === service.category ? 'selected' : ''}>
        ${DOSUtils.escapeHtml(c)}
      </option>
    `).join('');

    const initialTotal = (Number(service.serviceFee) || 0) + (Number(service.govtFee) || 0);

    overlay.innerHTML = `
      <div class="modal-container" style="max-width: 560px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-tag" style="font-size:0.7rem;">${isNew ? 'New Catalog Offering' : 'Price & Details Configuration'}</span>
            <h3 class="modal-title" style="margin-top:0.25rem;">${isNew ? 'Add New Digital Service' : 'Edit: ' + DOSUtils.escapeHtml(service.name)}</h3>
          </div>
          <button class="modal-close" onclick="document.getElementById('editServiceModal').classList.remove('active')">&times;</button>
        </div>

        <div class="modal-body">
          <form id="editServiceForm">
            <div class="form-group">
              <label class="form-label required">Unique Service ID / Code</label>
              <input type="text" id="editServiceId" class="form-control" value="${DOSUtils.escapeHtml(service.id)}" ${isNew ? '' : 'readonly'} style="${isNew ? '' : 'background:#F1F5F9; font-family:monospace;'}" required>
            </div>

            <div class="form-group">
              <label class="form-label required">Public Service Name</label>
              <input type="text" id="editServiceName" class="form-control" value="${DOSUtils.escapeHtml(service.name)}" placeholder="e.g. New PAN Card Application" required>
            </div>

            <div class="form-group">
              <label class="form-label required">Service Category</label>
              <select id="editServiceCat" class="form-control" required>
                ${catOptions}
                <option value="Other Digital Services">Other Digital Services</option>
              </select>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
              <div class="form-group">
                <label class="form-label required">Operator Facilitation Fee (₹)</label>
                <input type="number" id="editServiceFee" class="form-control" value="${service.serviceFee}" min="0" required>
              </div>

              <div class="form-group">
                <label class="form-label">Government Statutory Fee (₹)</label>
                <input type="number" id="editServiceGovtFee" class="form-control" value="${service.govtFee || 0}" min="0">
              </div>
            </div>

            <!-- Live Calculation Summary Box -->
            <div class="admin-modal-calc-box">
              <div class="calc-row-item">
                <span class="calc-label">Operator Fee</span>
                <span class="calc-amount" id="previewOpFee">${DOSUtils.formatINR(service.serviceFee)}</span>
              </div>
              <div style="color:var(--text-muted); font-size:1.25rem;">+</div>
              <div class="calc-row-item">
                <span class="calc-label">Govt Pass-through</span>
                <span class="calc-amount" id="previewGovtFee">${DOSUtils.formatINR(service.govtFee || 0)}</span>
              </div>
              <div style="color:var(--text-muted); font-size:1.25rem;">=</div>
              <div class="calc-row-item">
                <span class="calc-label">Total Customer Price</span>
                <span class="calc-amount" style="color:var(--royal-blue); font-size:1.2rem;" id="previewTotalFee">${DOSUtils.formatINR(initialTotal)}</span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Service Description</label>
              <textarea id="editServiceDesc" class="form-control" rows="2" placeholder="Brief explanation shown on service card...">${DOSUtils.escapeHtml(service.description || '')}</textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Required Documents (comma separated)</label>
              <input type="text" id="editServiceDocs" class="form-control" value="${(service.requiredDocs || []).join(', ')}" placeholder="e.g. Aadhaar Card, Passport Photo, Signature">
            </div>

            <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:1.5rem; padding-top:1rem; border-top:1px solid var(--border-light);">
              <button type="button" class="btn btn-outline" onclick="document.getElementById('editServiceModal').classList.remove('active')">Cancel</button>
              <button type="submit" class="btn btn-primary">
                <i data-lucide="check"></i> Save Service Offering
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    overlay.classList.add('active');
    if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();

    // Live calculation listeners
    const feeInput = document.getElementById('editServiceFee');
    const govtInput = document.getElementById('editServiceGovtFee');
    const previewOp = document.getElementById('previewOpFee');
    const previewGovt = document.getElementById('previewGovtFee');
    const previewTotal = document.getElementById('previewTotalFee');

    function updatePreview() {
      const op = Number(feeInput.value) || 0;
      const govt = Number(govtInput.value) || 0;
      const tot = op + govt;
      if (previewOp) previewOp.textContent = DOSUtils.formatINR(op);
      if (previewGovt) previewGovt.textContent = DOSUtils.formatINR(govt);
      if (previewTotal) previewTotal.textContent = DOSUtils.formatINR(tot);
    }

    if (feeInput) feeInput.addEventListener('input', updatePreview);
    if (govtInput) govtInput.addEventListener('input', updatePreview);

    // Save handler
    document.getElementById('editServiceForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const idVal = document.getElementById('editServiceId').value.trim();
      const opFee = Number(feeInput.value) || 0;
      const govtFee = Number(govtInput.value) || 0;
      const docsVal = document.getElementById('editServiceDocs').value.split(',').map(d => d.trim()).filter(Boolean);

      const updated = {
        ...service,
        id: idVal,
        name: document.getElementById('editServiceName').value.trim(),
        category: document.getElementById('editServiceCat').value.trim(),
        serviceFee: opFee,
        govtFee: govtFee,
        totalPrice: opFee + govtFee,
        description: document.getElementById('editServiceDesc').value.trim(),
        requiredDocs: docsVal.length > 0 ? docsVal : ['Aadhaar Card']
      };

      if (window.DOS_CONFIG && window.DOS_CONFIG.isLive) {
        const db = window.DOS_CONFIG.getDb();
        await db.collection('services').doc(idVal).set(updated, { merge: true });
      }

      const all = window.DOSServices.getAll();
      const idx = all.findIndex(s => s.id === idVal);
      if (idx !== -1) {
        all[idx] = updated;
      } else {
        all.unshift(updated);
      }
      DOSUtils.demoStore.set('services', all);
      window.DOSServices.services = all;

      overlay.classList.remove('active');
      window.showToast(isNew ? 'New service added to catalogue!' : 'Service pricing updated successfully!', 'success');
      populateCategories();
      renderServices();
    });
  };

  // Delete Service
  window.deleteService = async function (serviceId) {
    const service = window.DOSServices.getById(serviceId);
    const serviceName = service ? service.name : serviceId;

    const confirmed = await window.notificationManager.confirm({
      title: 'Remove Service',
      message: `Are you sure you want to remove "${serviceName}" from the public digital catalogue? Customers will no longer be able to apply for it.`,
      isDanger: true,
      confirmText: 'Remove Service'
    });

    if (!confirmed) return;

    if (window.DOS_CONFIG && window.DOS_CONFIG.isLive) {
      const db = window.DOS_CONFIG.getDb();
      await db.collection('services').doc(serviceId).delete();
    }

    let all = window.DOSServices.getAll();
    all = all.filter(s => s.id !== serviceId);
    DOSUtils.demoStore.set('services', all);
    window.DOSServices.services = all;

    window.showToast(`"${serviceName}" removed from catalog.`, 'info');
    populateCategories();
    renderServices();
  };

  // Add Service Trigger
  if (addServiceBtn) {
    addServiceBtn.addEventListener('click', () => {
      const suggestedId = 'srv-' + Date.now().toString(36);
      window.editService(suggestedId, true);
    });
  }

  populateCategories();
  renderServices();
});
