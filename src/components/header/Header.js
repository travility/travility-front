import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../styles/components/header/Header.module.css';
import { logout } from '../../api/memberApi';
import {
  handleAlreadyLoggedOut,
  handleProblemSubject,
  handleSuccessLogout,
  handleTokenExpirationLogout,
} from '../../util/swalUtils';
import { MemberInfoContext } from '../../App';
import ThemeToggleButton from './ThemeToggleButton';
import { useTheme } from '../../styles/Theme';

const Header = () => {
  const { memberInfo } = useContext(MemberInfoContext);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
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
      if (errorMessage === 'refresh token expired') {
        //리프레시 토큰 만료
        handleTokenExpirationLogout();
      } else if (
        errorMessage === 'refresh token null' ||
        errorMessage === 'invalid refresh token'
      ) {
        handleAlreadyLoggedOut();
      } else {
        handleProblemSubject('로그아웃');
      }
    }
  };

  const handleLogoClick = () => {
    if (memberInfo) {
      navigate('/main');
    } else {
      navigate('/');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const logoStyle = {
    color: location.pathname === '/' ? '#fff' : 'var(--main-color)',
  };

  const handleMouseOver = (e) => {
    const img = e.currentTarget.querySelector('img');
    if (img) {
      img.src = '/images/person_circle_pk.png';
    }
  };

  const handleMouseOut = (e) => {
    const img = e.currentTarget.querySelector('img');
    if (img) {
      img.src = '/images/person_circle.png';
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
      {memberInfo && location.pathname !== '/' && (
        <div className={styles.header_right}>
          <span
            className={`${styles.header_welcome_message} ${
              isSidebarOpen ? styles.open : ''
            }`}
          >
            {role === 'ROLE_ADMIN' ? (
              <span className={styles.admin_message}>
                현재 관리자 모드입니다
              </span>
            ) : (
              <>
                <button
                  onClick={() => navigate('/dashboard/myinfo')}
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
              {isSidebarOpen ? '>' : '<'}
            </button>
          </span>
          {isSidebarOpen && (
            <div className={styles.sidebar}>
              <button className={styles.logout_button} onClick={handleLogout}>
                Logout
              </button>
              <button
                className={styles.nav_second_button}
                onClick={() => navigate('/')}
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
