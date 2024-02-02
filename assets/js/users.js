/* global userRepository */

// Define the JSONPlaceholder API URL
var jsonPlaceholderApiUrl = 'https://jsonplaceholder.typicode.com/users';

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
  fetch(jsonPlaceholderApiUrl)
    .then(response => response.json())
    .then(data => {
      data.forEach(user => {
        var names = user.name.split(' ');
        var firstName = names[0];
        var lastName = names.slice(1).join(' ');
        var username = user.username.toLowerCase();
        var uuid = self.crypto.randomUUID();
        var userAvatarString = 'https://i.pravatar.cc/150?u=' + uuid;

        var newUser = new User(
          firstName,
          lastName,
          user.email,
          username,
          'temporaryPassword',
          userAvatarString
        );

        userRepository.createUser(newUser); // Use userRepository to save the user
      });
    });
}

// Attach the event listener
document.getElementById('buttonId').addEventListener('click', handleFetchUserClick);