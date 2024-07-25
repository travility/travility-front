import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../../styles/common/header/Header.module.css";
import { logout } from "../../../api/memberApi";
import {
  handleAlreadyLoggedOut,
  handleProblemSubject,
  handleSuccessLogout,
  handleTokenExpirationLogout,
} from "../../../util/swalUtils";
import { MemberInfoContext } from "../../../App";
import ThemeToggleButton from "./ThemeToggleButton";
import { useTheme } from "../../../styles/common/Theme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const { memberInfo } = useContext(MemberInfoContext);
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
      await logout();
      handleSuccessLogout(navigate);
    } catch (error) {
      console.log(error);
      const errorMessage = error.response.data;
      if (errorMessage === "refresh token expired") {
        //리프레시 토큰 만료
        handleTokenExpirationLogout();
      } else if (
        errorMessage === "refresh token null" ||
        errorMessage === "invalid refresh token"
      ) {
        handleAlreadyLoggedOut();
      } else {
        handleProblemSubject("로그아웃");
      }
    }
  };

  const handleLogoClick = () => {
    if (memberInfo) {
      navigate("/main");
    } else {
      navigate("/");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
      <div className={styles.header_logo} onClick={handleLogoClick}>
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
      <div className={styles.header_right}>
        <ThemeToggleButton toggleTheme={toggleTheme} currentTheme={theme} />
        {memberInfo && (
          <button className={styles.toggle_button} onClick={toggleSidebar}>
            <FontAwesomeIcon
              icon={isSidebarOpen ? faTimes : faBars}
              size="sm"
            />
          </button>
        )}
      </div>
      {isSidebarOpen && (
        <div className={styles.sidebar}>
          <span className={styles.header_welcome_message}>
            {role === "ROLE_ADMIN" ? (
              <span className={styles.admin_message}>
                현재 관리자 모드입니다
              </span>
            ) : (
              <>
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
          </span>
          <button className={styles.logout_button} onClick={handleLogout}>
            Logout
          </button>
          <button
            className={styles.nav_second_button}
            onClick={() => navigate("/")}
          >
            About Us
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
