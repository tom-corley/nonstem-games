document.addEventListener('DOMContentLoaded', function() {
  // Get the "Start Solving" button
  const startSolvingBtn = document.getElementById('start-solving-btn');
  
  // Add click event listener to navigate to geography game
  startSolvingBtn.addEventListener('click', function() {
    window.location.href = './pages/geography-game.html';
  });
}); 