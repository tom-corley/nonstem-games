document.addEventListener("DOMContentLoaded", async () => {;

  const response = await fetch("/users/login");

  if (!response.ok) {
    document.getElementById("profile").innerText = "Not a Profile"
    return;
  }

  const user = await response.json();
  document.getElementById("profile").innerHTML = `
    <p><strong>Username:</strong> ${user.username}</p>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Full Name:</strong> ${user.full_name}</p>
  `;
});
