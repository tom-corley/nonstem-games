// Change the api endpoints  lines 4

window.addEventListener("DOMContentLoaded", async () => {
  try {
    // Change Line 4 for API
    const res = await fetch("http://localhost:3000/game");
    const result = await res.json();

    const table = document.querySelector("#table-div table");
    
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${result.score}/${result.totalQuestions}</td>
      <td>${result.percentage}</td>
      <td>${result.date}</td>
      <td>${result.comments || "—"}</td>
      <td>${result.timeTaken}s</td>
    `;

    table.appendChild(row);
  } catch (error) {
    console.error("Failed to load results:", error);
    const fallback = document.createElement("tr");
    fallback.innerHTML = `<td colspan="5">Error loading results</td>`;
    document.querySelector("#table-div table").appendChild(fallback);
  }
});
