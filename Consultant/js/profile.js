
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    // --- Change password modal ---
    var form = document.getElementById('changePasswordForm');
    var submitBtn = document.getElementById('changePasswordSubmit');
    var newPwd = document.getElementById('newPassword');
    var confirmPwd = document.getElementById('confirmPassword');
    var modal = document.getElementById('changePasswordModal');

    if (form && submitBtn) {
      function validateMatch() {
        if (confirmPwd.value && newPwd.value !== confirmPwd.value) {
          confirmPwd.classList.add('is-invalid');
          return false;
        }
        confirmPwd.classList.remove('is-invalid');
        return true;
      }
      confirmPwd.addEventListener('input', validateMatch);
      newPwd.addEventListener('input', validateMatch);
      submitBtn.addEventListener('click', function () {
        if (!form.checkValidity()) {
          form.classList.add('was-validated');
          return;
        }
        if (!validateMatch()) return;
        if (typeof bootstrap !== 'undefined' && modal) {
          var bsModal = bootstrap.Modal.getInstance(modal);
          if (bsModal) bsModal.hide();
        }
        form.reset();
        form.classList.remove('was-validated');
        showToast('Password updated successfully.');
      });
    }

    // --- Profile save / cancel ---
    var profileFields = {
      email: document.getElementById('profileEmail'),
      phone: document.getElementById('profilePhone'),
      experience: document.getElementById('profileExperience'),
      bio: document.getElementById('profileBio'),
      contactNumber: document.getElementById('profileContactNumber'),
      location: document.getElementById('profileLocation'),
      commMethod: document.getElementById('profileCommMethod')
    };
    var initialProfile = {};

    function storeInitialProfile() {
      initialProfile.email = profileFields.email ? profileFields.email.value : '';
      initialProfile.phone = profileFields.phone ? profileFields.phone.value : '';
      initialProfile.experience = profileFields.experience ? profileFields.experience.value : '';
      initialProfile.bio = profileFields.bio ? profileFields.bio.value : '';
      initialProfile.contactNumber = profileFields.contactNumber ? profileFields.contactNumber.value : '';
      initialProfile.location = profileFields.location ? profileFields.location.value : '';
      initialProfile.commMethod = profileFields.commMethod ? profileFields.commMethod.value : '';
    }

    function restoreProfile() {
      if (profileFields.email) profileFields.email.value = initialProfile.email;
      if (profileFields.phone) profileFields.phone.value = initialProfile.phone;
      if (profileFields.experience) profileFields.experience.value = initialProfile.experience;
      if (profileFields.bio) profileFields.bio.value = initialProfile.bio;
      if (profileFields.contactNumber) profileFields.contactNumber.value = initialProfile.contactNumber;
      if (profileFields.location) profileFields.location.value = initialProfile.location;
      if (profileFields.commMethod) profileFields.commMethod.value = initialProfile.commMethod;
    }

    storeInitialProfile();

    var saveBtn = document.getElementById('saveChangesBtn');
    var cancelBtn = document.getElementById('cancelChangesBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', function () {
        storeInitialProfile();
        showToast('Profile saved successfully.');
      });
    }
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function () {
        restoreProfile();
        restoreSpecializations();
        showToast('Changes discarded.');
      });
    }

    // --- Specializations: initial state for cancel ---
    var specializationsContainer = document.getElementById('specializationsContainer');
    var initialSpecializationsHtml = specializationsContainer ? specializationsContainer.innerHTML : '';

    function restoreSpecializations() {
      if (specializationsContainer) {
        specializationsContainer.innerHTML = initialSpecializationsHtml;
        bindRemoveSpecialization();
      }
    }

    var addSpecBtn = document.getElementById('addSpecializationBtn');
    if (addSpecBtn && specializationsContainer) {
      addSpecBtn.addEventListener('click', function () {
        var items = specializationsContainer.querySelectorAll('.specialization-item');
        var nextNum = items.length + 1;
        var div = document.createElement('div');
        div.className = 'col-md-6 specialization-item';
        div.innerHTML =
          '<label class="form-label">Specialization ' + nextNum + '</label>' +
          '<div class="d-flex align-items-start gap-2">' +
          '<div class="flex-grow-1">' +
          '<input type="text" class="form-control mb-2 specialization-title" placeholder="Title">' +
          '<textarea class="form-control form-control-sm specialization-desc" rows="2" placeholder="Description"></textarea>' +
          '</div>' +
          '<button type="button" class="btn btn-outline-danger btn-sm remove-specialization" title="Remove"><i class="bi bi-trash"></i></button>' +
          '</div>';
        specializationsContainer.appendChild(div);
        bindRemoveSpecialization();
      });
    }

    function bindRemoveSpecialization() {
      specializationsContainer.querySelectorAll('.remove-specialization').forEach(function (btn) {
        btn.onclick = function () {
          var item = btn.closest('.specialization-item');
          if (item && specializationsContainer.querySelectorAll('.specialization-item').length > 1) {
            item.remove();
            renumberSpecializations();
          }
        };
      });
    }

    function renumberSpecializations() {
      specializationsContainer.querySelectorAll('.specialization-item').forEach(function (el, i) {
        var label = el.querySelector('.form-label');
        if (label) label.textContent = 'Specialization ' + (i + 1);
      });
    }

    bindRemoveSpecialization();

    function showToast(message) {
      if (typeof Toastify !== 'undefined') {
        Toastify({ text: message, duration: 3000, gravity: 'top', position: 'right', style: { background: 'var(--primary-color)', color: '#fff', borderRadius: '8px' } }).showToast();
      } else {
        alert(message);
      }
    }
  });
})();
