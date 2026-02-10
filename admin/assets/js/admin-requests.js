(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    function showToast(message, type) {
      if (typeof Toastify === "undefined") return;
      var isSuccess = type === "success";
      Toastify({
        text: message,
        duration: 3500,
        gravity: "top",
        position: "right",
        close: true,
        style: {
          background: isSuccess ? "var(--primary-color)" : "#c0392b",
          color: "#fff",
          borderRadius: "8px",
        },
      }).showToast();
    }

    function getRequestId(row) {
      if (!row) return "";
      return row.getAttribute("data-request-id") || "";
    }

    function updateRequestStatus(row, label, classToAdd) {
      if (!row) return;
      var badge = row.querySelector(".req-status");
      if (!badge) return;
      badge.textContent = label;
      badge.classList.remove(
        "req-status-pending",
        "req-status-assigned",
        "req-status-completed"
      );
      badge.classList.add(classToAdd);
    }

    // View details modal
    var detailsModalEl = document.getElementById("requestDetailsModal");
    var detailsModal = null;
    if (detailsModalEl && typeof bootstrap !== "undefined") {
      detailsModal = new bootstrap.Modal(detailsModalEl);
    }

    var modalIdEl = document.getElementById("modalRequestId");
    var modalUserEl = document.getElementById("modalRequestUser");
    var modalTypeEl = document.getElementById("modalRequestType");
    var modalStatusEl = document.getElementById("modalRequestStatus");
    var modalAssignedEl = document.getElementById("modalRequestAssigned");
    var modalCreatedEl = document.getElementById("modalRequestCreated");
    var modalSummaryEl = document.getElementById("modalRequestSummary");
    var modalFilesEl = document.getElementById("modalRequestFiles");

    document.querySelectorAll('[data-action="view-details"]').forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (!detailsModal) return;
        var d = this.dataset;
        if (!d) return;

        if (modalIdEl) modalIdEl.textContent = d.requestId || "";
        if (modalUserEl) modalUserEl.textContent = d.user || "";
        if (modalTypeEl) modalTypeEl.textContent = d.type || "";
        if (modalStatusEl) modalStatusEl.textContent = d.status || "";
        if (modalAssignedEl) modalAssignedEl.textContent = d.assigned || "—";
        if (modalCreatedEl) modalCreatedEl.textContent = d.created || "";
        if (modalSummaryEl) modalSummaryEl.textContent = d.summary || "";

        if (modalFilesEl) {
          modalFilesEl.innerHTML = "";
          var files = (d.files || "").split(",").map(function (f) { return f.trim(); }).filter(Boolean);
          if (!files.length) {
            var li = document.createElement("li");
            li.textContent = "No files uploaded.";
            modalFilesEl.appendChild(li);
          } else {
            files.forEach(function (file) {
              var li = document.createElement("li");
              li.textContent = file;
              modalFilesEl.appendChild(li);
            });
          }
        }

        detailsModal.show();
      });
    });

    // Assign unassigned general requests via modal
    var assignModalEl = document.getElementById("assignRequestModal");
    var assignModal = null;
    var assignMetaEl = document.getElementById("assignRequestMeta");
    var assignSelectEl = document.getElementById("assignConsultantSelect");
    var assignSaveBtn = document.getElementById("assignSaveBtn");
    var currentAssignRow = null;

    if (assignModalEl && typeof bootstrap !== "undefined") {
      assignModal = new bootstrap.Modal(assignModalEl);
    }

    document
      .querySelectorAll('[data-action="open-assign"]')
      .forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (!assignModal || !assignSelectEl) return;
          currentAssignRow = this.closest("tr");
          var d = this.dataset || {};
          var id = d.requestId || getRequestId(currentAssignRow);
          var user = d.user || "";

          if (assignMetaEl) {
            assignMetaEl.textContent = "Request " + id + " • " + user;
          }
          assignSelectEl.value = "";
          assignModal.show();
        });
      });

    if (assignSaveBtn && assignSelectEl) {
      assignSaveBtn.addEventListener("click", function () {
        if (!currentAssignRow) return;
        var selectedIndex = assignSelectEl.selectedIndex;
        if (selectedIndex <= 0) {
          showToast("Please select a consultant before saving.", "error");
          return;
        }
        var consultantLabel = assignSelectEl.options[selectedIndex].text;
        var assignedCell = currentAssignRow.querySelector(".assigned-cell");
        if (assignedCell) {
          assignedCell.textContent = consultantLabel;
        }

        updateRequestStatus(currentAssignRow, "Assigned", "req-status-assigned");

        var id = getRequestId(currentAssignRow);
        showToast("Request " + id + " assigned to " + consultantLabel + ".", "success");

        // Disable the assign button for this row
        var assignBtn = currentAssignRow.querySelector('[data-action="open-assign"]');
        if (assignBtn) {
          assignBtn.disabled = true;
          assignBtn.textContent = "Assigned";
        }

        if (assignModal) {
          assignModal.hide();
        }
        currentAssignRow = null;
      });
    }

    // Mark assigned request as completed
    document
      .querySelectorAll('[data-action="mark-completed"]')
      .forEach(function (btn) {
        btn.addEventListener("click", function () {
          var row = this.closest("tr");
          updateRequestStatus(row, "Completed", "req-status-completed");
          this.disabled = true;

          var id = getRequestId(row);
          showToast("Request " + id + " marked as completed.", "success");
        });
      });

    // Re-open a completed request (back to Assigned)
    document
      .querySelectorAll('[data-action="reopen"]')
      .forEach(function (btn) {
        btn.addEventListener("click", function () {
          var row = this.closest("tr");
          updateRequestStatus(row, "Assigned", "req-status-assigned");
          this.disabled = true;

          var id = getRequestId(row);
          showToast("Request " + id + " re-opened and set to Assigned.", "success");
        });
      });
  });
})();

