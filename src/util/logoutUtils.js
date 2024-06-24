import Swal from 'sweetalert2';
import { removeToken } from './tokenUtils';

export const handleSuccessLogout = (navigate) => {
  removeToken();
  Swal.fire({
    title: '로그아웃 성공',
    icon: 'success',
    confirmButtonColor: '#2a52be',
  }).then(() => {
    navigate('/login');
  });
};

export const handleTokenExpirationLogout = (navigate) => {
  removeToken();
  Swal.fire({
    title: '로그인 유효기간 만료',
    text: '자동 로그아웃 되었습니다.',
    icon: 'error',
    confirmButtonColor: '#2a52be',
  }).then(() => {
    navigate('/login');
  });
};

export const handleAlreadyLoggedOut = (navigate) => {
  Swal.fire({
    title: '로그아웃 상태',
    text: '현재 로그아웃된 상태입니다.',
    icon: 'error',
    confirmButtonColor: '#2a52be',
  }).then(() => {
    navigate('/login');
  });
};

export const handleAccessDenied = (navigate) => {
  Swal.fire({
    title: '접근 거부',
    text: '접근 권한이 없습니다.',
    icon: 'error',
    confirmButtonColor: '#2a52be',
  }).then(() => {
    navigate('/');
  });
};
