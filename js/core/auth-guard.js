/**
 * DINESH ONLINE SOLUTION - CUSTOMER AUTH GUARD
 * Protects customer panel routes: customer-dashboard.html, my-applications.html, payment-history.html, profile.html
 */

(function () {
  const currentPath = window.location.pathname;
  const isCustomerPage = [
    'customer-dashboard.html',
    'my-applications.html',
    'payment-history.html',
    'profile.html'
  ].some(page => currentPath.endsWith(page));

  if (!isCustomerPage) return;

  function redirectToLogin() {
    const isPagesDir = currentPath.includes('/pages/');
    const loginUrl = isPagesDir ? 'login.html' : 'pages/login.html';
    window.location.replace(`${loginUrl}?redirect=${encodeURIComponent(window.location.href)}`);
  }

  // Check Session
  const sessionUser = localStorage.getItem('dos_customer_session');
  if (!sessionUser) {
    redirectToLogin();
    return;
  }

  try {
    const user = JSON.parse(sessionUser);
    if (!user || !user.mobile) {
      localStorage.removeItem('dos_customer_session');
      redirectToLogin();
    }
  } catch (e) {
    localStorage.removeItem('dos_customer_session');
    redirectToLogin();
  }
})();

