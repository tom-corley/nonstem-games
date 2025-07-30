document.addEventListener("DOMContentLoaded", async () => {

  const response = await fetch("http://localhost:3000/users/1");

  const user = await response.json();
  console.log(user);
  document.getElementById("profile").innerHTML = `
    <p><strong>Username:  </strong> ${user.username}</p>
    <p><strong>Join Date:  </strong> ${user.join_date}</p>
    <p><strong>Is Admin:  </strong> ${user.is_admin? "Admin" : "No Admin"}</p>
    <p><strong>High Score:  </strong> ${user.high_score}</p>
    <p><strong>Games Played:  </strong> ${user.games_played}</p>
    <p><strong>All Time Score:  </strong> ${user.all_time_score}</p>

    `
});
