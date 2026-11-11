/**
 * DINESH ONLINE SOLUTION - GLOBAL APP LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize i18n
  if (window.i18n) {
    window.i18n.init();
  }

  // Initialize Lucide Icons
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  // Language switch buttons
  document.querySelectorAll('.lang-btn, .lang-switch-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.i18n) {
        window.i18n.toggleLanguage();
      }
    });
  });

  // Mobile navigation drawer toggle with backdrop & full accessibility
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  
  if (mobileToggle && mobileDrawer) {
    let backdrop = document.querySelector('.mobile-nav-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'mobile-nav-backdrop';
      document.body.appendChild(backdrop);
    }

    const closeDrawer = () => {
      mobileDrawer.classList.remove('open');
      backdrop.classList.remove('open');
      document.body.classList.remove('mobile-nav-open');
      mobileToggle.innerHTML = '&#9776;';
      mobileToggle.setAttribute('aria-expanded', 'false');
    };

    const openDrawer = () => {
      mobileDrawer.classList.add('open');
      backdrop.classList.add('open');
      document.body.classList.add('mobile-nav-open');
      mobileToggle.innerHTML = '&times;';
      mobileToggle.setAttribute('aria-expanded', 'true');
    };

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    backdrop.addEventListener('click', closeDrawer);

    // Close when tapping any navigation link inside drawer
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeDrawer();
      }
    });
  }

  // Dashboard & Admin mobile sidebar backdrop support
  const adminSidebar = document.querySelector('.admin-sidebar');
  const customerSidebar = document.querySelector('.dashboard-sidebar');
  const activeSidebar = adminSidebar || customerSidebar;
  
  if (activeSidebar) {
    let sidebarBackdrop = document.querySelector('.sidebar-backdrop');
    if (!sidebarBackdrop) {
      sidebarBackdrop = document.createElement('div');
      sidebarBackdrop.className = 'sidebar-backdrop mobile-nav-backdrop';
      document.body.appendChild(sidebarBackdrop);
    }

    const updateSidebarBackdrop = () => {
      if (activeSidebar.classList.contains('open')) {
        sidebarBackdrop.classList.add('open');
        document.body.classList.add('mobile-nav-open');
      } else {
        sidebarBackdrop.classList.remove('open');
        document.body.classList.remove('mobile-nav-open');
      }
    };

    // Watch for click outside
    sidebarBackdrop.addEventListener('click', () => {
      activeSidebar.classList.remove('open');
      updateSidebarBackdrop();
    });

    // Close sidebar on navigation item click on mobile
    activeSidebar.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
          activeSidebar.classList.remove('open');
          updateSidebarBackdrop();
        }
      });
    });

    // Also sync backdrop when toggle buttons are clicked
    document.querySelectorAll('.mobile-nav-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        setTimeout(updateSidebarBackdrop, 50);
      });
    });
  }

  // Sticky navbar shadow on scroll
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    });
  }

  // Check auth state to update navbar buttons
  updateNavAuthState();

  // Re-run icons and translations on language change
  window.addEventListener('dos-language-changed', () => {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  });
});

function updateNavAuthState() {
  const customerSession = localStorage.getItem('dos_customer_session');
  const navAuthContainer = document.querySelector('.nav-auth-actions');
  const isPagesDir = window.location.pathname.includes('/pages/');

  if (customerSession) {
    try {
      const user = JSON.parse(customerSession);
      const dashUrl = isPagesDir ? 'customer-dashboard.html' : 'pages/customer-dashboard.html';
      const initials = (user.name || 'User').slice(0, 2).toUpperCase();

      if (navAuthContainer) {
        navAuthContainer.innerHTML = `
          <a href="${dashUrl}" class="user-menu-trigger">
            <div class="user-avatar-sm">${initials}</div>
            <span>${DOSUtils.escapeHtml(user.name?.split(' ')[0] || 'Dashboard')}</span>
          </a>
        `;
      }

      // Update mobile drawer
      const mobileDrawer = document.querySelector('.mobile-nav-drawer');
      if (mobileDrawer) {
        const bottomSection = mobileDrawer.querySelector('.drawer-auth-section') || mobileDrawer.querySelector('div[style*="border-top"]') || mobileDrawer.lastElementChild;
        if (bottomSection) {
          bottomSection.innerHTML = `
            <a href="${dashUrl}" class="btn btn-primary btn-full" style="display:flex; align-items:center; justify-content:center; gap:0.5rem;">
              <span class="user-avatar-sm" style="width:22px; height:22px; font-size:0.65rem;">${initials}</span>
              ${DOSUtils.escapeHtml(user.name?.split(' ')[0] || 'Customer')} Dashboard
            </a>
            <button onclick="window.customerLogout()" class="btn btn-outline btn-full" style="color:var(--error); border-color:rgba(220,38,38,0.3);">
              Logout
            </button>
          `;
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
}

// Global logout helper for customers
window.customerLogout = function () {
  localStorage.removeItem('dos_customer_session');
  if (window.DOS_CONFIG && window.DOS_CONFIG.isLive) {
    const auth = window.DOS_CONFIG.getAuth();
    if (auth) auth.signOut();
  }
  const isPagesDir = window.location.pathname.includes('/pages/');
  window.location.href = isPagesDir ? 'login.html' : 'pages/login.html';
};

// Global logout helper for admins
window.adminLogout = function () {
  localStorage.removeItem('dos_admin_session');
  if (window.DOS_CONFIG && window.DOS_CONFIG.isLive) {
    const auth = window.DOS_CONFIG.getAuth();
    if (auth) auth.signOut();
  }
  const isPagesDir = window.location.pathname.includes('/pages/');
  window.location.href = isPagesDir ? 'admin-login.html' : 'pages/admin-login.html';
};

