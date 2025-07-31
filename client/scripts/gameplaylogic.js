import { getUserId, getToken, formatDate } from './helpers/helpers.js';

let questions = [];
let startTime, timerInterval;
let currentGameId = null; // Store the game ID from the server

document.addEventListener("DOMContentLoaded", async () => {
  // Set up event listeners first
  setupEventListeners();
});

function setupEventListeners() {
  document.getElementById("start-btn").addEventListener("click", async () => {
    console.log("Start button clicked!"); // Debug log
    
    // Check if user is logged in
    const token = getToken();
    const userId = getUserId();
    
    if (!token || !userId) {
      document.getElementById("results").innerText = "Please login to start a game. Redirecting to login page...";
      setTimeout(() => {
        window.location.href = '../pages/login.html';
      }, 3000);
      return;
    }

    try {
      // Start the game on the server
      const startRes = await fetch("http://localhost:3000/games/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          user_id: userId, 
          category: "Geography", 
          num_questions: 10 
        }),
      });

      if (!startRes.ok) {
        throw new Error("Failed to start game");
      }

      const gameData = await startRes.json();
      currentGameId = gameData.game.id;
      questions = gameData.game_questions.map((q) => ({
        ...q,
        text: q.question_text,
        options: [q.choice_a, q.choice_b, q.choice_c, q.choice_d],
      }));

      console.log(`Loaded ${questions.length} questions from server:`, questions);

      // Display questions
      displayQuestions();

      // Start timer
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

  document.getElementById("submit-btn").addEventListener("click", async () => {
    // Prevent page reload
    event.preventDefault();
    
    if (!currentGameId) {
      document.getElementById("results").innerText = "No active game. Please start a game first.";
      return;
    }

    // Get auth token from localStorage
    const token = getToken();
    if (!token) {
      document.getElementById("results").innerText = "You must be logged in to submit your answers.";
      return;
    }

    const endTime = Date.now();
    clearInterval(timerInterval);

    const timeTaken = Math.floor((endTime - startTime) / 1000);

    const userAnswers = {};
    questions.forEach((q) => {
      const selected = document.querySelector(`input[name="question-${q.id}"]:checked`);
      const textInput = document.querySelector(`input[name="question-${q.id}"]`);
      
      if (selected) {
        userAnswers[q.id] = selected.value;
      } else if (textInput && textInput.type === 'text') {
        userAnswers[q.id] = textInput.value;
      } else {
        userAnswers[q.id] = null;
      }
    });

    try {
      let score = 0;
      questions.forEach((q) => {
        if (userAnswers[q.id] === q.correct_answer) score++;
      });

      const percentage = Math.round((score / questions.length) * 100);
      const date = formatDate(new Date().toISOString());

      // Prepare results for PATCH
      const resultsArray = questions.map((q) => ({
        question_id: q.id,
        was_correct: userAnswers[q.id] === q.correct_answer
      }));

      // Log the answers array in the format sent to the DB
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

      // Show result on page
      document.getElementById("results").innerText =
        `You scored ${score}/${questions.length} (${percentage}%) on ${date}`;

    } catch (error) {
      console.error("Submission failed:", error);
      document.getElementById("results").innerText = "There was an error submitting your results.";
    }
  });
}

function displayQuestions() {
  const form = document.getElementById("quiz-form");
  form.innerHTML = "";

  questions.forEach((q) => {
    const block = document.createElement("div");
    block.className = "question-block";
    block.innerHTML = `<h3>${q.text}</h3>`;

    if (q.question_type === 'multiple_choice') {
      // Show multiple choice options
      q.options.forEach((option) => {
        const label = document.createElement("label");
        label.innerHTML = `
          <input type="radio" name="question-${q.id}" value="${option}" required />
          ${option}
        `;
        block.appendChild(label);
      });
    } else if (q.question_type === 'short_answer') {
      // Show input field for short answer
      const input = document.createElement("input");
      input.type = "text";
      input.name = `question-${q.id}`;
      input.placeholder = "Type your answer here...";
      input.required = true;
      input.style.width = "100%";
      input.style.padding = "8px";
      input.style.marginTop = "8px";
      input.style.border = "1px solid #ccc";
      input.style.borderRadius = "4px";
      block.appendChild(input);
    }

    form.appendChild(block);
  });
}

