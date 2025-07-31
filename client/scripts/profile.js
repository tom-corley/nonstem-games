import { getToken } from './helpers/helpers.js';
 const token = getToken();
  const payloadBase64 = token.split('.')[1];
  const decodePayload = atob(payloadBase64)
  const parse = JSON.parse(decodePayload);
  const userId = parse.id;


document.addEventListener("DOMContentLoaded", async () => {
const response = await fetch(`http://localhost:3000/users/${userId}`, {
    headers: {
      authorization: `${token}`
    }
  });
  const user = await response.json();

  document.getElementById("profile").innerHTML = `
    <p><strong>Username:  </strong> ${user.username}</p>
    <p><strong>Join Date:  </strong> ${user.join_date}</p>
    <p><strong>Is Admin:  </strong> ${user.is_admin? "Admin" : "Non-Admin"}</p>
    <p><strong>High Score:  </strong> ${user.high_score}</p>
    <p><strong>Games Played:  </strong> ${user.games_played}</p>
    <p><strong>All Time Score:  </strong> ${user.all_time_score}</p>`
});


// Attach the event handler for delete user
const form = document.getElementById("delete");
console.log(form);
form.addEventListener("click", (e) => deleteUser(e,userId, token));

const deleteUser = async(e, userId, token) => {
  console.log(userId);
   e.preventDefault();
  const response = await fetch(`http://localhost:3000/users/delete`, {
    method: 'DELETE',
    headers: {
     "Content-Type": "application/json",
      "authorization": `Bearer ${token}`

    },
    body: JSON.stringify({"id": userId})
  });

  if (response.ok) {
  console.log("User deleted successfully");
} else {
  console.error("Failed to delete user");
}

}
