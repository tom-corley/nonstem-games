// Set token to local storage
function storeToken(token) {
  if (token) {
    localStorage.setItem('token', token);
  }
}

// Read token from local storage
function getToken() {
  return localStorage.getItem('token');
}

module.exports = { storeToken, getToken };
