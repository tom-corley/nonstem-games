import { getUserId, getToken, formatDate } from './helpers/helpers.js';

// Global variables to track game state
let questions = [];
let startTime, timerInterval;
let currentGameId = null;

// Set up event listeners for game controls when page is loaded
document.addEventListener("DOMContentLoaded", async () => {
  setupEventListeners();
});

function setupEventListeners() {
  // Start Game button - creates a new game and loads questions
  document.getElementById("start-btn").addEventListener("click", async () => {
    console.log("Start button clicked!"); // Debug log
    
    // Check if user is logged in before starting game
    const token = getToken();
    const userId = getUserId();
    
    if (!token || !userId) {
      // Redirect to login if not authenticated
      document.getElementById("results").innerText = "Please login to start a game. Redirecting to login page...";
      setTimeout(() => {
        window.location.href = '../pages/login.html';
      }, 3000);
      return;
    }

    try {
      console.log("Sending game request with user_id:", userId);
      // Start the game on the server by creating a new game record
      const startRes = await fetch("http://localhost:3000/games/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          user_id: parseInt(userId), 
          category: "Geography", 
          num_questions: 10 
        }),
      });

      console.log("Server response status:", startRes.status);

      if (!startRes.ok) {
        throw new Error("Failed to start game");
      }

      // Parse the server response to get game data and questions
      const gameData = await startRes.json();
      currentGameId = gameData.game.id;
      
      // Transform server questions into the format needed for display
      questions = gameData.game_questions.map((q) => ({
        ...q,
        text: q.question_text,
        options: [q.choice_a, q.choice_b, q.choice_c, q.choice_d],
      }));

      console.log(`Loaded ${questions.length} questions from server:`, questions);

      // Display the questions on the page
      displayQuestions();

      // Start the timer to track how long the user takes
      startTime = Date.now();
      timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById("timer").textContent = `Time: ${elapsed}s`;
      }, 1000);

    } catch (error) {
      console.error("Error starting game:", error);
      document.getElementById("results").innerText = "Failed to start game. Please try again.";
    }
  });

  // Submit Answers button - sends results to server and redirects to results page
  document.getElementById("submit-btn").addEventListener("click", async () => {
    event.preventDefault();
    
    // Check if there's an active game
    if (!currentGameId) {
      document.getElementById("results").innerText = "No active game. Please start a game first.";
      return;
    }

    // Get authentication token
    const token = getToken();
    if (!token) {
      document.getElementById("results").innerText = "You must be logged in to submit your answers.";
      return;
    }

    // Calculate time taken for the quiz
    const endTime = Date.now();
    clearInterval(timerInterval);
    const timeTaken = Math.floor((endTime - startTime) / 1000);

    // Collect all user answers from the form
    const userAnswers = {};
    questions.forEach((q) => {
      const selected = document.querySelector(`input[name="question-${q.id}"]:checked`);
      const textInput = document.querySelector(`input[name="question-${q.id}"]`);
      
      // Handle both multiple choice and short answer questions
      if (selected) {
        userAnswers[q.id] = selected.value;
      } else if (textInput && textInput.type === 'text') {
        userAnswers[q.id] = textInput.value;
      } else {
        userAnswers[q.id] = null;
      }
    });

    try {
      // Calculate the user's score
      let score = 0;
      questions.forEach((q) => {
        if (userAnswers[q.id] === q.correct_answer) score++;
      });

      const percentage = Math.round((score / questions.length) * 100);
      const date = formatDate(new Date().toISOString());

      // Prepare results array for server submission
      const resultsArray = questions.map((q) => ({
        question_id: q.id,
        was_correct: userAnswers[q.id] === q.correct_answer
      }));

      console.log("Answers sent to DB:", resultsArray);

      // Submit results to the server
      const submitRes = await fetch(`http://localhost:3000/games/${currentGameId}/submit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(resultsArray),
      });

      if (!submitRes.ok) {
        throw new Error("Failed to submit results");
      }

      const gameResult = await submitRes.json();
      console.log("Game result:", gameResult);

      // Redirect to results page after successful submission
      window.location.href = './geography-game-results.html';

    } catch (error) {
      console.error("Submission failed:", error);
      document.getElementById("results").innerText = "There was an error submitting your results.";
    }
  });
}

// Displays the questions on the page with appropriate input types
function displayQuestions() {
  const form = document.getElementById("quiz-form");
  // Clear any existing questions
  form.innerHTML = ""; 

  questions.forEach((q) => {
    const block = document.createElement("div");
    block.className = "question-block";
    
    // Add image if image_url is not null
    if (q.image_url) {
      const imageContainer = document.createElement("div");
      // imageContainer.style.textAlign = "center";
      imageContainer.style.marginBottom = "15px";
      
      const image = document.createElement("img");
      image.src = q.image_url;
      image.alt = "Question image";
      image.style.maxWidth = "100%";
      image.style.maxHeight = "250px";
      image.style.border = "1px solid #ccc";
      image.style.borderRadius = "8px";
      image.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
      
      imageContainer.appendChild(image);
      block.appendChild(imageContainer);
    }
    
    block.innerHTML += `<h3>${q.text}</h3>`;

    if (q.question_type === 'multiple_choice') {
      // Show multiple choice options as radio buttons
      q.options.forEach((option) => {
        const label = document.createElement("label");
        label.innerHTML = `
          <input type="radio" name="question-${q.id}" value="${option}" required />
          ${option}
        `;
        block.appendChild(label);
      });
    } else if (q.question_type === 'short_answer') {
      // Show input field for short answer questions
      const input = document.createElement("input");
      input.type = "text";
      input.name = `question-${q.id}`;
      input.placeholder = "Type your answer here...";
      input.required = true;
      input.style.width = "50%";
      input.style.padding = "8px";
      input.style.marginTop = "8px";
      input.style.border = "1px solid #ccc";
      input.style.borderRadius = "4px";
      block.appendChild(input);
    }

    form.appendChild(block);
  });
}

