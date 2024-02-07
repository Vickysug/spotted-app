/* global securityContext, userRepository, messageModal,
serialiseFormData, userSettingsMenuDropdown, delay, applicationContext, registerButtonCTA */

const loginButtonCTA = $('#login-cta'); // Call-to-action button for user login
const loginButtonEl = $('#login-user'); // Main login button
const loginDismissButtonEl = $('#login-dismiss'); // Button to dismiss or close login modal
const userLoginForm = $('#user-login-form'); // Form element for user login
const userLoginModal = $('#login-modal'); // Modal for user login
const loginInProgressEl = $('#is-logging'); // Element indicating login process is in progress
const userSignOutEl = $('#sign-out'); // Button or element for user sign out
const userSettingsButtonEl = $('#user-menu-button'); // Button or element for accessing user settings/menu

function handleDisplayingUserSettingsMenu() {
  const authToken = securityContext.getAuthenticationToken();
  const user = userRepository.findUserByUsername(authToken.username);

  userSettingsButtonEl.removeClass('hidden');

  $('#user-avatar').attr('src', user.avatar);
  $('#display-name').text(`${user.firstName} ${user.lastName}`);
  $('#email-address').text(user.emailAddress);
}
// Checks if jwt-token key exists in sessionStorage
if (!('jwt-token' in sessionStorage)) {
  // Displays main login button
  loginButtonCTA.removeClass('hidden');
} else {
  // Renders user settings menu if a logged in user exists
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
      // Sets the class of the password element to indicate a validation error
      passwordElement.attr('class', applicationContext.formValidationError);

      // Sets the class of the email element to indicate a validation error
      emailElement.attr('class', applicationContext.formValidationError);

      // Removes the 'hidden' class from the invalid feedback element to make it visible
      invalidFeedbackElement.removeClass('hidden');

      // Removes the 'hidden' class from the login button element to make it visible
      loginButtonEl.removeClass('hidden');

      // Adds the 'hidden' class to the element indicating login progress to hide it
      loginInProgressEl.addClass('hidden');
    } else {
      // Sets the class of the password element to indicate successful validation
      passwordElement.attr('class', applicationContext.formValidationSuccess);

      // Sets the class of the email element to indicate successful validation
      emailElement.attr('class', applicationContext.formValidationSuccess);

      // Awaits a delay of 1000 milliseconds (1 second)
      await delay(1000);

      // Authenticates the user with the provided email and password
      securityContext.authenticateUser(email, password);

      // Handles the displaying of the user settings menu
      handleDisplayingUserSettingsMenu();

      // Hides the message modal
      messageModal.hide();

      // Adds the 'hidden' class to the user login modal to hide it
      userLoginModal.addClass('hidden');

      // Adds the 'hidden' class to the invalid feedback element to hide it
      invalidFeedbackElement.addClass('hidden');

      // Removes the 'hidden' class from the login button element to make it visible
      loginButtonEl.removeClass('hidden');

      // Adds the 'hidden' class to the element indicating login progress to hide it
      loginInProgressEl.addClass('hidden');

      // Adds the 'hidden' class to the call-to-action login button to hide it
      loginButtonCTA.addClass('hidden');

      registerButtonCTA.addClass('hidden');
    }
  } catch (error) {
    // Handles any errors that may occur during the signing process
    console.error('Error occurred user signing:', error);
    $('#invalid-feedback').removeClass('hidden').text('An unexpected error occurred. Please try again later.');
  }
}

function handleUserSignOut() {
  // Removes the JWT token from sessionStorage to sign the user out
  securityContext.logout();

  // Removes the 'hidden' class from the call-to-action login button to make it visible
  loginButtonCTA.removeClass('hidden');

  registerButtonCTA.removeClass('hidden');

  // Hides the user settings menu dropdown
  userSettingsMenuDropdown.hide();

  // Adds the 'hidden' class to the user settings button to hide it
  userSettingsButtonEl.addClass('hidden');
}

loginButtonCTA.on('click', handleUserLoginModal);
userLoginForm.on('submit', loginButtonEl, handleUserLogin);
loginDismissButtonEl.on('click', () => {
  userLoginModal.addClass('hidden');
  messageModal.hide();
});

userSignOutEl.on('click', handleUserSignOut);
