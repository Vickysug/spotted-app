function User(id, firstName, lastName, emailAddress, username, password, avatar) {
  this.id = id;
  this.firstName = firstName;
  this.lastName = lastName;
  this.emailAddress = emailAddress;
  this.username = username;
  this.password = password;
  this.avatar = avatar;
}

fetch('https://jsonplaceholder.typicode.com/users')
  .then(response => response.json())
  .then(data => {
    data.forEach(user => {
      var names = user.name.split(' ');
      var firstName = names[0];
      var lastName = names.slice(1).join(' ');
      var usernameInLowercase = user.username.toLowerCase();

      var newUser = new User(
        user.id,
        firstName,
        lastName,
        user.email,
        usernameInLowercase,
        'temporaryPassword',
        'https://i.pravatar.cc/300'
      );

      userRepository.saveUser(newUser); // Use userRepository to save the user
      console.log(newUser)
    });
  })