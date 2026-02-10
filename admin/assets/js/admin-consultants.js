(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var modalEl = document.getElementById("consultantProfileModal");
    if (!modalEl || typeof bootstrap === "undefined") {
      return;
    }

    var profileModal = new bootstrap.Modal(modalEl);

    var idEl = document.getElementById("modalConsultantId");
    var usernameEl = document.getElementById("modalConsultantUsername");
    var emailEl = document.getElementById("modalConsultantEmail");
    var phoneEl = document.getElementById("modalConsultantPhone");
    var expEl = document.getElementById("modalConsultantExperience");
    var statusEl = document.getElementById("modalConsultantStatus");
    var passwordEl = document.getElementById("modalConsultantPassword");
    var bioEl = document.getElementById("modalConsultantBio");

    function showToast(message, type) {
      if (typeof Toastify === "undefined") {
        return;
      }
      var isSuccess = type === "success";
      Toastify({
        text: message,
        duration: 3000,
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

    function getUsernameFromRow(row) {
      if (!row) return "";
      var cells = row.querySelectorAll("td");
      if (!cells || cells.length < 2) return "";
      return cells[1].textContent.trim();
    }

    // View profile buttons: open modal with static consultant data from data-* attributes
    document
      .querySelectorAll('[data-action="view-profile"]')
      .forEach(function (btn) {
        btn.addEventListener("click", function () {
          var d = this.dataset;
          if (!d) return;

          if (idEl) idEl.textContent = d.id || "";
          if (usernameEl) usernameEl.textContent = d.username || "";
          if (emailEl) emailEl.textContent = d.email || "";
          if (phoneEl) phoneEl.textContent = d.phone || "";
          if (expEl) {
            var years = d.experienceYears || d.experience || "";
            expEl.textContent = years ? years + " years" : "";
          }
          if (statusEl) statusEl.textContent = d.status || "";
          if (passwordEl) passwordEl.textContent = d.password || "********";
          if (bioEl) bioEl.textContent = d.bio || "";

          profileModal.show();
        });
      });

    function updateStatus(row, label, classToAdd) {
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

    function configureActionsForStatus(row, status) {
      if (!row) return;
      var acceptBtn = row.querySelector('[data-action="approve"]');
      var rejectBtn = row.querySelector('[data-action="reject"]');
      var blockBtn = row.querySelector('[data-action="block"]');
      var unblockBtn = row.querySelector('[data-action="unblock"]');

      function show(btn, enabled) {
        if (!btn) return;
        btn.style.display = "inline-block";
        btn.disabled = !enabled;
      }
      function hide(btn) {
        if (!btn) return;
        btn.style.display = "none";
      }

      if (status === "Pending") {
        show(acceptBtn, true);
        show(rejectBtn, true);
        hide(blockBtn);
        hide(unblockBtn);
      } else if (status === "Accepted") {
        hide(acceptBtn);
        hide(rejectBtn);
        show(blockBtn, true);
        show(unblockBtn, true);
      } else if (status === "Blocked") {
        hide(acceptBtn);
        hide(rejectBtn);
        show(blockBtn, false);
        show(unblockBtn, true);
      } else if (status === "Rejected") {
        hide(acceptBtn);
        hide(rejectBtn);
        hide(blockBtn);
        hide(unblockBtn);
      }
    }

    function getStatusFromRow(row) {
      if (!row) return "";
      var badge = row.querySelector(".req-status");
      return badge ? badge.textContent.trim() : "";
    }

    // Apply initial button states based on current status text
    document.querySelectorAll(".requests-table tbody tr").forEach(function (row) {
      configureActionsForStatus(row, getStatusFromRow(row));
    });

    // Accept buttons – mark as Accepted (visual only)
    document
      .querySelectorAll('[data-action="approve"]')
      .forEach(function (btn) {
        btn.addEventListener("click", function () {
          var row = this.closest("tr");
          updateStatus(row, "Accepted", "req-status-assigned");
          configureActionsForStatus(row, "Accepted");
          var username = getUsernameFromRow(row);
          showToast("Consultant " + username + " marked as Accepted.", "success");
        });
      });

    // Block buttons – mark as Blocked (visual only)
    document.querySelectorAll('[data-action="block"]').forEach(function (btn) {
      btn.addEventListener("click", function () {
        var row = this.closest("tr");
        updateStatus(row, "Blocked", "req-status-completed");
        configureActionsForStatus(row, "Blocked");
        var username = getUsernameFromRow(row);
        showToast("Consultant " + username + " marked as Blocked.", "success");
      });
    });

    // Reject buttons – mark as Rejected (visual only)
    document
      .querySelectorAll('[data-action="reject"]')
      .forEach(function (btn) {
        btn.addEventListener("click", function () {
          var row = this.closest("tr");
          updateStatus(row, "Rejected", "req-status-completed");
          configureActionsForStatus(row, "Rejected");
          var username = getUsernameFromRow(row);
          showToast("Consultant " + username + " marked as Rejected.", "success");
        });
      });

    // Unblock buttons – mark as Accepted again (visual only)
    document
      .querySelectorAll('[data-action="unblock"]')
      .forEach(function (btn) {
        btn.addEventListener("click", function () {
          var row = this.closest("tr");
          updateStatus(row, "Accepted", "req-status-assigned");
          configureActionsForStatus(row, "Accepted");
          var username = getUsernameFromRow(row);
          showToast("Consultant " + username + " unblocked and set to Accepted.", "success");
        });
      });
  });
})();
