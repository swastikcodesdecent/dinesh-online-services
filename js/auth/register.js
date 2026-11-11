/**
 * DINESH ONLINE SOLUTION - CUSTOMER REGISTRATION
 */

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  if (!registerForm) return;

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('fullName');
    const mobileInput = document.getElementById('mobileNumber');
    const pinInput = document.getElementById('createPin');
    const confirmPinInput = document.getElementById('confirmPin');
    const termsInput = document.getElementById('acceptTerms');
    const submitBtn = document.getElementById('registerSubmitBtn');

    const name = nameInput.value.trim();
    const mobile = mobileInput.value.replace(/\D/g, '');
    const pin = pinInput.value.trim();
    const confirmPin = confirmPinInput.value.trim();
    const terms = termsInput ? termsInput.checked : true;

    // Validation
    if (!DOSValidation.isValidName(name)) {
      window.showToast('Please enter a valid full name (at least 3 alphabetic characters).', 'error');
      nameInput.focus();
      return;
    }

    if (!DOSValidation.isValidIndianMobile(mobile)) {
      window.showToast('Please enter a valid 10-digit Indian mobile number.', 'error');
      mobileInput.focus();
      return;
    }

    const pinCheck = DOSValidation.isValidPin(pin);
    if (!pinCheck.valid) {
      window.showToast(pinCheck.message, 'error');
      pinInput.focus();
      return;
    }

    if (pin !== confirmPin) {
      window.showToast('PIN and Confirm PIN do not match.', 'error');
      confirmPinInput.focus();
      return;
    }

    if (!terms) {
      window.showToast('You must accept the Terms and Conditions to proceed.', 'warning');
      return;
    }

    // Processing UI state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner spinner-sm spinner-white"></span> Creating Account...';

    try {
      const hashedPin = await DOSAuthSession.hashPin(pin);
      const customerId = DOSUtils.generateCustomerId();
      const userData = {
        customerId,
        name,
        mobile,
        createdAt: new Date().toISOString(),
        status: 'active'
      };

      // 1. If live Firebase is configured
      if (window.DOS_CONFIG && window.DOS_CONFIG.isLive) {
        const db = window.DOS_CONFIG.getDb();
        // Check if user already exists
        const userDoc = await db.collection('users').doc(mobile).get();
        if (userDoc.exists) {
          throw new Error('This mobile number is already registered. Please login.');
        }

        // Store user profile
        await db.collection('users').doc(mobile).set(userData);

        // Store hashed pin credentials in protected subcollection
        await db.collection('pinCredentials').doc(mobile).set({
          hashedPin,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      } else {
        // Fallback demo storage in localStorage
        const users = DOSUtils.demoStore.get('users', []);
        const exists = users.find(u => u.mobile === mobile);
        if (exists) {
          throw new Error('This mobile number is already registered. Please login.');
        }
        users.push({ ...userData, hashedPin });
        DOSUtils.demoStore.set('users', users);
      }

      // Save customer session
      DOSAuthSession.setCustomer(userData);
      window.showToast('Registration successful! Welcome to Dinesh Online Solution.', 'success');

      setTimeout(() => {
        const isPagesDir = window.location.pathname.includes('/pages/');
        window.location.href = isPagesDir ? 'customer-dashboard.html' : 'pages/customer-dashboard.html';
      }, 1000);

    } catch (err) {
      console.error(err);
      window.showToast(err.message || 'Registration failed. Please try again.', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Complete Registration';
    }
  });
});

