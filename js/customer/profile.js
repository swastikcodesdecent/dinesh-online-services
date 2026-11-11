/**
 * DINESH ONLINE SOLUTION - CUSTOMER PROFILE
 */

document.addEventListener('DOMContentLoaded', () => {
  const customer = DOSAuthSession.getCustomer();
  if (!customer) return;

  // Fill in display values
  const nameInput = document.getElementById('profileName');
  const mobileInput = document.getElementById('profileMobile');
  const emailInput = document.getElementById('profileEmail');
  const addressInput = document.getElementById('profileAddress');
  const customerIdBadge = document.getElementById('profileCustomerId');
  const profileForm = document.getElementById('customerProfileForm');

  if (nameInput) nameInput.value = customer.name || '';
  if (mobileInput) mobileInput.value = customer.mobile || '';
  if (emailInput) emailInput.value = customer.email || '';
  if (addressInput) addressInput.value = customer.address || '';
  if (customerIdBadge) customerIdBadge.textContent = customer.customerId || 'CID-100234';

  if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const updatedName = nameInput.value.trim();
      const updatedEmail = emailInput.value.trim();
      const updatedAddress = addressInput ? addressInput.value.trim() : '';

      if (!DOSValidation.isValidName(updatedName)) {
        window.showToast('Please enter a valid full name.', 'error');
        return;
      }

      if (updatedEmail && !DOSValidation.isValidEmail(updatedEmail)) {
        window.showToast('Please enter a valid email address.', 'error');
        return;
      }

      try {
        const updatedCustomer = {
          ...customer,
          name: updatedName,
          email: updatedEmail,
          address: updatedAddress
        };

        if (window.DOS_CONFIG && window.DOS_CONFIG.isLive) {
          const db = window.DOS_CONFIG.getDb();
          await db.collection('users').doc(customer.mobile).update({
            name: updatedName,
            email: updatedEmail,
            address: updatedAddress,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        } else {
          const users = DOSUtils.demoStore.get('users', []);
          const idx = users.findIndex(u => u.mobile === customer.mobile);
          if (idx !== -1) {
            users[idx] = { ...users[idx], ...updatedCustomer };
            DOSUtils.demoStore.set('users', users);
          }
        }

        DOSAuthSession.setCustomer(updatedCustomer);
        window.showToast('Profile updated successfully!', 'success');

        // Update UI
        document.querySelectorAll('.customer-name-display').forEach(el => {
          el.textContent = updatedName;
        });
      } catch (err) {
        window.showToast(err.message || 'Failed to update profile.', 'error');
      }
    });
  }
});

