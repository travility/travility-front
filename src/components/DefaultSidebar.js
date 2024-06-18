import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../styles/components/DefaultSidebar.module.css';

const DefaultSidebar = () => {
  
  
  
  
  
  
  
return (
    <div className={styles.sidebar}>
      
      <ul>
        <li className={styles.sidebarHeader}>
            대시보드
        </li>
        <li className={styles.sidebarSubHeader}>
            내 여행 한눈에 보기
        </li>
        <li className={styles.sidebarItem}>
          <NavLink to="/myreportpage" className={styles.NavLink}>마이 리포트</NavLink>
        </li>
        <li className={styles.sidebarItem}>
          <NavLink to="/calendar" className={styles.NavLink}>캘린더</NavLink>
        </li>
        <li className={styles.sidebarItem}>
          <NavLink to="/myinfopage" className={styles.NavLink}>내 정보</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default DefaultSidebar;
