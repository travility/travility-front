import { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleAlreadyLoggedOut } from './logoutUtils';
import { TokenStateContext } from '../App';

const AuthenticatedRoute = ({ children }) => {
  const { tokenStatus } = useContext(TokenStateContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (tokenStatus === 'Token null') {
      handleAlreadyLoggedOut(navigate);
    }
  }, [tokenStatus, navigate, location.pathname]);

  return tokenStatus === 'Token valid' ? children : null;
};

export default AuthenticatedRoute;
