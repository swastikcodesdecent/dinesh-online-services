/**
 * DINESH ONLINE SOLUTION - OFFICIAL PAYMENT RECEIPT GENERATOR
 */

const DOSReceipts = {
  // Open receipt preview modal or print window
  generateReceipt(paymentOrApp) {
    const business = (window.DOS_CONFIG && window.DOS_CONFIG.business) || {
      name: 'Dinesh Online Solution',
      tagline: 'Your True Digital Companion',
      phone: '+91 91311 71406',
      email: 'email.d2841735@gmail.com',
      address: 'Jabalpur , Madhya Pradesh',
      timing: '9am to 7:30 pm'
    };

    const dateStr = DOSUtils.formatDate(paymentOrApp.paidAt || paymentOrApp.createdAt || new Date(), true);
    const appId = paymentOrApp.applicationId || paymentOrApp.id || 'DOS-APP';
    const txnId = paymentOrApp.paymentId || paymentOrApp.transactionId || 'TXN-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const serviceName = paymentOrApp.serviceName || 'Digital Facilitation Service';
    const customerName = paymentOrApp.customerName || paymentOrApp.name || 'Citizen Customer';
    const customerMobile = paymentOrApp.customerMobile || paymentOrApp.mobile || '—';
    const amount = Number(paymentOrApp.amount || paymentOrApp.totalPrice || 0);
    const serviceFee = Number(paymentOrApp.serviceFee || amount);
    const govtFee = Number(paymentOrApp.govtFee || 0);

    const receiptHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Receipt - ${appId}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@700;800&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Inter', sans-serif; background: #fff; color: #172033; padding: 2.5rem; line-height: 1.5; font-size: 14px; }
          .receipt-box { max-width: 680px; margin: 0 auto; border: 2px solid #123B72; border-radius: 12px; padding: 2rem; position: relative; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #F1F5F9; padding-bottom: 1.25rem; margin-bottom: 1.5rem; }
          .brand-title { font-family: 'Manrope', sans-serif; font-size: 22px; font-weight: 800; color: #123B72; }
          .brand-sub { font-size: 11px; font-weight: 600; color: #F59E0B; letter-spacing: 1px; text-transform: uppercase; }
          .brand-address { font-size: 11px; color: #64748B; margin-top: 4px; max-width: 320px; }
          .receipt-badge { background: #DCFCE7; color: #15803D; padding: 4px 10px; border-radius: 20px; font-weight: 700; font-size: 12px; display: inline-block; margin-bottom: 6px; }
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; background: #F8FAFC; padding: 1rem; border-radius: 8px; }
          .meta-item { display: flex; flex-direction: column; }
          .meta-label { font-size: 11px; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; }
          .meta-value { font-weight: 600; font-size: 13px; color: #172033; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; }
          th { background: #123B72; color: #fff; text-align: left; padding: 10px 12px; font-size: 12px; text-transform: uppercase; }
          td { padding: 10px 12px; border-bottom: 1px solid #E2E8F0; font-size: 13px; }
          .total-row td { font-weight: 700; font-size: 15px; color: #123B72; border-top: 2px solid #123B72; }
          .footer-note { font-size: 11px; color: #64748B; line-height: 1.6; border-top: 1px dashed #CBD5E1; padding-top: 1rem; margin-top: 1rem; }
          .stamp { position: absolute; right: 2rem; bottom: 4.5rem; border: 2px solid #16A34A; color: #16A34A; padding: 6px 12px; border-radius: 6px; font-weight: 800; text-transform: uppercase; transform: rotate(-10deg); opacity: 0.75; font-size: 13px; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
            .receipt-box { border: 1px solid #000; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="max-width: 680px; margin: 0 auto 1.5rem; display: flex; justify-content: flex-end; gap: 0.75rem;">
          <button onclick="window.print()" style="background:#2563EB; color:#fff; border:none; padding:8px 16px; border-radius:6px; cursor:pointer; font-weight:600;">Print Receipt</button>
          <button onclick="window.close()" style="background:#F1F5F9; color:#172033; border:1px solid #CBD5E1; padding:8px 16px; border-radius:6px; cursor:pointer;">Close</button>
        </div>

        <div class="receipt-box">
          <div class="stamp">PAYMENT VERIFIED</div>

          <div class="header">
            <div>
              <div class="brand-title">${business.name}</div>
              <div class="brand-sub">${business.tagline}</div>
              <div class="brand-address">${business.address}</div>
              <div class="brand-address">Phone: ${business.phone} | Email: ${business.email}</div>
            </div>
            <div style="text-align: right;">
              <span class="receipt-badge">PAID IN FULL</span>
              <div style="font-weight: 700; font-size: 14px; color: #123B72;">TAX / E-RECEIPT</div>
              <div style="font-size: 12px; color: #64748B;">Date: ${dateStr}</div>
            </div>
          </div>

          <div class="meta-grid">
            <div class="meta-item">
              <span class="meta-label">Customer Name</span>
              <span class="meta-value">${DOSUtils.escapeHtml(customerName)}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Application ID</span>
              <span class="meta-value" style="font-family:monospace; color:#2563EB;">${appId}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Mobile Number</span>
              <span class="meta-value">+91 ${customerMobile}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Transaction / Payment ID</span>
              <span class="meta-value" style="font-family:monospace;">${txnId}</span>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Service Particulars</th>
                <th>Category</th>
                <th style="text-align: right;">Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>${DOSUtils.escapeHtml(serviceName)}</strong><br><small style="color:#64748B;">Facilitation, Document Verification & Operator Assistance</small></td>
                <td>Facilitation Fee</td>
                <td style="text-align: right;">${DOSUtils.formatINR(serviceFee)}</td>
              </tr>
              ${govtFee > 0 ? `
              <tr>
                <td><strong>Official Government / Department Fee</strong><br><small style="color:#64748B;">Direct statutory pass-through fees</small></td>
                <td>Govt Fee</td>
                <td style="text-align: right;">${DOSUtils.formatINR(govtFee)}</td>
              </tr>
              ` : ''}
              <tr class="total-row">
                <td colspan="2">TOTAL AMOUNT RECEIVED</td>
                <td style="text-align: right;">${DOSUtils.formatINR(amount)}</td>
              </tr>
            </tbody>
          </table>

          <div class="footer-note">
            <strong>Important Notice:</strong> This is an electronically generated receipt for online facilitation services provided by Dinesh Online Solution. Official government registration acknowledgements or portal certificates are delivered separately upon departmental approval.
          </div>
        </div>
      </body>
      </html>
    `;

    const printWin = window.open('', '_blank', 'width=800,height=750');
    if (printWin) {
      printWin.document.open();
      printWin.document.write(receiptHtml);
      printWin.document.close();
    } else {
      window.showToast('Please allow popups to download or print your receipt.', 'warning');
    }
  }
};

window.DOSReceipts = DOSReceipts;

