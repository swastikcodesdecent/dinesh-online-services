/**
 * DINESH ONLINE SOLUTION - VALIDATION HELPERS
 */

const DOSValidation = {
  // 10-digit Indian mobile number starting with 6,7,8,9
  isValidIndianMobile(phone) {
    if (!phone) return false;
    const clean = String(phone).replace(/\D/g, '');
    return /^[6-9]\d{9}$/.test(clean);
  },

  // 4-digit PIN validator
  isValidPin(pin) {
    if (!pin) return { valid: false, message: 'PIN is required' };
    const clean = String(pin).trim();
    if (!/^\d{4}$/.test(clean)) {
      return { valid: false, message: 'PIN must be exactly 4 numeric digits' };
    }
    // Block easy guess patterns
    const weakPins = ['0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999', '1234', '4321'];
    if (weakPins.includes(clean)) {
      return { valid: false, message: 'Please avoid obvious patterns like 0000 or 1234' };
    }
    return { valid: true, message: '' };
  },

  // Full Name validator
  isValidName(name) {
    if (!name || typeof name !== 'string') return false;
    const clean = name.trim();
    return clean.length >= 3 && /^[a-zA-Z\s.'-]+$/.test(clean);
  },

  // Standard email validation
  isValidEmail(email) {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  },

  // Indian PAN format: ABCDE1234F
  isValidPAN(pan) {
    if (!pan) return false;
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(String(pan).toUpperCase().trim());
  },

  // Aadhaar: 12 numeric digits
  isValidAadhaar(aadhaar) {
    if (!aadhaar) return false;
    const clean = String(aadhaar).replace(/\D/g, '');
    return clean.length === 12;
  },

  // Document file validator
  validateDocumentFile(file, maxSizeMB = 5) {
    if (!file) {
      return { valid: false, message: 'Please select a file' };
    }
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return {
        valid: false,
        message: 'Invalid file format. Only PDF, JPG, JPEG and PNG files are accepted.'
      };
    }

    if (file.size > maxSizeBytes) {
      return {
        valid: false,
        message: `File size exceeds the ${maxSizeMB}MB limit.`
      };
    }

    return { valid: true, message: 'Valid file' };
  }
};

window.DOSValidation = DOSValidation;

