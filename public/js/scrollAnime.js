// Scroll Reveal Animation using Intersection Observer

const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      // When element comes into view
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  {
    threshold: 0.35, // 15% visible triggers animation
  },
);

// observe each element
revealElements.forEach((el) => {
  observer.observe(el);
});
