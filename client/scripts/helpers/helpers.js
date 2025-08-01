// Set token to local storage
export function storeToken(token) {
  if (token) {
    localStorage.setItem('token', token);
  }
}

// Read token from local storage
export function getToken() {
  return localStorage.getItem('token');
}

// Remove token from local storage
export function removeToken() {
  localStorage.removeItem('token')
}

// Store user ID to local storage
export function storeUserId(userId) {
  if (userId) {
    localStorage.setItem('userId', userId);
  }
}

// Read user ID from local storage
export function getUserId() {
  return localStorage.getItem('userId');
}

// Remove user ID from local storage
export function removeUserId() {
  localStorage.removeItem('userId');
}

export function formatDate(dateStr) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const date = new Date(dateStr);
  const day = date.getDate(); // 2
  const month = months[date.getMonth()]; // "Mar"
  const year = date.getFullYear(); // 2025
  return `${month} ${day} ${year}`; // "Mar 2 2025"
}
