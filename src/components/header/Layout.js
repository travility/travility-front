import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import NavigationBar from "../../components/header/NavigationBar";
import { Inner, Container } from "../../styles/StyledComponents";
import ThemeToggleButton from "../ThemeToggleButton";
import { useTheme } from "../../styles/Theme";

const Layout = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <div>
      <Inner>
        <div className="header-wrapper">
          <Header />
        </div>
        {!location.pathname.startsWith("/settlement") && <NavigationBar />}
        <Container>
          <Outlet />
        </Container>
      </Inner>
    </div>
  );
};

export default Layout;
