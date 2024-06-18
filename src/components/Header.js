import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/components/Header.module.css";
import { ReactComponent as Logo } from "../icon/Travility.svg";

const Header = () => {
  const navigate = useNavigate();

  const goAboutUs = () => {
    navigate("/");
  };

  const goAccount = () => {
    navigate("/account");
  };

  const handleLogout = () => {};

  const userName = "OOO";

  return (
    <div className="inner">
      <header className={styles.header}>
        <div className={styles.logo}>
          <Logo />
        </div>
        <div className={styles.userActions}>
          <span className={styles.welcomeMessage}>
            <img src="/images/person_circle.png" alt="user" />
            {userName} 님 반갑습니다!
          </span>
          <nav className={styles.nav}>
            <a href="/" onClick={handleLogout}>
              Logout
            </a>
            <a href="/account" onClick={goAccount}>
              Account
            </a>
            <a href="/" onClick={goAboutUs}>
              About Us
            </a>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Header;
