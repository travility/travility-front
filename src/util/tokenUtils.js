import { checkToken } from '../api/memberApi';

//토큰 저장
export const saveToken = (token) => {
  return localStorage.setItem('Authorization', token);
};

//토큰 존재 여부
export const isTokenPresent = () => {
  return !!localStorage.getItem('Authorization');
};

//토큰 삭제
export const removeToken = () => {
  localStorage.removeItem('Authorization');
};

//토큰 유효성 검사
export const validateToken = () => {
  if (isTokenPresent()) {
    return checkToken()
      .then(() => {
        return 'Token valid';
      })
      .catch((error) => {
        console.log(error);
        return 'Token expired';
      });
  } else {
    return Promise.resolve('Token null');
  }
};
