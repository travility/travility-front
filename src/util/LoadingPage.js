import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAccessTokenFromRefreshToken } from '../api/memberApi';
import { saveToken } from './tokenUtils';
import { handleProblemSubject } from './swalUtils';

const LoadingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setAccessTokenFromRefreshToken()
      .then((response) => {
        const token = response.headers.get('Authorization');
        saveToken(token);
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
        handleProblemSubject('소셜 로그인');
      });
  });

  return <div>Loading...소셜 로그인 중입니다.</div>;
};

export default LoadingPage;
