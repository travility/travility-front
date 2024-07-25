import React, { createContext, useContext, useState, useEffect } from "react";

const lightTheme = {
  focusBackground: "var(--light-color)",
  modalBackground: "var(--background-color)",
};

const darkTheme = {
  focusBackground: "var(--dark-color)",
  modalBackground: "var(--dark-color)",
};

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const loadTheme = () => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, loadTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

const useTheme = () => useContext(ThemeContext);

export { ThemeProvider, useTheme, lightTheme, darkTheme };
