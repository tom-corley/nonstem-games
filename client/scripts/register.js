const { storeToken } = require('./helpers/helpers.js');

// DOM elements
const registerForm = document.querySelector("main form");
const messageDiv = document.getElementById("register-message");


if (registerForm) {
  registerForm.addEventListener("submit", handleRegister);
}

async function handleRegister(e) {
  e.preventDefault();

  // Get input values (add IDs to your HTML inputs for this to work)
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const username = usernameInput ? usernameInput.value : "";
  const password = passwordInput ? passwordInput.value : "";

  // Validate
  if (!username || !password) {
    showMessage("Please enter both username and password", "red");
    return;
  }

  try {
    // Register and login
    const result = await registerUser(username, password);
    showMessage("Registration successful! You are now logged in.", "green");
    setTimeout(() => {
      window.location.href = "/profile.html";
    }, 1500);
  } catch (error) {
    showMessage(error.message || "Registration failed. Please try again.", "red");
  }
}

// Core registration logic
async function registerUser(username, password) {
  // Register
  const regRes = await fetch("http://localhost:3000/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!regRes.ok) {
    const error = await regRes.json();
    throw new Error(error.error || "Registration failed");
  }

  // Login
  const loginRes = await fetch("http://localhost:3000/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!loginRes.ok) {
    const error = await loginRes.json();
    throw new Error(error.error || "Login failed");
  }

  const loginData = await loginRes.json();
  storeToken(loginData.token);
  return loginData;
}

// Utility to show messages in the UI
function showMessage(msg, color) {
  if (messageDiv) {
    messageDiv.textContent = msg;
    messageDiv.style.color = color;
    messageDiv.style.display = "block";
    setTimeout(() => {
      messageDiv.textContent = "";
      messageDiv.style.display = "none";
    }, 4000);
  }
}

module.exports = registerUser;