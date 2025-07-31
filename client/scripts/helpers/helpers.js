// Set token to local storage
export function storeToken(token) {
  if (token) {
    localStorage.setItem('token', token);
  }
}

// Read token from local storage
function getToken() {
  return localStorage.getItem('token');
}

// Remove token from local storage
function removeToken() {
  localStorage.removeItem('token')
}

export { getToken, removeToken };
