/* global securityContext, userRepository, messageModal,
serialiseFormData, userSettingsMenuDropdown, delay  */

const loginButtonCTA = $('#login-cta'); // Call-to-action button for user login
const loginButtonEl = $('#login-user'); // Main login button
const loginDismissButtonEl = $('#login-dismiss'); // Button to dismiss or close login modal
const userLoginForm = $('#user-login-form'); // Form element for user login
const userLoginModal = $('#login-modal'); // Modal for user login
const loginInProgressEl = $('#is-logging'); // Element indicating login process is in progress
const userSignOutEl = $('#sign-out'); // Button or element for user sign out
const userSettingsButtonEl = $('#user-menu-button'); // Button or element for accessing user settings/menu

// TODO Add as a Tailwind CSS components.
const formValidationSuccess = 'bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500';
const formValidationError = 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500';

function handleDisplayingUserSettingsMenu() {
  const authToken = securityContext.getAuthenticationToken();
  const user = userRepository.findUserByUsername(authToken.username);

  userSettingsButtonEl.removeClass('hidden');

  $('#user-avatar').attr('src', user.avatar);
  $('#display-name').text(`${user.firstName} ${user.lastName}`);
  $('#email-address').text(user.emailAddress);
}

if (!('jwt-token' in sessionStorage)) {
  loginButtonCTA.removeClass('hidden');
} else {
  handleDisplayingUserSettingsMenu();
}

function handleUserLoginModal() {
  userLoginModal.removeClass('hidden');
  return messageModal.show();
}

async function handleUserLogin(event) {
  try {
    event.preventDefault();

    // Constructs an object from input values from the login form.
    const userSigningFormDataObject = serialiseFormData(userLoginForm);

    // Uses deconstruct to get email and password fields from the object.
    const { email, password } = userSigningFormDataObject;

    const isCredentialsCorrect = securityContext.isCredentialsCorrect(email, password);

    const passwordElement = $('#password');
    const emailElement = $('#email');
    const invalidFeedbackElement = $('#invalid-feedback');

    loginButtonEl.addClass('hidden');
    loginInProgressEl.removeClass('hidden');

    await delay(2000);

    if (!isCredentialsCorrect) {
      passwordElement.attr('class', formValidationError);
      emailElement.attr('class', formValidationError);
      invalidFeedbackElement.removeClass('hidden');
      loginButtonEl.removeClass('hidden');
      loginInProgressEl.addClass('hidden');
    } else {
      passwordElement.attr('class', formValidationSuccess);
      emailElement.attr('class', formValidationSuccess);

      await delay(1000);
      securityContext.authenticateUser(email, password);
      handleDisplayingUserSettingsMenu();
      messageModal.hide();
      userLoginModal.addClass('hidden');
      invalidFeedbackElement.addClass('hidden');
      loginButtonEl.removeClass('hidden');
      loginInProgressEl.addClass('hidden');
      loginButtonCTA.addClass('hidden');
    }
  } catch (error) {
    // Handles any errors that may occur during the signing process
    console.error('Error occurred user signing:', error);
    $('#invalid-feedback').removeClass('hidden').text('An unexpected error occurred. Please try again later.');
  }
}

function handleUserSignOut() {
  sessionStorage.removeItem('jwt-token');
  loginButtonCTA.removeClass('hidden');
  userSettingsMenuDropdown.hide();
  userSettingsButtonEl.addClass('hidden');
}

loginButtonCTA.on('click', handleUserLoginModal);
userLoginForm.on('submit', loginButtonEl, handleUserLogin);
loginDismissButtonEl.on('click', () => {
  messageModal.hide();
});

userSignOutEl.on('click', handleUserSignOut);
