import { getToken, formatDate } from './helpers/helpers.js';

window.addEventListener("DOMContentLoaded", async () => {
  let connectionFailed = false;
  let results = [];
  
  // Get authentication token
  const token = getToken();
  if (!token) {
    // Show error message if user is not logged in
    document.getElementById("connection-message").style.display = "block";
    document.getElementById("connection-message").textContent = "Please login to view your results.";
    return;
  }
  
  try {
    // Fetch user's game results from the server
    const res = await fetch("http://localhost:3000/users/results", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("DB connection failed");
    results = await res.json();
  } catch (error) {
    console.error("Error fetching results:", error);
    connectionFailed = true;
    
    // Try localStorage fallback if server connection fails
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
  
  // Handle case where no results are found
  if (results.length === 0) {
    const noResults = document.createElement("tr");
    noResults.innerHTML = `<td colspan="5">No results found</td>`;
    table.appendChild(noResults);
    return;
  }
  
  // Display each result in the table
  results.forEach((result) => {
    const row = document.createElement("tr");
    
    // Calculate percentage from correct answers and total questions
    const percentage = result.total_questions > 0 ? Math.round((result.correct_answers / result.total_questions) * 100) : 0;
    
    // Format the date using the helper function
    const formattedDate = formatDate(result.started_at);
    
    // Calculate time taken if both start and end times are available
    let timeTaken = "—";
    if (result.ended_at && result.started_at) {
      const startTime = new Date(result.started_at);
      const endTime = new Date(result.ended_at);
      const timeDiff = Math.floor((endTime - startTime) / 1000);
      timeTaken = `${timeDiff}s`;
    }
    
    // Create table row with formatted data
    row.innerHTML = `
      <td>${result.correct_answers}/${result.total_questions}</td>
      <td>${percentage}%</td>
      <td>${formattedDate}</td>
      <td>${result.category || "Geography"}</td>
      <td>${timeTaken}</td>
    `;
    table.appendChild(row);
  });
});
