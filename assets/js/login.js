
    document.addEventListener('DOMContentLoaded', function () {
      AOS.init({ duration: 600, once: true });

      var form = document.getElementById('loginForm');

      function showToast(message, type) {
        Toastify({
          text: message,
          duration: 3000,
          close: true,
          gravity: 'top',
          position: 'right',
          style: {
            background: type === 'success' ? 'var(--primary-color)' : '#c0392b',
            color: '#fff',
            borderRadius: '8px',
          },
        }).showToast();
      }

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!form.checkValidity()) {
          form.classList.add('was-validated');
          return;
        }
        form.classList.add('was-validated');
        showToast('Logged in successfully! Redirecting...', 'success');
        setTimeout(function () {
          window.location.href = 'user/user-dashboard.html';
        }, 1200);
      });
    });
  