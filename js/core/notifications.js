/**
 * DINESH ONLINE SOLUTION - NOTIFICATIONS & MODALS
 */

class NotificationManager {
  constructor() {
    this.container = null;
    this.initContainer();
  }

  initContainer() {
    if (document.querySelector('.toast-container')) {
      this.container = document.querySelector('.toast-container');
    } else {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  }

  showToast(message, type = 'info', title = '', duration = 4000) {
    if (!this.container) this.initContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const iconMap = {
      success: '<i data-lucide="check-circle" style="color:var(--success);"></i>',
      error: '<i data-lucide="alert-circle" style="color:var(--error);"></i>',
      warning: '<i data-lucide="alert-triangle" style="color:var(--warning);"></i>',
      info: '<i data-lucide="info" style="color:var(--info);"></i>'
    };

    const iconHtml = iconMap[type] || iconMap.info;
    const defaultTitle = {
      success: 'Success',
      error: 'Error',
      warning: 'Attention',
      info: 'Notification'
    }[type] || 'Notice';

    toast.innerHTML = `
      <div class="toast-icon">${iconHtml}</div>
      <div class="toast-content">
        <div class="toast-title">${title || defaultTitle}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Close">&times;</button>
    `;

    toast.querySelector('.toast-close').addEventListener('click', () => {
      this.dismissToast(toast);
    });

    this.container.appendChild(toast);

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons({ root: toast });
    }

    if (duration > 0) {
      setTimeout(() => {
        this.dismissToast(toast);
      }, duration);
    }

    return toast;
  }

  dismissToast(toast) {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 250);
  }

  // Confirmation Modal
  confirm(options = {}) {
    return new Promise((resolve) => {
      const {
        title = 'Are you sure?',
        message = 'Please confirm this action.',
        confirmText = 'Yes, Proceed',
        cancelText = 'Cancel',
        isDanger = false
      } = options;

      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay active';

      overlay.innerHTML = `
        <div class="modal-container" style="max-width: 440px;">
          <div class="modal-header">
            <h4 class="modal-title">${title}</h4>
            <button class="modal-close modal-close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <p class="text-body">${message}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline modal-cancel-btn">${cancelText}</button>
            <button class="btn ${isDanger ? 'btn-danger' : 'btn-primary'} modal-confirm-btn">${confirmText}</button>
          </div>
        </div>
      `;

      const cleanUp = (result) => {
        overlay.classList.remove('active');
        setTimeout(() => {
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }, 200);
        resolve(result);
      };

      overlay.querySelector('.modal-close-btn').addEventListener('click', () => cleanUp(false));
      overlay.querySelector('.modal-cancel-btn').addEventListener('click', () => cleanUp(false));
      overlay.querySelector('.modal-confirm-btn').addEventListener('click', () => cleanUp(true));

      document.body.appendChild(overlay);
    });
  }
}

window.notificationManager = new NotificationManager();
window.showToast = (msg, type, title, duration) => window.notificationManager.showToast(msg, type, title, duration);

