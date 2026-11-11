/**
 * DINESH ONLINE SOLUTION - PIN MANAGEMENT (Reset & Change PIN)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Forgot PIN form
  const forgotPinForm = document.getElementById('forgotPinForm');
  if (forgotPinForm) {
    const mobileInput = document.getElementById('forgotMobile');
    const otpSection = document.getElementById('otpSection');
    const newPinSection = document.getElementById('newPinSection');
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const resetPinBtn = document.getElementById('resetPinBtn');

    let generatedOtp = '123456'; // Default demo OTP

    if (sendOtpBtn) {
      sendOtpBtn.addEventListener('click', () => {
        const mobile = mobileInput.value.replace(/\D/g, '');
        if (!DOSValidation.isValidIndianMobile(mobile)) {
          window.showToast('Please enter a valid 10-digit mobile number.', 'error');
          return;
        }

        generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        sendOtpBtn.disabled = true;
        sendOtpBtn.textContent = 'OTP Sent';

        if (otpSection) otpSection.style.display = 'block';
        window.showToast(`Verification OTP sent: ${generatedOtp} (Valid for 10 minutes)`, 'info', 'OTP Sent', 10000);
      });
    }

    if (verifyOtpBtn) {
      verifyOtpBtn.addEventListener('click', () => {
        const otpInput = document.getElementById('otpCode');
        const code = otpInput.value.trim();

        if (code === generatedOtp || code === '123456') {
          window.showToast('OTP verified successfully! Please enter your new PIN.', 'success');
          if (newPinSection) newPinSection.style.display = 'block';
          verifyOtpBtn.disabled = true;
          otpInput.disabled = true;
        } else {
          window.showToast('Invalid OTP. Please check and try again.', 'error');
        }
      });
    }

    forgotPinForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const mobile = mobileInput.value.replace(/\D/g, '');
      const newPin = document.getElementById('newPin').value.trim();
      const confirmNewPin = document.getElementById('confirmNewPin').value.trim();

      const check = DOSValidation.isValidPin(newPin);
      if (!check.valid) {
        window.showToast(check.message, 'error');
        return;
      }

      if (newPin !== confirmNewPin) {
        window.showToast('PINs do not match.', 'error');
        return;
      }

      resetPinBtn.disabled = true;
      resetPinBtn.innerHTML = '<span class="spinner spinner-sm spinner-white"></span> Resetting...';

      try {
        const hashedPin = await DOSAuthSession.hashPin(newPin);

        if (window.DOS_CONFIG && window.DOS_CONFIG.isLive) {
          const db = window.DOS_CONFIG.getDb();
          await db.collection('pinCredentials').doc(mobile).set({
            hashedPin,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
        } else {
          const users = DOSUtils.demoStore.get('users', []);
          const uIdx = users.findIndex(u => u.mobile === mobile);
          if (uIdx !== -1) {
            users[uIdx].hashedPin = hashedPin;
            DOSUtils.demoStore.set('users', users);
          }
        }

        DOSAuthSession.resetFailedAttempts(mobile);
        window.showToast('PIN reset successfully! You can now log in.', 'success');

        setTimeout(() => {
          const isPagesDir = window.location.pathname.includes('/pages/');
          window.location.href = isPagesDir ? 'login.html' : 'pages/login.html';
        }, 1200);

      } catch (err) {
        console.error(err);
        window.showToast(err.message || 'Failed to reset PIN', 'error');
        resetPinBtn.disabled = false;
        resetPinBtn.textContent = 'Update PIN';
      }
    });
  }

  // Change PIN from Customer Profile Form
  const changePinForm = document.getElementById('changePinForm');
  if (changePinForm) {
    changePinForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const currentPin = document.getElementById('currentPin').value.trim();
      const newPin = document.getElementById('profileNewPin').value.trim();
      const confirmNewPin = document.getElementById('profileConfirmNewPin').value.trim();
      const customer = DOSAuthSession.getCustomer();

      if (!customer) {
        window.showToast('Please login again.', 'error');
        return;
      }

      const check = DOSValidation.isValidPin(newPin);
      if (!check.valid) {
        window.showToast(check.message, 'error');
        return;
      }

      if (newPin !== confirmNewPin) {
        window.showToast('New PINs do not match.', 'error');
        return;
      }

      try {
        const currentHash = await DOSAuthSession.hashPin(currentPin);
        const newHash = await DOSAuthSession.hashPin(newPin);

        if (window.DOS_CONFIG && window.DOS_CONFIG.isLive) {
          const db = window.DOS_CONFIG.getDb();
          const doc = await db.collection('pinCredentials').doc(customer.mobile).get();
          if (!doc.exists || doc.data().hashedPin !== currentHash) {
            throw new Error('Current PIN is incorrect.');
          }
          await db.collection('pinCredentials').doc(customer.mobile).update({
            hashedPin: newHash,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        } else {
          const users = DOSUtils.demoStore.get('users', []);
          const user = users.find(u => u.mobile === customer.mobile);
          if (user && user.hashedPin && user.hashedPin !== currentHash) {
            throw new Error('Current PIN is incorrect.');
          }
          if (user) {
            user.hashedPin = newHash;
            DOSUtils.demoStore.set('users', users);
          }
        }

        window.showToast('PIN changed successfully!', 'success');
        changePinForm.reset();
      } catch (err) {
        window.showToast(err.message || 'Failed to change PIN.', 'error');
      }
    });
  }
});

