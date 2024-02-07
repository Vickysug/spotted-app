/* global userRepository */
const persistenceTokenKey = 'jwt-token';
function loadTokenFromSessionStorage() {
  // Retrieves the stored data from sessionStorage
  const storedData = JSON.parse(sessionStorage.getItem(persistenceTokenKey));

  // If there's no stored data, return an empty Map.
  if (!storedData) {
    return new Map();
  }

  return new Map(storedData);
}
function saveTokenToSessionStorage(user) {
  const userSession = new Map();

  userSession.set('name', `${user.firstName} ${user.lastName}`);
  userSession.set('username', user.username);
  userSession.set('timestamp', dayjs().unix());

  sessionStorage.setItem(persistenceTokenKey, JSON.stringify([...userSession]));
}

function clearTokenFromSessionStorage() {
  sessionStorage.removeItem(persistenceTokenKey);
}

function SecurityContext() {
  // Retrieves authentication token.
  this.getAuthenticationToken = function () {
    try {
      let authToken = false;

      if (('jwt-token' in sessionStorage)) {
        authToken = Object.fromEntries(loadTokenFromSessionStorage());
      }

      return authToken;
    } catch (error) {
      console.error('Error retrieving authentication token:', error);
      return false;
    }
  };
  // Checks if user is authenticated
  this.isAuthenticated = function (user) {
    try {
      return userRepository.findUserById(user.id) === this.getAuthenticationToken().username;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  };
  // Checks if user credentials are correct
  this.isCredentialsCorrect = function (emailAddress, password) {
    try {
      const user = userRepository.findUserByEmail(emailAddress);
      if (!user) return false;

      return user.password === password;
    } catch (error) {
      console.error('Error checking credentials:', error);
      return false;
    }
  };
  // Checks for user credentials are correct and generate authentication token
  this.authenticateUser = function (emailAddress, password) {
    try {
      let authToken = false;
      if (this.isCredentialsCorrect(emailAddress, password)) {
        saveTokenToSessionStorage(userRepository.findUserByEmail(emailAddress));
        authToken = this.getAuthenticationToken();
      }
      return authToken;
    } catch (error) {
      console.error('Error authenticating user:', error);
      return false;
    }
  };
  // Logs out user and clears session storage
  this.logout = function () {
    try {
      const authToken = this.getAuthenticationToken();
      if (authToken) {
        clearTokenFromSessionStorage();
        return true; // Indicates successful logout
      }
      return false; // Indicates failed logout
    } catch (error) {
      console.error('Error during logout:', error);
      return false; // Indicates failed logout (error occurred)
    }
  };
}

const securityContext = new SecurityContext();
