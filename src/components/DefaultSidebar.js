import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from '../styles/components/DefaultSidebar.module.css';

const DefaultSidebar = () => {
  const location = useLocation();

  return (
    <aside className={styles.sidebar_container}>
      {location.pathname.startsWith('/admin') ? (
        <ul>
          <li className={styles.sidebar_header}>Settings</li>
          <li className={styles.sidebar_subheader}>관리자 모드</li>
          <li className={styles.sidebar_item}>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                isActive
                  ? `${styles.nav_link} ${styles.nav_link_active}`
                  : styles.nav_link
              }
            >
              사용자
            </NavLink>
          </li>
          <li className={styles.sidebar_item}>
            <NavLink
              to="/admin/travelandexpense"
              className={({ isActive }) =>
                isActive
                  ? `${styles.nav_link} ${styles.nav_link_active}`
                  : styles.nav_link
              }
            >
              여행 및 지출
            </NavLink>
          </li>
        </ul>
      ) : (
        <ul>
          <li className={styles.sidebar_header}>대시보드</li>
          <li className={styles.sidebar_subheader}>내 여행 한눈에 보기</li>
          <li className={styles.sidebar_item}>
            <NavLink
              to="/dashboard/myreport"
              className={({ isActive }) =>
                isActive
                  ? `${styles.nav_link} ${styles.nav_link_active}`
                  : styles.nav_link
              }
            >
              마이 리포트
            </NavLink>
          </li>
          <li className={styles.sidebar_item}>
            <NavLink
              to="/dashboard/mycalendar"
              className={({ isActive }) =>
                isActive
                  ? `${styles.nav_link} ${styles.nav_link_active}`
                  : styles.nav_link
              }
            >
              캘린더
            </NavLink>
          </li>
          <li className={styles.sidebar_item}>
            <NavLink
              to="/dashboard/myinfo"
              className={({ isActive }) =>
                isActive
                  ? `${styles.nav_link} ${styles.nav_link_active}`
                  : styles.nav_link
              }
            >
              내 정보
            </NavLink>
          </li>
        </ul>
      )}
    </aside>
  );
};

export default DefaultSidebar;
