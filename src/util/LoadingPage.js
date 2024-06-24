import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTokenfromCookie } from '../api/memberApi';

const LoadingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    getTokenfromCookie()
      .then((response) => {
        const token = response.headers.get('Authorization');
        console.log(token);
        localStorage.setItem('Authorization', token);
        navigate('/'); //원래는 가계부 등록 페이지로 가야함
      })
      .catch((error) => {
        console.log(error);
      });
  });

  return <div>Loading...소셜 로그인 중입니다.</div>;
};

export default LoadingPage;
