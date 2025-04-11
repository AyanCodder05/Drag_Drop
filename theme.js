// theme.js

document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("theme-toggle");

    // Load theme from localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    // Toggle Theme
    toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        // Save preference
        const isDark = document.body.classList.contains("dark-mode");
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
});

function setTheme(theme) {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }
  function loadTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) document.body.className = saved;
  }
  