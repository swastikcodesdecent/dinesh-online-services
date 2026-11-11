/**
 * DINESH ONLINE SOLUTION - CUSTOMER LOGIN
 */

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  const mobileInput = document.getElementById('loginMobile');
  const pinInput = document.getElementById('loginPin');
  const alertContainer = document.getElementById('loginAlertContainer');
  const submitBtn = document.getElementById('loginSubmitBtn');

  // Check lockout on load
  function updateLockoutUI(mobile) {
    if (!mobile || !DOSValidation.isValidIndianMobile(mobile)) return false;
    const lockout = DOSAuthSession.checkLockout(mobile);
    if (lockout.isLocked) {
      const minutes = Math.ceil(lockout.remainingSec / 60);
      if (alertContainer) {
        alertContainer.innerHTML = `
          <div class="auth-alert error">
            <i data-lucide="shield-alert"></i>
            <div>Account temporarily locked due to repeated incorrect attempts. Please try again after <strong>${minutes} minutes</strong> or reset your PIN.</div>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
      }
      submitBtn.disabled = true;
      return true;
    }
    if (alertContainer) alertContainer.innerHTML = '';
    submitBtn.disabled = false;
    return false;
  }

  mobileInput.addEventListener('input', () => {
    const cleanMobile = mobileInput.value.replace(/\D/g, '');
    if (cleanMobile.length === 10) {
      updateLockoutUI(cleanMobile);
    }
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const mobile = mobileInput.value.replace(/\D/g, '');
    const pin = pinInput.value.trim();

    if (!DOSValidation.isValidIndianMobile(mobile)) {
      window.showToast('Please enter a valid 10-digit mobile number.', 'error');
      mobileInput.focus();
      return;
    }

    if (pin.length !== 4) {
      window.showToast('Please enter your 4-digit PIN.', 'error');
      pinInput.focus();
      return;
    }

    // Check lockout status
    if (updateLockoutUI(mobile)) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner spinner-sm spinner-white"></span> Verifying...';

    try {
      const inputHash = await DOSAuthSession.hashPin(pin);
      let authenticatedUser = null;

      // 1. Live Firebase
      if (window.DOS_CONFIG && window.DOS_CONFIG.isLive) {
        const db = window.DOS_CONFIG.getDb();
        const pinDoc = await db.collection('pinCredentials').doc(mobile).get();

        if (!pinDoc.exists) {
          throw new Error('Mobile number not found. Please register first.');
        }

        const creds = pinDoc.data();
        if (creds.hashedPin !== inputHash) {
          const lockData = DOSAuthSession.recordFailedAttempt(mobile);
          const remaining = DOSAuthSession.MAX_FAILED_ATTEMPTS - (lockData.attempts % DOSAuthSession.MAX_FAILED_ATTEMPTS);
          throw new Error(`Incorrect PIN. ${remaining > 0 ? remaining + ' attempts left before lockout.' : 'Account locked.'}`);
        }

        const userDoc = await db.collection('users').doc(mobile).get();
        authenticatedUser = userDoc.data();
      } else {
        // Fallback demo storage
        const users = DOSUtils.demoStore.get('users', []);
        const user = users.find(u => u.mobile === mobile);

        // Preload demo user if empty
        if (!user && (mobile === '9876543210' || mobile === '9131171406')) {
          const defaultHash = await DOSAuthSession.hashPin('1234');
          const demoUser = {
            customerId: mobile === '9131171406' ? 'CID-100235' : 'CID-100234',
            name: 'Dinesh Kumar',
            mobile: mobile,
            hashedPin: defaultHash,
            createdAt: new Date().toISOString(),
            status: 'active'
          };
          users.push(demoUser);
          DOSUtils.demoStore.set('users', users);
        }

        const validUser = users.find(u => u.mobile === mobile);
        if (!validUser) {
          throw new Error('Mobile number not registered. Please register first.');
        }

        if (validUser.hashedPin !== inputHash) {
          const lockData = DOSAuthSession.recordFailedAttempt(mobile);
          const remaining = DOSAuthSession.MAX_FAILED_ATTEMPTS - (lockData.attempts % DOSAuthSession.MAX_FAILED_ATTEMPTS);
          throw new Error(`Incorrect PIN. ${remaining > 0 ? remaining + ' attempts left before lockout.' : 'Account locked.'}`);
        }

        authenticatedUser = {
          customerId: validUser.customerId,
          name: validUser.name,
          mobile: validUser.mobile,
          email: validUser.email || '',
          status: validUser.status || 'active'
        };
      }

      // Success
      DOSAuthSession.resetFailedAttempts(mobile);
      DOSAuthSession.setCustomer(authenticatedUser);
      window.showToast(`Welcome back, ${authenticatedUser.name}!`, 'success');

      setTimeout(() => {
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get('redirect');
        const isPagesDir = window.location.pathname.includes('/pages/');
        const defaultDash = isPagesDir ? 'customer-dashboard.html' : 'pages/customer-dashboard.html';
        window.location.href = redirect || defaultDash;
      }, 800);

    } catch (err) {
      console.error(err);
      window.showToast(err.message || 'Login failed.', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Sign In';
      updateLockoutUI(mobile);
    }
  });
});

