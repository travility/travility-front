import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../styles/components/header/NavigationBar.module.css';
import { TokenStateContext } from '../../App';

const NavigationBar = () => {
  const { memberInfo } = useContext(TokenStateContext);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();


  const usersMenus = [
    { name: '가계부 홈', path: '/main' },
    { name: '전체가계부', path: '/accountbook/list' },
    { name: '캘린더', path: '/dashboard/mycalendar' },
    { name: '마이리포트', path: '/dashboard/myreport' },
    { name: '마이페이지', path: '/dashboard/myinfo' },
  ];

  const adminMenus = [{ name: '사용자 관리', path: '/admin/users' }];

  const menus =
    memberInfo && memberInfo.role === 'ROLE_USER' ? usersMenus : adminMenus;

  useEffect(() => {
    const currentPath = location.pathname;
    const activeMenu = menus.find((menu) =>
      currentPath.includes(menu.path.split('/:')[0])
    );
    if (activeMenu) {
      setActiveMenu(activeMenu.path);
    }
  }, [location, menus]);

  if (
    location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/forgot-password' ||
    location.pathname.startsWith('/settlement')
  ) {
    return null;
  }

  const handleMenuClick = (path) => {
    if (window.innerWidth <= 530) {
      setIsDropdownVisible(!isDropdownVisible);
    } else {
      setActiveMenu(path);
      navigate(path);
    }
  };

  const handleDropdownItemClick = (path) => {
    setActiveMenu(path);
    setIsDropdownVisible(false);
    navigate(path);
  };

  return (
    <nav className={styles.navbar}>
      {menus.map((menu, index) => (
        <div
          key={index}
          className={`${styles.menuItem} ${
            activeMenu === menu.path ? styles.active : ''
          } ${isDropdownVisible && window.innerWidth <= 530 ? styles.hidden : ''}`}
          onClick={() => handleMenuClick(menu.path)}
        >
          {menu.name}
          {activeMenu === menu.path && (
            <span className={styles.dropdownIcon}>
              {isDropdownVisible ? '▲' : '▼'}
            </span>
          )}
        </div>
      ))}
      {isDropdownVisible && (
        <div className={styles.dropdown}>
          {menus.filter(menu => menu.path !== activeMenu).map((menu, index) => (
            <div
              key={index}
              className={styles.dropdownItem}
              onClick={() => handleDropdownItemClick(menu.path)}
            >
              {menu.name}
            </div>
          ))}
        </div>
      )}
      <span className={styles.animationEffect}></span>
    </nav>
  );
};

export default NavigationBar;