document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("id");

  // Load existing user and fill input
  const res = await fetch(`http://localhost:3000/users/${userId}`);
  const user = await res.json();
  document.getElementById("username").value = user.username;

  // Attach the event handler for form submission
  const form = document.getElementById("editForm");
  form.addEventListener("submit", (e) => updateUsername(e, userId));
});

const updateUsername = async (e, userId) => {
  e.preventDefault();

  const updatedUsername = document.getElementById("username").value;

  const response = await fetch(`http://localhost:3000/users/update`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJnYXlhdGhyaSIsImlzX2FkbWluIjpmYWxzZSwiaWF0IjoxNzUzODgxNjA2LCJleHAiOjE3NTM4ODUyMDZ9.o65bjgKpqbk2_mi9g57yNkF45OnFyS8zpfaa9Th2Qw8",
    },
    body: JSON.stringify({ username: updatedUsername, id: userId }),
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
