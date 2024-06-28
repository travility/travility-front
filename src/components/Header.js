import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/components/Header.module.css";
import { logout } from "../api/memberApi";
import {
  handleAlreadyLoggedOut,
  handleSuccessLogout,
  handleTokenExpirationLogout,
} from "../util/logoutUtils";
import { TokenStateContext } from "../App";

const Header = () => {
  const { tokenStatus, memberInfo } = useContext(TokenStateContext);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (memberInfo) {
      setUsername(memberInfo.username || "");
      setRole(memberInfo.role || "");
    }
  }, [memberInfo]);

  const handleLogout = async () => {
    try {
      if (tokenStatus === "Token valid") {
        await logout();
        handleSuccessLogout(navigate);
      } else if (tokenStatus === "Token expired") {
        await logout();
        handleTokenExpirationLogout(navigate);
      } else if (tokenStatus === "Token null") {
        handleAlreadyLoggedOut(navigate);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogoClick = () => {
    if (tokenStatus === "Token valid") {
      navigate("/main");
    } else {
      navigate("/");
    }
  };

  const logoStyle = {
    color: location.pathname === "/" ? "#fff" : "var(--main-color)",
  };

  return (
    <header className={styles.header_container}>
      <div
        className={styles.header_logo}
        onClick={handleLogoClick}
        style={logoStyle}
      >
        Travility
      </div>
      {(tokenStatus === "Token valid" || location.pathname !== "/") && (
        <div className={styles.header_user_container}>
          {tokenStatus === "Token valid" && (
            <>
              <span className={styles.header_welcome_message}>
                {role === "ROLE_ADMIN" ? (
                  <>현재 관리자 모드입니다</>
                ) : (
                  <>
                    <img src="/images/person_circle.png" alt="user" />
                    {username} 님 반갑습니다!
                  </>
                )}
              </span>
              <nav className={styles.header_navigation_container}>
                <button className={styles.logout_button} onClick={handleLogout}>
                  Logout
                </button>
                {role === "ROLE_ADMIN" ? (
                  <button
                    className={styles.nav_second_button}
                    onClick={() => navigate("/admin/users")}
                  >
                    관리
                  </button>
                ) : (
                  <button
                    className={styles.nav_second_button}
                    onClick={() => navigate("/")}
                  >
                    About Us
                  </button>
                )}
              </nav>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
