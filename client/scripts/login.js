import { storeToken, storeUserId } from './helpers/helpers.js';

// DOM elements
const loginForm = document.getElementById('login-form');
const messageDiv = document.getElementById('login-message');

// Listen for form submission
if (loginForm) {
  loginForm.addEventListener('submit', handleLogin);
}

async function handleLogin(e) {
  e.preventDefault();
  console.log('Login form submitted');

  // Get input values
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const username = usernameInput ? usernameInput.value : '';
  const password = passwordInput ? passwordInput.value : '';

  console.log('Username:', username, 'Password:', password ? '***' : 'empty');

  // Validate
  if (!username || !password) {
    showMessage('Please enter both username and password', 'red');
    return;
  }

  try {
    console.log('Attempting login...');
    // Attempt login and redirect to profile page if successful
    const result = await loginUser(username, password);
    console.log('Login successful, redirecting to index.html');
    localStorage.setItem('loggedIn', 'true');
    window.location.href = '../index.html';
  } catch (error) {
    console.error('Login error:', error);
    showMessage(error.message || 'Login failed. Please try again.', 'red');
  }
}

// Core login logic
async function loginUser(username, password) {
  console.log('Starting login process...');

  const loginRes = await fetch('http://localhost:3000/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!loginRes.ok) {
    const error = await loginRes.json();
    console.error('Login failed:', error);
    throw new Error(error.error || 'Login failed');
  }

  const loginData = await loginRes.json();
  console.log(loginData);
  console.log('Login successful, storing token and user ID...');
  storeToken(loginData.token);
  storeUserId(loginData.user.id);
  return loginData;
}

// Utility to show messages in the UI
function showMessage(msg, color) {
  if (messageDiv) {
    messageDiv.textContent = msg;
    messageDiv.style.color = color;
    messageDiv.style.display = 'block';
    setTimeout(() => {
      messageDiv.textContent = '';
      messageDiv.style.display = 'none';
    }, 5000);
  }
}

export { loginUser };
