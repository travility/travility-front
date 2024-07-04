const lightTheme = {
  background: "#ffffff",
  text: "#000000",
  focusBackground: "var(--light-color)",
  placeHolder: "var(--gray-color)",
};

const darkTheme = {
  background: "#121212",
  text: "#ffffff",
  focusBackground: "var(--dark-color)",
  placeHolder: "var(--line-color)",
};

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
}

function loadTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
}

export { lightTheme, darkTheme, toggleTheme, loadTheme };
