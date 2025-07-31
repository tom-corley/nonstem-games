import { getToken, formatDate, removeToken } from './helpers/helpers.js';
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
    <h1 class="my-1 text-center text-xl font-bold leading-8 text-gray-900">${user.username}</h1>
    <ul class="mt-3 divide-y rounded bg-gray-100 py-2 px-3 text-gray-600 shadow-sm hover:text-gray-700 hover:shadow">
       <li class="flex items-center py-1 text-sm">
          <span>Join Date </span>
            <span class="ml-auto">${formatDate(user.join_date)}</span>
        </li>
        <li class="flex items-center py-1 text-sm">
          <span>Game played</span>
            <span class="ml-auto"><span class="rounded-full bg-yellow-200 py-1 px-2 text-xs font-medium text-white-700">${user.games_played}</span></span>
        </li>
        <li class="flex items-center py-1 text-sm">
          <span>Score</span>
            <span class="ml-auto"><span class="rounded-full bg-yellow-200 py-1 px-2 text-xs font-medium text-white-700">${user.high_score}</span></span>
        </li>
         <li class="flex items-center py-1 text-sm">
          <span>All Time Score</span>
            <span class="ml-auto"> <span class="rounded-full bg-yellow-200 py-1 px-2 text-xs font-medium text-white-700">${user.all_time_score}</span></span>
        </li>
    </ul>`
});


// Attach the event handler for delete user
const form = document.getElementById("delete");
const logout = document.getElementById("logout");
console.log(form);
form.addEventListener("click", (e) => deleteUser(e,userId, token));
logout.addEventListener("click", (e) => logoutUser());


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
    document.getElementById("profile").innerHTML = `<h1 class="my-1 text-center text-xl font-bold leading-8 text-gray-900">User deleted successfully </h1>`;
     setTimeout(() => {
      window.location.href = `../index.html`;
    }, 1000);
  } else {
    document.getElementById("profile").innerHTML = ` <h1 class="my-1 text-center text-xl font-bold leading-8 text-gray-900">Users can't be deleted</h1>`;
}


}

const logoutUser = () => {
    removeToken();
    localStorage.setItem('loggedIn', 'false');
     setTimeout(() => {
      window.location.href = `../index.html`;
    }, 500);

}
