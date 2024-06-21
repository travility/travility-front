import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/components/Header.module.css';
import { ReactComponent as Logo } from '../icon/Travility.svg';
import { logout } from '../api/memberApi';
import Swal from 'sweetalert2';
import {
  handleAlreadyLoggedOut,
  handleTokenExpirationLogout,
} from '../util/logoutUtils';
import { decodeToken, isTokenPresent, removeToken } from '../util/tokenUtils';

const Header = () => {
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
    if (isLoggedIn) {
      setUsername(decodeToken().username);
    } else {
      setUsername('');
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    if (!isTokenPresent()) {
      //토큰이 없으면
      handleAlreadyLoggedOut(navigate);
    } else {
      //토큰이 없으면
      logout()
        .then(() => {
          removeToken();
          Swal.fire({
            title: '로그아웃 성공',
            icon: 'success',
            confirmButtonColor: '#2a52be',
          }).then(() => {
            navigate('/login');
          });
        })
        .catch((error) => {
          console.log(error);
          if (error === 'Token expired') {
            handleTokenExpirationLogout(navigate);
          }
        });
    }
  };

  return (
    <header className={styles.header_container}>
      <div className={styles.header_logo}>
        <Logo />
      </div>
      <div className={styles.header_user_container}>
        {isLoggedIn && (
          <span className={styles.header_welcome_message}>
            <img src="/images/person_circle.png" alt="user" />
            {username} 님 반갑습니다!
          </span>
        )}

        <nav className={styles.header_navigation_container}>
          {location.pathname === '/login' ? (
            <button className={styles.aboutus_button} onClick={goAboutUs}>
              About Us
            </button>
          ) : isLoggedIn ? (
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
