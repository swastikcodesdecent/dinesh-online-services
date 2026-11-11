/**
 * DINESH ONLINE SOLUTION - DOCUMENT UPLOAD & VAULT
 */

document.addEventListener('DOMContentLoaded', () => {
  const vaultDropzone = document.getElementById('vaultDropzone');
  const vaultFileInput = document.getElementById('vaultFileInput');
  const vaultFilesContainer = document.getElementById('vaultFilesContainer');
  const customer = DOSAuthSession.getCustomer();

  if (!vaultDropzone && !vaultFilesContainer) return;

  function loadCustomerDocuments() {
    const docs = DOSUtils.demoStore.get(`docs_${customer.mobile}`, [
      { id: 'doc-1', name: 'Aadhaar_Card_Front_Back.pdf', size: 1450200, type: 'application/pdf', uploadedAt: new Date(Date.now() - 86400000 * 3).toISOString() },
      { id: 'doc-2', name: 'Passport_Size_Photo.jpg', size: 420100, type: 'image/jpeg', uploadedAt: new Date(Date.now() - 86400000 * 3).toISOString() }
    ]);
    renderDocuments(docs);
  }

  function renderDocuments(docs) {
    if (!vaultFilesContainer) return;

    if (docs.length === 0) {
      vaultFilesContainer.innerHTML = `
        <div class="empty-state" style="padding:1.5rem;">
          <p class="text-muted">No documents uploaded to your vault yet.</p>
        </div>
      `;
      return;
    }

    vaultFilesContainer.innerHTML = docs.map((doc, idx) => {
      const sizeKb = Math.round(doc.size / 1024);
      return `
        <div class="file-item-chip" style="margin-bottom:0.5rem; padding:0.75rem 1rem;">
          <div class="file-meta">
            <i data-lucide="${doc.type.includes('pdf') ? 'file-text' : 'image'}" style="color:var(--royal-blue); font-size:1.25rem;"></i>
            <div>
              <div style="font-weight:600; font-size:0.9rem;">${DOSUtils.escapeHtml(doc.name)}</div>
              <div class="text-meta">${sizeKb} KB | Uploaded on ${DOSUtils.formatDate(doc.uploadedAt)}</div>
            </div>
          </div>
          <button class="btn btn-outline btn-sm" onclick="window.deleteVaultDoc(${idx})" style="color:var(--error); border-color:#fca5a5;">
            Delete
          </button>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons({ root: vaultFilesContainer });
  }

  if (vaultDropzone && vaultFileInput) {
    vaultDropzone.addEventListener('click', () => vaultFileInput.click());
    vaultDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      vaultDropzone.classList.add('dragover');
    });
    vaultDropzone.addEventListener('dragleave', () => vaultDropzone.classList.remove('dragover'));
    vaultDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      vaultDropzone.classList.remove('dragover');
      if (e.dataTransfer.files) handleUpload(Array.from(e.dataTransfer.files));
    });

    vaultFileInput.addEventListener('change', () => {
      if (vaultFileInput.files) handleUpload(Array.from(vaultFileInput.files));
    });
  }

  async function handleUpload(files) {
    const current = DOSUtils.demoStore.get(`docs_${customer.mobile}`, []);

    for (const file of files) {
      const val = DOSValidation.validateDocumentFile(file);
      if (!val.valid) {
        window.showToast(`${file.name}: ${val.message}`, 'error');
        continue;
      }

      current.push({
        id: 'doc-' + Date.now(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      });
    }

    DOSUtils.demoStore.set(`docs_${customer.mobile}`, current);
    window.showToast('Document(s) successfully added to vault.', 'success');
    renderDocuments(current);
  }

  window.deleteVaultDoc = async function (idx) {
    const confirmed = await window.notificationManager.confirm({
      title: 'Remove Document',
      message: 'Are you sure you want to remove this document from your profile vault?',
      isDanger: true,
      confirmText: 'Remove'
    });

    if (confirmed) {
      const current = DOSUtils.demoStore.get(`docs_${customer.mobile}`, []);
      current.splice(idx, 1);
      DOSUtils.demoStore.set(`docs_${customer.mobile}`, current);
      window.showToast('Document removed.', 'info');
      renderDocuments(current);
    }
  };

  loadCustomerDocuments();
});

