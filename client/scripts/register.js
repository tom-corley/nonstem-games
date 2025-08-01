// const { storeToken } = require('./helpers/helpers.js');

import { storeToken, storeUserId } from '../scripts/helpers/helpers.js';

// DOM elements
const registerForm = document.getElementById("register-form");
const messageDiv = document.getElementById("register-message");

// Listen for form submission
if (registerForm) {
  registerForm.addEventListener("submit", handleRegister);
}

async function handleRegister(e) {
  e.preventDefault();
  console.log("Registration form submitted");

  // Get input values (add IDs to your HTML inputs for this to work)
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const username = usernameInput ? usernameInput.value : "";
  const password = passwordInput ? passwordInput.value : "";

  console.log("Username:", username, "Password:", password);

  // Validate
  if (!username || !password) {
    showMessage("Please enter both username and password", "red");
    return;
  }

  try {
    console.log("Attempting registration...");
    // Attempt register and redirect to profile page if successful
    const result = await registerUser(username, password);
    console.log("Registration successful, redirecting to index.html");
    window.location.href = "../index.html";
  } catch (error) {
    console.error("Registration error:", error);
    showMessage(error.message || "Registration failed. Please try again.", "red");
  }
}

// Core registration logic
async function registerUser(username, password) {
  console.log("Starting registration process...");
  
  // Register
  const regRes = await fetch("http://localhost:3000/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  
  if (!regRes.ok) {
    const error = await regRes.json();
    console.error("Registration failed:", error);
    throw new Error(error.error || "Registration failed");
  }

  console.log("Registration successful, attempting login...");
  
  // Login
  const loginRes = await fetch("http://localhost:3000/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  console.log("Login response status:", loginRes.status);
  
  if (!loginRes.ok) {
    const error = await loginRes.json();
    console.error("Login failed:", error);
    throw new Error(error.error || "Login failed");
  }

  const loginData = await loginRes.json();
  console.log("Login successful, storing token and user ID...");
  storeToken(loginData.token);
  storeUserId(loginData.user.id);
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
    }, 5000);
  }
}

export { registerUser };