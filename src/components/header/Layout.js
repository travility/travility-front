import React from 'react';
import Header from './Header';
import NavigationBar from '../../components/header/NavigationBar';
import { Inner, Container } from '../../styles/StyledComponents';
import { Outlet } from 'react-router-dom';
import ScrollToTopButton from '../ScrollToTopButton';

const Layout = () => {
  return (
    <div>
      <Inner>
        <div className="header-wrapper">
          <Header />
        </div>
        <NavigationBar />
        <Container>
          <Outlet />
          <ScrollToTopButton />
        </Container>
      </Inner>
    </div>
  );
};

export default Layout;
