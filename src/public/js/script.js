document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".apply-btn").forEach(btn => {
    const jobId = btn.dataset.jobId;
    console.log(jobId)

    if (localStorage.getItem(jobId) === "applied") {
      markAsApplied(btn);
    }
  });
});

function applyJob(button) {
  const jobId = button.dataset.jobId;

  // Save applied status
  localStorage.setItem(jobId, "applied");

  // Update button UI
  markAsApplied(button);

  // Show popup
//   new bootstrap.Modal(
//     document.getElementById("applyModal")
//   ).show();
}

function markAsApplied(button) {
  button.innerText = "Applied Successfully";
  button.classList.remove("btn-success");
  button.classList.add("btn-secondary");
  button.disabled = true;
}
