// Change the api endpoints  lines 4

window.addEventListener("DOMContentLoaded", async () => {
  let connectionFailed = false;
  let results = [];
  try {
    const res = await fetch("http://localhost:3000/users/results");
    if (!res.ok) throw new Error("DB connection failed");
    results = await res.json();
  } catch (error) {
    connectionFailed = true;
    // Try localStorage fallback
    results = JSON.parse(localStorage.getItem("localResults") || "[]");
    const messageBox = document.getElementById("connection-message");
    messageBox.style.display = "block";
    messageBox.textContent = "Connection failed to retrieve data from DB using localStorage";
    if (results.length === 0) {
      const fallback = document.createElement("tr");
      fallback.innerHTML = `<td colspan="5">No results found in localStorage</td>`;
      document.querySelector("#table-div table").appendChild(fallback);
      return;
    }
  }

  const table = document.querySelector("#table-div table");
  results.forEach((result) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${result.score}/${result.totalQuestions}</td>
      <td>${result.percentage}</td>
      <td>${result.date}</td>
      <td>${result.username || "—"}</td>
      <td>${result.timeTaken}s</td>
    `;
    table.appendChild(row);
  });
});
