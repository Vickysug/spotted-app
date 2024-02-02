/* global userRepository */

// Define the JSONPlaceholder API URL
const JSON_PLACEHOLDER_Api_Url = 'https://jsonplaceholder.typicode.com/users';

function User(firstName, lastName, emailAddress, username, password, avatar) {
  this.id = 1;
  this.firstName = firstName;
  this.lastName = lastName;
  this.emailAddress = emailAddress;
  this.username = username;
  this.password = password;
  this.avatar = avatar;
}

// Define the callback function
function handleFetchUserClick() {
  fetch(JSON_PLACEHOLDER_Api_Url)
    .then(response => {
      if (!response.ok) {
        throw new Error('User cannot be fetched.');
      }
      return response.json();
    })
    .then(data => {
      data.forEach(user => {
        var names = user.name.split(' ');
        var firstName = names[0];
        var lastName = names.slice(1).join(' ');

        const newUser = new User(
          firstName,
          lastName,
          user.email,
          user.username.toLowerCase(),
          'temporaryPassword',
          'https://i.pravatar.cc/150?u=' + crypto.randomUUID(),
        );

        userRepository.createUser(newUser); // Use userRepository to save the user
      });
    })
    .catch(error => {
      console.log(error);
    });
}
// Test the function
// handleFetchUserClick(); 

// Attach the event listener
$('buttonId').on('click', handleFetchUserClick);