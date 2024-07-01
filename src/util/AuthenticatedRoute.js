import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleAlreadyLoggedOut } from './logoutUtils';
import { validateToken } from './tokenUtils';

const AuthenticatedRoute = ({ children }) => {
  const [tokenStatus, setTokenStatus] = useState();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const status = await validateToken();
      setTokenStatus(status);
      if (status === 'Token null') {
        handleAlreadyLoggedOut(navigate);
      }
    };
    checkToken();
  }, [tokenStatus, navigate, location.pathname]);

  return tokenStatus === 'Token valid' ? children : null;
};

export default AuthenticatedRoute;
