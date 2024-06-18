import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../styles/components/DefaultSidebar.module.css';

const DefaultSidebar = () => {
  
  
  
  
  
  
  
return (
    <div className={styles.sidebar_container}>
      
      <ul>
        <li className={styles.sidebar_header}>
            대시보드
        </li>
        <li className={styles.sidebar_subheader}>
            내 여행 한눈에 보기
        </li>
        <li className={styles.sidebar_item}>
        <NavLink 
          to="/myreport" 
          className={({ isActive }) =>
            isActive ? `${styles.nav_link} ${styles.nav_link_active}` : styles.nav_link
          }
          >
            마이 리포트
          </NavLink>
        </li>
        <li className={styles.sidebar_item}>
          <NavLink 
          to="/calendar" 
          className={({ isActive }) =>
            isActive ? `${styles.nav_link} ${styles.nav_link_active}` : styles.nav_link
          }
          >
            캘린더
            </NavLink>
        </li>
        <li className={styles.sidebar_item}>
          <NavLink
          to="/myinfo"
          className={({ isActive }) =>
            isActive ? `${styles.nav_link} ${styles.nav_link_active}` : styles.nav_link
          }
          >
            내 정보
            </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default DefaultSidebar;
