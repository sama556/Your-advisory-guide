(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var tableBody = document.getElementById('consultRequestsTableBody');
    var searchInput = document.getElementById('consultReqSearch');
    var typeFilter = document.getElementById('consultReqTypeFilter');
    var statusFilter = document.getElementById('consultReqStatusFilter');
    var countEl = document.getElementById('consultRequestsCount');
    var modal = document.getElementById('requestDetailModal');

    function showToast(message, type) {
      type = type || 'success';
      var bg = type === 'success' ? 'var(--primary-color)' : type === 'error' ? '#dc3545' : '#6c757d';
      if (typeof Toastify !== 'undefined') {
        Toastify({
          text: message,
          duration: 3000,
          gravity: 'top',
          position: 'right',
          style: { background: bg, color: '#fff', borderRadius: '8px' }
        }).showToast();
      } else {
        alert(message);
      }
    }

    function getRowData(row) {
      if (!row || !row.dataset) return null;
      var d = row.dataset;
      return {
        requestId: d.requestId || '',
        userName: d.userName || '',
        userEmail: d.userEmail || '',
        userMobile: (d.userMobile || '').replace(/\s/g, ''),
        serviceType: (d.serviceType || '').toLowerCase(),
        status: (d.status || '').toLowerCase(),
        communication: d.communication || '',
        creationDate: d.creationDate || '',
        assignmentDate: d.assignmentDate || '',
        problem: d.problem || '',
        files: d.files || ''
      };
    }

    function filterRows() {
      if (!tableBody) return;
      var search = (searchInput && searchInput.value) ? searchInput.value.trim().toLowerCase() : '';
      var typeVal = (typeFilter && typeFilter.value) ? typeFilter.value.toLowerCase() : '';
      var statusVal = (statusFilter && statusFilter.value) ? statusFilter.value.toLowerCase() : '';
      var rows = tableBody.querySelectorAll('.request-row');
      var visible = 0;
      rows.forEach(function (row) {
        var data = getRowData(row);
        if (!data) { row.style.display = ''; visible++; return; }
        var matchSearch = !search ||
          (data.requestId && data.requestId.indexOf(search) !== -1) ||
          (data.userName && data.userName.toLowerCase().indexOf(search) !== -1) ||
          (data.problem && data.problem.toLowerCase().indexOf(search) !== -1);
        var matchType = !typeVal || data.serviceType === typeVal;
        var matchStatus = !statusVal || data.status === statusVal;
        var show = matchSearch && matchType && matchStatus;
        row.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      if (countEl) countEl.textContent = 'Showing ' + visible + ' request(s)';
    }

    if (searchInput) searchInput.addEventListener('input', filterRows);
    if (typeFilter) typeFilter.addEventListener('change', filterRows);
    if (statusFilter) statusFilter.addEventListener('change', filterRows);

    function openRequestModal(row) {
      var data = getRowData(row);
      if (!data || !modal) return;
      var idEl = document.getElementById('modalRequestId');
      var serviceEl = document.getElementById('modalServiceType');
      var statusEl = document.getElementById('modalStatus');
      var commEl = document.getElementById('modalCommunication');
      var creationEl = document.getElementById('modalCreationDate');
      var assignmentEl = document.getElementById('modalAssignmentDate');
      var problemEl = document.getElementById('modalProblem');
      var filesEl = document.getElementById('modalFiles');
      var nameEl = document.getElementById('modalUserName');
      var chosenLabel = document.getElementById('modalChosenMethodLabel');
      var contactContainer = document.getElementById('modalContactMethodOnly');

      if (idEl) idEl.textContent = data.requestId;
      if (serviceEl) serviceEl.textContent = (data.serviceType || '').replace(/-/g, ' ');
      if (statusEl) statusEl.textContent = (data.status || '').replace(/-/g, ' ');
      if (commEl) commEl.textContent = data.communication || '—';
      if (creationEl) creationEl.textContent = data.creationDate || '—';
      if (assignmentEl) assignmentEl.textContent = data.assignmentDate || '—';
      if (problemEl) problemEl.textContent = data.problem || '—';
      if (filesEl) filesEl.textContent = data.files ? data.files : 'None';
      if (nameEl) nameEl.textContent = data.userName || '—';

      var method = (data.communication || '').toLowerCase().replace(/\s/g, '');
      if (chosenLabel) chosenLabel.textContent = data.communication || '—';

      if (contactContainer) {
        contactContainer.innerHTML = '';
        if (method === 'email') {
          var emailVal = data.userEmail || '—';
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'btn btn-outline-secondary btn-sm';
          btn.title = 'Copy email';
          btn.innerHTML = '<i class="bi bi-envelope me-1"></i> ' + emailVal + ' <i class="bi bi-clipboard ms-1"></i>';
          btn.onclick = function () {
            if (data.userEmail) {
              copyToClipboard(data.userEmail);
              showToast('Email copied to clipboard.');
            }
          };
          contactContainer.appendChild(btn);
        } else if (method === 'phone') {
          var mobileVal = data.userMobile || '—';
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'btn btn-outline-secondary btn-sm';
          btn.title = 'Copy mobile';
          btn.innerHTML = '<i class="bi bi-telephone me-1"></i> ' + mobileVal + ' <i class="bi bi-clipboard ms-1"></i>';
          btn.onclick = function () {
            if (data.userMobile) {
              copyToClipboard(data.userMobile);
              showToast('Mobile number copied to clipboard.');
            }
          };
          contactContainer.appendChild(btn);
        } else if (method === 'whatsapp') {
          var num = (data.userMobile || '').replace(/^\+/, '').replace(/\s/g, '');
          var a = document.createElement('a');
          a.href = num ? 'https://wa.me/' + num : '#';
          a.target = '_blank';
          a.rel = 'noopener';
          a.className = 'btn btn-outline-success btn-sm';
          a.title = 'Open WhatsApp';
          a.innerHTML = '<i class="bi bi-whatsapp me-1"></i> ' + (data.userMobile || '—');
          contactContainer.appendChild(a);
        } else {
          contactContainer.textContent = 'No contact method selected.';
        }
      }

      var bsModal = typeof bootstrap !== 'undefined' && bootstrap.Modal ? new bootstrap.Modal(modal) : null;
      if (bsModal) bsModal.show();
    }

    function copyToClipboard(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
      }
    }

    if (tableBody) {
      tableBody.addEventListener('click', function (e) {
        var btn = e.target.closest('.btn-view-request');
        if (!btn) return;
        var row = btn.closest('.request-row');
        if (row) openRequestModal(row);
      });
    }

    filterRows();
  });
})();
