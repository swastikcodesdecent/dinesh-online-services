/**
 * DINESH ONLINE SOLUTION - ADMIN SUPPORT TICKETS
 */

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('adminSupportTableBody');
  if (!tableBody) return;

  let tickets = DOSUtils.demoStore.get('support_tickets', [
    {
      id: 'TCK-101',
      name: 'Ramesh Singh',
      mobile: '9812345678',
      subject: 'Query on Electricity Bill Receipt',
      message: 'Need official UPPCL transaction reference number for subsidy claim.',
      status: 'Open',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'TCK-102',
      name: 'Pooja Verma',
      mobile: '9798765432',
      subject: 'Aadhaar PVC delivery time',
      message: 'How many days will UIDAI speed post take to deliver the PVC card?',
      status: 'Resolved',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
    }
  ]);
  DOSUtils.demoStore.set('support_tickets', tickets);

  function renderTickets() {
    if (tickets.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted" style="padding:2rem;">No support tickets found.</td></tr>`;
      return;
    }

    tableBody.innerHTML = tickets.map((t, idx) => {
      const isResolved = t.status === 'Resolved';
      const name = t.name || t.customerName || 'Citizen Customer';
      const mobile = t.mobile || t.customerMobile || '9131171406';

      return `
        <tr>
          <td><span class="badge-code">${DOSUtils.escapeHtml(t.id)}</span></td>
          <td><strong>${DOSUtils.escapeHtml(name)}</strong><br><small class="text-muted">+91 ${DOSUtils.escapeHtml(mobile)}</small></td>
          <td>
            <strong>${DOSUtils.escapeHtml(t.subject || 'Support Query')}</strong>
            <p style="font-size:0.8rem; color:var(--text-secondary); margin-top:2px;">${DOSUtils.escapeHtml(t.message || '')}</p>
          </td>
          <td>${DOSUtils.formatDate(t.createdAt, true)}</td>
          <td><span class="badge ${isResolved ? 'badge-completed' : 'badge-pending'}">${t.status}</span></td>
          <td>
            <button class="btn btn-outline btn-sm" onclick="window.toggleTicketStatus(${idx})">
              ${isResolved ? 'Re-open' : 'Mark Resolved'}
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  window.toggleTicketStatus = function (idx) {
    tickets[idx].status = tickets[idx].status === 'Resolved' ? 'Open' : 'Resolved';
    DOSUtils.demoStore.set('support_tickets', tickets);
    window.showToast(`Ticket status changed to ${tickets[idx].status}.`, 'info');
    renderTickets();
  };

  renderTickets();
});

