/* global userRepository */

// Define the JSONPlaceholder API URL
const JSON_PLACEHOLDER_USER_API = 'https://jsonplaceholder.typicode.com/users';

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
function handleFetchingUsersFromApi() {
  fetch(JSON_PLACEHOLDER_USER_API)
    .then((response) => {
      if (!response.ok) {
        throw new Error('User cannot be fetched.');
      }
      return response.json();
    })
    .then((data) => {
      data.forEach((user) => {
        const names = user.name.split(' ');
        const firstName = names[0];
        const lastName = names.slice(1).join(' ');

        const newUser = new User(
          firstName,
          lastName,
          user.email,
          user.username.toLowerCase(),
          'temporaryPassword',
          `https://i.pravatar.cc/150?u=${crypto.randomUUID()}`,
        );

        userRepository.createUser(newUser); // Use userRepository to save the user
      });
    })
    .catch((error) => {
      console.log(error);
    });
}
