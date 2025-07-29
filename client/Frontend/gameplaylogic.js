async function loadQuestions() {
  try {
    const res = await fetch('/api/questions');
    const questions = await res.json();

    const form = document.getElementById("quiz-form");
    form.innerHTML = ""; // Clear any existing content

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

    setupSubmission(questions);
  } catch (error) {
    console.error("Error loading questions:", error);
    document.getElementById("results").innerText = "Could not load questions. Please try again.";
  }
}

function setupSubmission(questions) {
  const btn = document.getElementById("submit-btn");
  btn.addEventListener("click", () => {
    let score = 0;
    questions.forEach((q) => {
      const selected = document.querySelector(`input[name="question-${q.id}"]:checked`);
      if (selected && selected.value === q.answer) {
        score++;
      }
    });

    const percentage = Math.round((score / questions.length) * 100);
    document.getElementById("results").innerText = `You scored ${score}/${questions.length} (${percentage}%)`;
  });
}

// Init the quiz when page loads
document.addEventListener("DOMContentLoaded", loadQuestions);
