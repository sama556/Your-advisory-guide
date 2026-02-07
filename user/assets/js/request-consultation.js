(function () {
  "use strict";

  var params = new URLSearchParams(window.location.search);
  var consultantId = params.get("consultant_id");
  var consultantName = params.get("consultant_name");

  var selectRequestType = document.getElementById("selectRequestType");
  var selectConsultant = document.getElementById("selectConsultant");
  var rowConsultant = document.getElementById("rowConsultant");
  var requestTypeInput = document.getElementById("requestType");
  var consultantIdInput = document.getElementById("consultantId");
  var badgeGeneral = document.getElementById("requestTypeBadge");
  var badgeTargeted = document.getElementById("requestTypeBadgeTargeted");
  var form = document.getElementById("requestForm");

  if (!form) return;

  if (consultantId && consultantName) {
    selectRequestType.value = "targeted";
    requestTypeInput.value = "targeted";
    consultantIdInput.value = consultantId;
    selectConsultant.value = consultantId;
    rowConsultant.classList.remove("d-none");
    badgeGeneral.classList.add("d-none");
    badgeTargeted.classList.remove("d-none");
    badgeTargeted.textContent = "Targeted — " + decodeURIComponent(consultantName);
  }

  selectRequestType.addEventListener("change", function () {
    var isTargeted = this.value === "targeted";
    requestTypeInput.value = this.value;
    rowConsultant.classList.toggle("d-none", !isTargeted);
    badgeGeneral.classList.toggle("d-none", isTargeted);
    badgeTargeted.classList.toggle("d-none", !isTargeted);
    if (isTargeted) {
      badgeTargeted.textContent = "Targeted request";
      if (selectConsultant.value) {
        badgeTargeted.textContent += " — " + selectConsultant.options[selectConsultant.selectedIndex].text;
      }
    }
    if (!isTargeted) consultantIdInput.value = "";
  });

  selectConsultant.addEventListener("change", function () {
    consultantIdInput.value = this.value || "";
    if (selectRequestType.value === "targeted" && this.value) {
      badgeTargeted.textContent = "Targeted — " + this.options[this.selectedIndex].text;
    }
  });

  function showSuccess(message) {
    if (typeof Toastify !== "undefined") {
      Toastify({
        text: message,
        duration: 4000,
        close: true,
        gravity: "top",
        position: "right",
        style: {
          background: "var(--primary-color)",
          color: "#fff",
          borderRadius: "8px"
        }
      }).showToast();
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }
    if (selectRequestType.value === "targeted" && !selectConsultant.value) {
      selectConsultant.classList.add("is-invalid");
      return;
    }
    selectConsultant.classList.remove("is-invalid");

    showSuccess("Request submitted successfully. We will assign a consultant and contact you.");
    setTimeout(function () {
      window.location.href = "user-dashboard.html";
    }, 1500);
  });

  if (typeof AOS !== "undefined") {
    AOS.init({ duration: 500, once: true });
  }
})();
