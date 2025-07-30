let questions = [];
let startTime, timerInterval;

document.addEventListener("DOMContentLoaded", async () => {
  await loadQuestions();

  document.getElementById("start-btn").addEventListener("click", () => {
    startTime = Date.now();

    timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      document.getElementById("timer").textContent = `Time: ${elapsed}s`;
    }, 1000);
  });

  document.getElementById("submit-btn").addEventListener("click", async () => {
    const endTime = Date.now();
    clearInterval(timerInterval);

    const timeTaken = Math.floor((endTime - startTime) / 1000);

    const userAnswers = {};
    questions.forEach((q) => {
      const selected = document.querySelector(`input[name="question-${q.id}"]:checked`);
      userAnswers[q.id] = selected ? selected.value : null;
    });

    try {
      let score = 0;
      questions.forEach((q) => {
        if (userAnswers[q.id] === q.correct_answer) score++;
      });

      const percentage = Math.round((score / questions.length) * 100);
      const date = new Date().toLocaleDateString();

      // Prepare payload for games table
      const startedAt = new Date(startTime).toISOString();
      const endedAt = new Date(endTime).toISOString();
      const category = questions.length > 0 ? questions[0].category : "Geography";
      const userId = 1; // TODO: Replace with actual user ID from session/auth

      const gamePayload = {
        user_id: userId,
        score,
        started_at: startedAt,
        ended_at: endedAt,
        total_questions: questions.length,
        correct_answers: score,
        category
      };

      await fetch("http://localhost:3000/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gamePayload),
      });

      document.getElementById("results").innerText =
        `You scored ${score}/${questions.length} (${percentage}%)`;

      window.location.href = "geography-game-results.html";
    } catch (error) {
      console.error("Submission failed:", error);
      document.getElementById("results").innerText = "There was an error submitting your results.";
    }
  });
});

async function loadQuestions() {
  try {
    const res = await fetch("http://localhost:3000/questions");
    const data = await res.json();

    // Convert to unified structure with `options`
    questions = data.map((q) => ({
      ...q,
      text: q.question_text,
      options: [q.choice_a, q.choice_b, q.choice_c, q.choice_d],
    }));

    console.log("Parsed questions:", questions);

    const form = document.getElementById("quiz-form");
    form.innerHTML = "";

    questions.forEach((q) => {
      const block = document.createElement("div");
      block.className = "question-block";
      block.innerHTML = `<h3>${q.text}</h3>`;

      q.options.forEach((option) => {
        const label = document.createElement("label");
        label.innerHTML = `
          <input type="radio" name="question-${q.id}" value="${option}" required />
          ${option}
        `;
        block.appendChild(label);
      });

      form.appendChild(block);
    });
  } catch (error) {
    console.error("Error loading questions:", error);
    document.getElementById("results").innerText =
      "Could not load questions. Please try again.";
  }
}

