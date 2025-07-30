// Import token storage helper
const { storeToken } = require('./helpers/helpers.js');

// Registers a new user and logs them in.
// On successful registration, automatically logs in the user and stores the received token in localStorage.
async function registerUser(username, password) {
  try {
    // Send registration request to backend
    const regRes = await fetch('http://localhost:3000/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    // If registration fails, throw an error with the backend's message
    if (!regRes.ok) {
      const error = await regRes.json();
      throw new Error(error.error || 'Registration failed');
    }
    // Registration succeeded, now log in with the same credentials
    const loginRes = await fetch('http://localhost:3000/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    // If login fails, throw an error with the backend's message
    if (!loginRes.ok) {
      const error = await loginRes.json();
      throw new Error(error.error || 'Login failed');
    }
    // Parse login response and store the token in localStorage
    const loginData = await loginRes.json();
    storeToken(loginData.token);
    // Return the login data (token and user info)
    return loginData;
  } catch (err) {
    throw err;
  }
}

module.exports = registerUser;
