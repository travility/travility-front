import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../styles/components/header/Header.module.css";
import { logout } from "../../api/memberApi";
import {
  handleAlreadyLoggedOut,
  handleSuccessLogout,
  handleTokenExpirationLogout,
} from "../../util/logoutUtils";
import { TokenStateContext } from "../../App";
import ThemeToggleButton from "./ThemeToggleButton";
import { useTheme } from "../../styles/Theme";

const Header = () => {
  const { memberInfo } = useContext(TokenStateContext);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (memberInfo) {
      setName(memberInfo.name);
      setRole(memberInfo.role);
    }
  }, [memberInfo, location.pathname, navigate]);

  const handleLogout = async () => {
    try {
      // if (tokenStatus === 'Token valid') {
      //   await logout();
      //   handleSuccessLogout(navigate);
      // } else if (tokenStatus === 'Token expired') {
      //   await logout();
      //   handleTokenExpirationLogout(navigate);
      // } else if (tokenStatus === 'Token null') {
      //   handleAlreadyLoggedOut(navigate);
      // }
      await logout();
      handleSuccessLogout(navigate);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogoClick = () => {
    if (memberInfo) {
      navigate('/main');
    } else {
      navigate("/");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const logoStyle = {
    color: location.pathname === "/" ? "#fff" : "var(--main-color)",
  };

  const handleMouseOver = (e) => {
    const img = e.currentTarget.querySelector("img");
    if (img) {
      img.src = "/images/person_circle_pk.png";
    }
  };

  const handleMouseOut = (e) => {
    const img = e.currentTarget.querySelector("img");
    if (img) {
      img.src = "/images/person_circle.png";
    }
  };

  return (
    <header className={styles.header_container}>
      <div
        className={styles.header_logo}
        onClick={handleLogoClick}
        style={logoStyle}
      >
        <div className={styles.logo_container}>
          <img src="/images/main/logo.png" alt="logo" className={styles.logo} />
          <img
            src="/images/main/logo2.png"
            alt="logo"
            className={styles.logoMove}
          />
        </div>
        TRAVILITY
      </div>
      {(memberInfo || location.pathname !== '/') && (
        <div className={styles.header_user_container}>
          {memberInfo && (
            <>
              <span className={`${styles.header_welcome_message} ${
              isSidebarOpen ? styles.open : ""
            }`}>
                {role === 'ROLE_ADMIN' ? (
                  <>현재 관리자 모드입니다</>
                ) : (
                  <>
                    <img src="/images/person_circle.png" alt="user" />
                    {name} 님 반갑습니다!
                  </>
                )}
              </span>
              <nav className={styles.header_navigation_container}>
                <button
                  onClick={() => navigate("/dashboard/myinfo")}
                  className={styles.user_button}
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  <img src="/images/person_circle.png" alt="user" />
                  {name}
                </button>
                님 반갑습니다!
              </>
            )}
            <button className={styles.toggle_button} onClick={toggleSidebar}>
              {isSidebarOpen ? ">" : "<"}
            </button>
          </span>
          {isSidebarOpen && (
            <div className={styles.sidebar}>
              <button className={styles.logout_button} onClick={handleLogout}>
                Logout
              </button>
              <button
                className={styles.nav_second_button}
                onClick={() => navigate("/")}
              >
                About Us
              </button>
              <ThemeToggleButton
                toggleTheme={toggleTheme}
                currentTheme={theme}
              />
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
