/**
 * DINESH ONLINE SOLUTION - ADMIN AUTH GUARD
 * Protects admin panel routes:
 * admin-dashboard.html, admin-customers.html, admin-services.html,
 * admin-applications.html, admin-payments.html, admin-support.html, admin-settings.html
 */

(function () {
  const currentPath = window.location.pathname;
  const isAdminPage = [
    'admin-dashboard.html',
    'admin-customers.html',
    'admin-services.html',
    'admin-applications.html',
    'admin-payments.html',
    'admin-support.html',
    'admin-settings.html'
  ].some(page => currentPath.endsWith(page));

  if (!isAdminPage) return;

  function redirectToAdminLogin() {
    const isPagesDir = currentPath.includes('/pages/');
    const loginUrl = isPagesDir ? 'admin-login.html' : 'pages/admin-login.html';
    window.location.replace(loginUrl);
  }

  // Check Admin Session
  const adminSession = localStorage.getItem('dos_admin_session');
  if (!adminSession) {
    redirectToAdminLogin();
    return;
  }

  try {
    const admin = JSON.parse(adminSession);
    if (!admin || admin.role !== 'admin') {
      localStorage.removeItem('dos_admin_session');
      redirectToAdminLogin();
    }
  } catch (e) {
    localStorage.removeItem('dos_admin_session');
    redirectToAdminLogin();
  }
})();

