import { getToken } from './helpers/helpers.js';
document.addEventListener("DOMContentLoaded", async () => {
  const token = getToken();
  const payloadBase64 = token.split('.')[1];
  const decodePayload = atob(payloadBase64)
  const parse = JSON.parse(decodePayload);
  const userId = parse.id;
  const prevUsernameDiv = document.getElementById("prev-username");
  // Fetch previous username from backend
  try {
    const res = await fetch(`http://localhost:3000/users/${userId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (res.ok) {
      const user = await res.json();
      prevUsernameDiv.textContent = `Previous username: ${user.username}`;
    } else {
      prevUsernameDiv.textContent = "Previous username: (unknown)";
    }
  } catch {
    prevUsernameDiv.textContent = "Previous username: (unknown)";
  }
  // Attach the event handler for form submission
  const form = document.getElementById("editForm");
  form.addEventListener("submit", (e) => updateUsername(e, userId, token));
});

const updateUsername = async (e, userId, token) => {
  e.preventDefault();

  const updatedUsername = document.getElementById("username").value;

  const response = await fetch(`http://localhost:3000/users/update`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
       authorization: `Bearer ${token}`
    },
       body: JSON.stringify({ username: updatedUsername, id: userId })
  });

  const result = await response.json();

  if (response.ok) {
    document.getElementById("message").innerText =
      "Username updated successfully!";
    setTimeout(() => {
      window.location.href = `profile.html?id=${userId}`;
    }, 1000);
  } else {
    document.getElementById("message").innerText =
      result.message || "Error updating.";
  }
};
