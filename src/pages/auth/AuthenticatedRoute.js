import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AuthenticatedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('Authorization'); //로컬 스토리지에 token 있는 지 확인 후, boolean으로 리턴
  const location = useLocation();

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} />
  ); //현재 페이지 정보를 state객체의 from 속성에 저장
};

export default AuthenticatedRoute;
