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

function formatDate(dateStr) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const date = new Date(dateStr);
  const day = date.getDate(); // 2
  const month = months[date.getMonth()]; // "Mar"
  const year = date.getFullYear(); // 2025
  return `${month} ${day} ${year}`; // "Mar 2 2025"
}

export { getToken, removeToken, formatDate };
