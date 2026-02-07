
document.addEventListener('DOMContentLoaded', function () {
  AOS.init({ duration: 600, once: true });

  var form = document.getElementById('signupForm');
  var password = document.getElementById('password');
  var confirmPassword = document.getElementById('confirmPassword');

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

  confirmPassword.addEventListener('input', function () {
    if (confirmPassword.value && password.value !== confirmPassword.value) {
      confirmPassword.setCustomValidity('Passwords do not match');
    } else {
      confirmPassword.setCustomValidity('');
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (password.value !== confirmPassword.value) {
      confirmPassword.setCustomValidity('Passwords do not match');
      confirmPassword.classList.add('is-invalid');
      return;
    }
    confirmPassword.setCustomValidity('');
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }
    form.classList.add('was-validated');
    showToast('Account created successfully! Redirecting to login...', 'success');
    setTimeout(function () {
      window.location.href = 'login.html';
    }, 1500);
  });
});
