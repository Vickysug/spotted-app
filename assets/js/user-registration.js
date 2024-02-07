/* global messageModal, serialiseFormData, userRepository, applicationContext,
generatePassword, userMapper, handleDisplayingUserSettingsMenu, securityContext, loginButtonCTA,
delay, submitInProgressEl */

const userRegistrationModal = $('#registration-modal');

// Call-to-action button for user registration
const registerButtonCTA = $('#register-cta');

// Form element
const userRegistrationForm = $('#registration-form');

// Dismiss button
const registrationDismissEl = $('#registration-dismiss');

// Submit button
const registerSubmitButtonEl = $('#register-user');

// Validation messages
const passwordValidationMessageEl = $('#password-not-valid');
const passwordConfirmValidationMessageEl = $('#password-not-matched-feedback');
const emailValidationMessageEl = $('#email-is-taken-feedback');
const firstNameValidationMessageEl = $('#firstname-is-invalid-feedback');
const lastNameValidationMessageEl = $('#lastname-is-invalid-feedback');
const usernameValidationMessageEl = $('#username-is-taken-feedback');

// Form input fields
const registrationEmailEl = $('#registration-email');
const usernameEl = $('#username');
const firstNameEl = $('#first-name');
const lastNameEl = $('#last-name');
const registrationPasswordEl = $('#registration-password');
const confirmPasswordEl = $('#registration-confirm-password');

// Button to generate password
const generatePasswordButtonEl = $('#generate-password');

if (!('jwt-token' in sessionStorage)) {
  // Displays main register button
  registerButtonCTA.removeClass('hidden');
}

function handleResettingUserRegistrationForm() {
  // Clears all input values after saving user.
  userRegistrationForm.find('input').val('');

  firstNameEl.attr('class', applicationContext.formInputDefaultStyle);
  firstNameValidationMessageEl.addClass('hidden');

  lastNameEl.attr('class', applicationContext.formInputDefaultStyle);
  lastNameValidationMessageEl.addClass('hidden');

  usernameEl.attr('class', applicationContext.formInputDefaultStyle);
  usernameValidationMessageEl.addClass('hidden');

  registrationEmailEl.attr('class', applicationContext.formInputDefaultStyle);
  emailValidationMessageEl.addClass('hidden');

  passwordValidationMessageEl.addClass('hidden');
  registrationPasswordEl.attr('class', applicationContext.formInputDefaultStyle);

  confirmPasswordEl.attr('class', applicationContext.formInputDefaultStyle);
  passwordConfirmValidationMessageEl.addClass('hidden');

  // Hides modal
  messageModal.hide();

  // Adds the 'hidden' to user registration modal
  userRegistrationModal.addClass('hidden');

  // Adds the 'hidden' class to the call-to-action login button to hide it
  loginButtonCTA.addClass('hidden');

  // Adds the 'hidden' class to the call-to-action registration button to hide it
  registerButtonCTA.addClass('hidden');

  // Removes the 'hidden' to registration submit button
  registerSubmitButtonEl.removeClass('hidden');

  // Adds the 'hidden' to in-progress button
  submitInProgressEl.addClass('hidden');
}

function validateRegistrationForm(userRegistrationFormDataObject) {
  // Collects errors to validate all fields at the same time
  const errors = [];

  // Deconstructs userRegistrationFormDataObject to retrieve values.
  const {
    firstName,
    lastName,
    username,
    registrationEmail,
    registrationPassword,
    confirmPassword,
    termsAndCondition,
  } = userRegistrationFormDataObject;

  if (firstName.trim() === '') {
    firstNameEl.attr('class', applicationContext.formValidationError);
    firstNameValidationMessageEl.removeClass('hidden');
    firstNameValidationMessageEl.text('First name is empty');
    errors.push('First name is empty');
  } else {
    firstNameEl.attr('class', applicationContext.formValidationSuccess);
    firstNameValidationMessageEl.addClass('hidden');
  }

  if (lastName.trim() === '') {
    lastNameEl.attr('class', applicationContext.formValidationError);
    lastNameValidationMessageEl.removeClass('hidden');
    lastNameValidationMessageEl.text('Last name is empty');
    errors.push('Last name is empty');
  } else {
    lastNameEl.attr('class', applicationContext.formValidationSuccess);
    lastNameValidationMessageEl.addClass('hidden');
  }

  if (username.trim() === '') {
    usernameEl.attr('class', applicationContext.formValidationError);
    usernameValidationMessageEl.removeClass('hidden');
    usernameValidationMessageEl.text('Username is empty');
    errors.push('Username is empty');
  } else if (userRepository.findUserByUsername(username)) {
    usernameEl.attr('class', applicationContext.formValidationError);
    usernameValidationMessageEl.removeClass('hidden');
    usernameValidationMessageEl.text('Username is not available');
    errors.push('Username is not available');
  } else {
    usernameEl.attr('class', applicationContext.formValidationSuccess);
    usernameValidationMessageEl.addClass('hidden');
  }

  if (registrationEmail.trim() === '') {
    registrationEmailEl.attr('class', applicationContext.formValidationError);
    emailValidationMessageEl.removeClass('hidden');
    emailValidationMessageEl.text('Email address is empty');
    errors.push('Email address is empty');
  } else if (userRepository.findUserByEmail(registrationEmail)) {
    registrationEmailEl.attr('class', applicationContext.formValidationError);
    emailValidationMessageEl.removeClass('hidden');
    emailValidationMessageEl.text('Email address is not available');
    errors.push('Email address is not available');
  } else {
    registrationEmailEl.attr('class', applicationContext.formValidationSuccess);
    emailValidationMessageEl.addClass('hidden');
  }

  if (registrationPassword.trim() === '') {
    registrationPasswordEl.attr('class', applicationContext.formValidationError);
    passwordValidationMessageEl.removeClass('hidden');
    passwordValidationMessageEl.text('Choose a password');
    passwordConfirmValidationMessageEl.removeClass('hidden');
    passwordConfirmValidationMessageEl.text('Confirm your password');
    errors.push('Choose a password');
  } else {
    registrationPasswordEl.attr('class', applicationContext.formValidationSuccess);
    passwordValidationMessageEl.addClass('hidden');
    passwordConfirmValidationMessageEl.addClass('hidden');
  }

  if (registrationPassword !== confirmPassword || confirmPassword.trim() === '') {
    confirmPasswordEl.attr('class', applicationContext.formValidationError);
    registrationPasswordEl.attr('class', applicationContext.formValidationError);
    passwordValidationMessageEl.removeClass('hidden');
    passwordValidationMessageEl.text('Password does not match');
    errors.push('Password does not match');
  } else {
    registrationPasswordEl.attr('class', applicationContext.formValidationSuccess);
    confirmPasswordEl.attr('class', applicationContext.formValidationSuccess);
    passwordValidationMessageEl.addClass('hidden');
  }

  return errors.length === 0 ? userRegistrationFormDataObject : false;
}

async function handleUserRegistration(event) {
  try {
    event.preventDefault();

    registerSubmitButtonEl.addClass('hidden');
    submitInProgressEl.removeClass('hidden');

    // Create a data transfer object (DTO) from registration form data.
    const userRegistrationFormDataObject = serialiseFormData(userRegistrationForm);

    await delay(2000);

    // Validates registration form

    const isFormValidated = validateRegistrationForm(userRegistrationFormDataObject);
    // Checks if form inputs are validated
    if (!isFormValidated) {
      registerSubmitButtonEl.removeClass('hidden');
      submitInProgressEl.addClass('hidden');
      return false;
    }
    // Awaits a delay of 1000 milliseconds (1 second)
    await delay(1000);
    // Constructs a new user object from the DTO.
    const registeredUser = userMapper(userRegistrationFormDataObject);

    // Creates a new user object, saves it to localStorage and returns it with user ID.
    const user = userRepository.createUser(registeredUser);

    // Resets user registration form styling and clears all input
    handleResettingUserRegistrationForm();

    // Authenticates user programmatically and returns authToken to make testing easier
    const authToken = securityContext.authenticateUser(user.emailAddress, user.password);

    // Displays user setting menu after authenticating user
    if (authToken) handleDisplayingUserSettingsMenu();
  } catch (error) {
    // Handles any errors that may occur during the signing process
    console.error('Error occurred during user registration:', error);
    $('#registration-invalid-feedback').removeClass('hidden').text('An unexpected error occurred. Please try again later.');
  }
}

function handleUserRegistrationModal() {
  userRegistrationModal.removeClass('hidden');
  return messageModal.show();
}

registerButtonCTA.on('click', handleUserRegistrationModal);

userRegistrationForm.on('submit', registerSubmitButtonEl, handleUserRegistration);

generatePasswordButtonEl.on('click', (event) => {
  event.preventDefault();
  const generatedPassword = generatePassword();
  registrationPasswordEl.val(generatedPassword);
  confirmPasswordEl.val(generatedPassword);
});

registrationDismissEl.on('click', () => {
  messageModal.hide();
  handleResettingUserRegistrationForm();
  userRegistrationModal.addClass('hidden');
});
