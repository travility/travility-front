import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/components/NavigationBar.module.css";

const NavigationBar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const menus = [
    { name: "가계부 홈", path: "/main" },
    { name: "전체가계부", path: "/accountbook/list/:id" },
    { name: "캘린더", path: "/dashboard/mycalendar" },
    { name: "마이리포트", path: "/dashboard/myreport" },
    { name: "마이페이지", path: "/dashboard/myinfo" },
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const activeMenu = menus.find((menu) =>
      currentPath.includes(menu.path.split("/:")[0])
    );
    if (activeMenu) {
      setActiveMenu(activeMenu.path);
    }
  }, [location, menus]);

  if (
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/signup"
  ) {
    return null;
  }

  const handleMenuClick = (path) => {
    setActiveMenu(path);
    navigate(path);
  };

  return (
    <nav className={styles.navbar}>
      {menus.map((menu, index) => (
        <div
          key={index}
          className={`${styles.menuItem} ${
            activeMenu === menu.path ? styles.active : ""
          } ${hoveredMenu === menu.path ? styles.hovered : ""}`}
          onClick={() => handleMenuClick(menu.path)}
          onMouseEnter={() => setHoveredMenu(menu.path)}
          onMouseLeave={() => setHoveredMenu(null)}
        >
          {menu.name}
        </div>
      ))}
      <span className={styles.animationEffect}></span>
    </nav>
  );
};

export default NavigationBar;
