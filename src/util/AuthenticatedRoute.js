import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  handleAlreadyLoggedOut,
  handleTokenExpirationLogout,
} from './logoutUtils';
import { logout } from '../api/memberApi';
import { TokenStateContext } from '../App';

const AuthenticatedRoute = ({ children }) => {
  const { tokenStatus } = useContext(TokenStateContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (tokenStatus === 'Token expired') {
      logout()
        .then(() => {
          handleTokenExpirationLogout(navigate);
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (tokenStatus === 'Token null') {
      handleAlreadyLoggedOut(navigate);
    }
  }, [tokenStatus, navigate, location.pathname]);

  return tokenStatus === 'Token valid' ? children : null;
};

export default AuthenticatedRoute;
