import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/components/Header.module.css';
import { ReactComponent as Logo } from '../icon/Travility.svg';
import { logout } from '../api/memberApi';
import Swal from 'sweetalert2';

const Header = () => {
  const navigate = useNavigate();

  const goAboutUs = () => {
    navigate('/');
  };

  const goAccount = () => {
    navigate('/account');
  };

  const handleLogout = () => {
    const token = localStorage.getItem('Authorization');
    console.log(token);
    if (token) {
      //로그인 상태인 경우 == 토큰이 있는 경우
      logout(token)
        .then(() => {
          localStorage.removeItem('Authorization');
          Swal.fire({
            title: '로그아웃 성공',
            icon: 'success',
            confirmButtonColor: '#2a52be',
          });
          navigate('/');
        })
        .catch((error) => {
          console.log(error);
          Swal.fire({
            title: '로그아웃 실패',
            text: '로그아웃 중 문제가 생겼습니다.',
            icon: 'error',
            confirmButtonColor: '#2a52be',
          }).then(() => {
            navigate('/');
          });
        });
    } else {
      Swal.fire({
        title: '로그아웃 실패',
        text: '이미 로그아웃 상태입니다.',
        icon: 'error',
        confirmButtonColor: '#2a52be',
      }).then(() => {
        navigate('/');
      });
    }
  };

  const userName = 'OOO';

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
            <button onClick={handleLogout}>Logout</button>
            <button onClick={goAccount}>Account</button>
            <button onClick={goAboutUs}>About Us</button>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Header;
