/**
 * DINESH ONLINE SOLUTION - UTILITIES
 */

const DOSUtils = {
  // Format Indian Rupee currency
  formatINR(amount) {
    const num = Number(amount) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  },

  // Format date readable
  formatDate(dateInput, includeTime = false) {
    if (!dateInput) return '—';
    let date;
    if (dateInput.toDate && typeof dateInput.toDate === 'function') {
      date = dateInput.toDate();
    } else if (dateInput instanceof Date) {
      date = dateInput;
    } else {
      date = new Date(dateInput);
    }

    if (isNaN(date.getTime())) return '—';

    const options = {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    };

    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
      options.hour12 = true;
    }

    return date.toLocaleDateString('en-IN', options);
  },

  // Generate unique Application ID format: DOS-YYYYMMDD-XXXX
  generateApplicationId() {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `DOS-${dateStr}-${rand}`;
  },

  // Generate Customer ID format: CID-XXXXXX
  generateCustomerId() {
    const rand = Math.floor(100000 + Math.random() * 900000);
    return `CID-${rand}`;
  },

  // Generate Transaction/Order ID
  generateOrderId() {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${ts}-${rand}`;
  },

  // HTML sanitization helper
  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  // Copy text to clipboard
  async copyToClipboard(text, successMsg = 'Copied to clipboard!') {
    try {
      await navigator.clipboard.writeText(text);
      if (window.showToast) {
        window.showToast(successMsg, 'success');
      }
    } catch (err) {
      console.error('Failed to copy', err);
    }
  },

  // Debounce helper
  debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Fallback demo database in localStorage if Firebase credentials aren't live
  demoStore: {
    get(key, defaultVal = []) {
      try {
        const item = localStorage.getItem(`dos_${key}`);
        return item ? JSON.parse(item) : defaultVal;
      } catch (e) {
        return defaultVal;
      }
    },
    set(key, val) {
      try {
        localStorage.setItem(`dos_${key}`, JSON.stringify(val));
      } catch (e) {
        console.error(e);
      }
    }
  }
};

window.DOSUtils = DOSUtils;

