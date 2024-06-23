import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/components/Header.module.css';
import { ReactComponent as Logo } from '../icon/Travility.svg';
import { logout } from '../api/memberApi';
import {
  handleAlreadyLoggedOut,
  handleSuccessLogout,
  handleTokenExpirationLogout,
} from '../util/logoutUtils';
import { isTokenPresent } from '../util/tokenUtils';
import { TokenStateContext } from '../App';

const Header = () => {
  const { tokenStatus, memberInfo } = useContext(TokenStateContext);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = isTokenPresent();

  const goAboutUs = () => {
    navigate('/');
  };

  const goAccount = () => {
    navigate('/account');
  };

  const goLogin = () => {
    navigate('/login');
  };

  useEffect(() => {
    console.log(tokenStatus);
    console.log(location.pathname);
    console.log(memberInfo);
    if (memberInfo && memberInfo.username) {
      console.log(memberInfo.username);
      setUsername(memberInfo.username);
    }
  }, [location.pathname, memberInfo, tokenStatus]);

  const handleLogout = () => {
    if (tokenStatus === 'Token valid') {
      logout().catch((error) => {
        console.log(error);
      });
      handleSuccessLogout(navigate);
    } else if (tokenStatus === 'Token expired') {
      logout()
        .then(() => {
          handleTokenExpirationLogout(navigate);
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (tokenStatus === 'Token null') {
      handleAlreadyLoggedOut(navigate);
    }
  };

  return (
    <header className={styles.header_container}>
      <div className={styles.header_logo}>
        <Logo />
      </div>
      <div className={styles.header_user_container}>
        {isLoggedIn && username && (
          <span className={styles.header_welcome_message}>
            <img src="/images/person_circle.png" alt="user" />
            {username} 님 반갑습니다!
          </span>
        )}

        <nav className={styles.header_navigation_container}>
          {location.pathname === '/login' || location.pathname === '/signup' ? (
            <button className={styles.aboutus_button} onClick={goAboutUs}>
              About Us
            </button>
          ) : tokenStatus === 'Token valid' ? (
            <>
              <button className={styles.logout_button} onClick={handleLogout}>
                Logout
              </button>
              <button className={styles.account_button} onClick={goAccount}>
                Account
              </button>
              <button className={styles.aboutus_button} onClick={goAboutUs}>
                About Us
              </button>
            </>
          ) : (
            <>
              <button className={styles.login_button} onClick={goLogin}>
                Login
              </button>
              <button className={styles.account_button} onClick={goAccount}>
                Account
              </button>
              <button className={styles.aboutus_button} onClick={goAboutUs}>
                About Us
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
