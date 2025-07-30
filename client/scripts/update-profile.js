
const updateUsername = async (e) => {
   e.preventDefault();

  const params = new URLSearchParams(window.location.search);
  const userId = params.get("id");

  const form = document.getElementById("editForm");

  // Fetch existing user
  const res = await fetch(`http://localhost:3000/users/${userId}`);
  const user = await res.json();
  document.getElementById("username").value = user.username;
   const updatedUsername = document.getElementById("username").value;

    const response = await fetch(`http://localhost:3000/update`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: updatedUsername, id: userId })
    });

    const result = await response.json();

    if (response.ok) {
      document.getElementById("message").innerText = "Username updated successfully!";
      setTimeout(() => {
        window.location.href = `profile.html?id=${userId}`;
      }, 1000);
    } else {
      document.getElementById("message").innerText = result.message || "Error updating.";
    }

};
