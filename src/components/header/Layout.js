import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import NavigationBar from '../../components/header/NavigationBar';
import { Inner, Container } from '../../styles/StyledComponents';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();
  return (
    <div>
      <Inner>
        <Header />
        {!location.pathname.startsWith('/settlement') && <NavigationBar />}
        <Container>
          <Outlet />
        </Container>
      </Inner>
    </div>
  );
};

export default Layout;
