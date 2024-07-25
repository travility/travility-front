import React, { useState, useEffect } from "react";
import styles from "../../../styles/common/header/ThemeToggleButton.module.css";

const ThemeToggleButton = ({ toggleTheme, currentTheme }) => {
  const [isLight, setIsLight] = useState(currentTheme === "light");

  useEffect(() => {
    setIsLight(currentTheme === "light");
  }, [currentTheme]);

  const handleClick = () => {
    toggleTheme();
  };

  return (
    <div
      className={`${styles.toggleTheme_button} ${
        isLight ? styles.light : styles.dark
      }`}
      onClick={handleClick}
      style={{
        backgroundImage: `url(${
          isLight
            ? "/images/theme_btn/cloud.png"
            : "/images/theme_btn/stars.png"
        })`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: isLight ? "#9EC5F3" : "#001F44",
      }}
    >
      <div className={styles.icon}>
        <img
          src={
            isLight ? "/images/theme_btn/sun.png" : "/images/theme_btn/moon.png"
          }
          alt={isLight ? "Light" : "Dark"}
          className={styles.iconImage}
        />
      </div>
      <span className={styles.themeText}>{isLight ? "Light" : "Dark"}</span>
    </div>
  );
};

export default ThemeToggleButton;
