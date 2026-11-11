/**
 * DINESH ONLINE SOLUTION - SERVICE SEARCH & DIRECTORY RENDERER
 */

document.addEventListener('DOMContentLoaded', async () => {
  const servicesGrid = document.getElementById('servicesGrid');
  const categoryPillsContainer = document.getElementById('categoryPills');
  const searchInput = document.getElementById('serviceSearchInput');

  if (!servicesGrid) return;

  await window.DOSServices.loadServices();

  let activeCategory = 'All Services';
  let searchQuery = '';

  // Render category filter pills
  function renderCategoryPills() {
    if (!categoryPillsContainer) return;
    const categories = window.DOSServices.getCategories();

    categoryPillsContainer.innerHTML = categories.map(cat => {
      const isActive = cat === activeCategory;
      const count = cat === 'All Services'
        ? window.DOSServices.getAll().length
        : window.DOSServices.getByCategory(cat).length;

      return `
        <button class="category-pill-btn ${isActive ? 'active' : ''}" data-category="${DOSUtils.escapeHtml(cat)}">
          ${DOSUtils.escapeHtml(cat)}
          <span class="category-count">${count}</span>
        </button>
      `;
    }).join('');

    categoryPillsContainer.querySelectorAll('.category-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.getAttribute('data-category');
        renderCategoryPills();
        renderServices();
      });
    });
  }

  // Render service cards
  function renderServices() {
    const list = window.DOSServices.search(searchQuery, activeCategory);

    if (list.length === 0) {
      servicesGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">
            <i data-lucide="search-x"></i>
          </div>
          <h4 class="empty-state-title">No services found</h4>
          <p class="empty-state-text">We couldn't find any services matching "${DOSUtils.escapeHtml(searchQuery)}". Try searching for PAN, Aadhaar, Bill, or Certificates.</p>
        </div>
      `;
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
      return;
    }

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

    servicesGrid.innerHTML = list.map(service => {
      const price = service.totalPrice || (service.serviceFee + (service.govtFee || 0));

      const priceHtml = customer ? `
        <div class="service-price-block">
          <span class="service-price-label">Starts at</span>
          <span class="service-price-val">${DOSUtils.formatINR(price)}</span>
        </div>
      ` : `
        <div class="service-price-block">
          <span class="service-price-label">Fee</span>
          <a href="login.html?redirect=services.html" class="price-lock-tag" style="display:inline-flex; align-items:center; gap:0.35rem; font-size:0.75rem; font-weight:600; color:var(--royal-blue); background:var(--royal-blue-light); padding:0.25rem 0.65rem; border-radius:var(--radius-full); text-decoration:none;">
            <i data-lucide="lock" style="width:13px; height:13px;"></i> Create Account to View
          </a>
        </div>
      `;

      return `
        <div class="service-card animate-fade-in" data-service-id="${service.id}">
          <div class="service-card-top">
            <div class="service-icon-box">
              <i data-lucide="${service.icon || 'file-text'}"></i>
            </div>
            <span class="service-category-badge">${DOSUtils.escapeHtml(service.category)}</span>
          </div>

          <h4 class="service-card-title">${DOSUtils.escapeHtml(service.name)}</h4>
          <p class="service-card-desc">${DOSUtils.escapeHtml(service.description)}</p>

          <div class="service-card-footer">
            ${priceHtml}
            <div style="display:flex; gap:0.5rem;">
              <button class="btn btn-outline btn-sm view-details-btn" data-id="${service.id}">
                Details
              </button>
              <button class="btn btn-primary btn-sm apply-btn" data-id="${service.id}">
                Apply
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }

    // Event listeners
    servicesGrid.querySelectorAll('.view-details-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.ServiceDetailsModal.open(btn.getAttribute('data-id'));
      });
    });

    servicesGrid.querySelectorAll('.apply-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.ServiceDetailsModal.proceedToApply(btn.getAttribute('data-id'));
      });
    });
  }

  // Search input handler
  if (searchInput) {
    searchInput.addEventListener('input', DOSUtils.debounce(() => {
      searchQuery = searchInput.value;
      renderServices();
    }, 200));
  }

  renderCategoryPills();
  renderServices();
});

