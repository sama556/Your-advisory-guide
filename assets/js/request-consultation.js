(function () {
  "use strict";

  var form = document.getElementById("requestForm");
  if (!form) return;

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

    showSuccess("Request submitted successfully. We will assign a consultant and contact you.");
    setTimeout(function () {
      window.location.href = "user-dashboard.html";
    }, 1500);
  });

  if (typeof AOS !== "undefined") {
    AOS.init({ duration: 500, once: true });
  }
})();
