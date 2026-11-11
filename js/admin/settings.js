/**
 * DINESH ONLINE SOLUTION - ADMIN SETTINGS
 */

document.addEventListener('DOMContentLoaded', () => {
  const settingsForm = document.getElementById('adminSettingsForm');
  if (!settingsForm) return;

  const currentSettings = DOSUtils.demoStore.get('business_settings', window.DOS_CONFIG.business);

  const phoneInput = document.getElementById('settingPhone');
  const whatsappInput = document.getElementById('settingWhatsapp');
  const emailInput = document.getElementById('settingEmail');
  const addressInput = document.getElementById('settingAddress');
  const hoursInput = document.getElementById('settingHours');
  const announcementInput = document.getElementById('settingAnnouncement');

  if (phoneInput) phoneInput.value = currentSettings.phone || '';
  if (whatsappInput) whatsappInput.value = currentSettings.whatsapp || '';
  if (emailInput) emailInput.value = currentSettings.email || '';
  if (addressInput) addressInput.value = currentSettings.address || '';
  if (hoursInput) hoursInput.value = currentSettings.hours || '';
  if (announcementInput) announcementInput.value = currentSettings.announcement || 'Welcome to Dinesh Online Solution. Your authentic digital service centre.';

  settingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const updated = {
      ...currentSettings,
      phone: phoneInput.value.trim(),
      whatsapp: whatsappInput.value.trim(),
      email: emailInput.value.trim(),
      address: addressInput.value.trim(),
      hours: hoursInput.value.trim(),
      announcement: announcementInput.value.trim()
    };

    DOSUtils.demoStore.set('business_settings', updated);
    window.DOS_CONFIG.business = updated;
    window.showToast('Admin settings & contact details saved successfully!', 'success');
  });
});

