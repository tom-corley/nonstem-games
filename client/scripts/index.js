import { getToken } from './helpers/helpers.js';
const token = getToken()

document.addEventListener('DOMContentLoaded', function() {
  // Get the "Start Solving" button
  const startSolvingBtn = document.getElementById('start-solving-btn');
  console.log(token);
  if (localStorage.getItem('loggedIn') === 'true') {
     document.getElementById('profile').style.display = 'inline';
  }

  // Add click event listener to navigate to geography game
  startSolvingBtn.addEventListener('click', function() {
    window.location.href = './pages/geography-game.html';
  });
});
