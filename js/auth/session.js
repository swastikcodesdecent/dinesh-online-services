/**
 * DINESH ONLINE SOLUTION - AUTH SESSION & SECURITY MANAGER
 * Handles session tokens, rate limiting and temporary lockouts
 */

const DOSAuthSession = {
  // Rate limiting & lockout configuration
  MAX_FAILED_ATTEMPTS: 5,
  LOCKOUT_DURATION_MS: 15 * 60 * 1000, // 15 minutes lockout

  // Get current customer session
  getCustomer() {
    const raw = localStorage.getItem('dos_customer_session');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  },

  // Set customer session
  setCustomer(userData) {
    localStorage.setItem('dos_customer_session', JSON.stringify({
      ...userData,
      lastActive: Date.now()
    }));
  },

  // Clear customer session
  clearCustomer() {
    localStorage.removeItem('dos_customer_session');
  },

  // Get Admin session
  getAdmin() {
    const raw = localStorage.getItem('dos_admin_session');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  },

  // Set Admin session
  setAdmin(adminData) {
    localStorage.setItem('dos_admin_session', JSON.stringify({
      ...adminData,
      role: 'admin',
      lastActive: Date.now()
    }));
  },

  // Clear Admin session
  clearAdmin() {
    localStorage.removeItem('dos_admin_session');
  },

  // Track failed login attempts for a mobile number
  recordFailedAttempt(mobile) {
    const key = `dos_lockout_${mobile}`;
    const now = Date.now();
    let data = { attempts: 0, lockedUntil: 0 };

    try {
      const stored = localStorage.getItem(key);
      if (stored) data = JSON.parse(stored);
    } catch (e) {
      // ignore
    }

    data.attempts += 1;
    if (data.attempts >= this.MAX_FAILED_ATTEMPTS) {
      data.lockedUntil = now + this.LOCKOUT_DURATION_MS;
    }

    localStorage.setItem(key, JSON.stringify(data));
    return data;
  },

  // Reset failed attempts on success
  resetFailedAttempts(mobile) {
    localStorage.removeItem(`dos_lockout_${mobile}`);
  },

  // Check if mobile is locked out
  checkLockout(mobile) {
    const key = `dos_lockout_${mobile}`;
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return { isLocked: false, remainingSec: 0 };
      const data = JSON.parse(stored);
      const now = Date.now();

      if (data.lockedUntil && data.lockedUntil > now) {
        const remainingSec = Math.ceil((data.lockedUntil - now) / 1000);
        return { isLocked: true, remainingSec, attempts: data.attempts };
      }
      return { isLocked: false, remainingSec: 0, attempts: data.attempts || 0 };
    } catch (e) {
      return { isLocked: false, remainingSec: 0 };
    }
  },

  // Simple client-side one-way hash helper (SHA-256 for local verification)
  async hashPin(pin, salt = 'DOS_SALT_2026') {
    const encoder = new TextEncoder();
    const data = encoder.encode(pin + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
};

window.DOSAuthSession = DOSAuthSession;

