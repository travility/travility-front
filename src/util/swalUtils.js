import Swal from 'sweetalert2';
import { removeToken } from './tokenUtils';

/*로그아웃*/

export const handleSuccessLogout = () => {
  removeToken();
  Swal.fire({
    title: '로그아웃 성공',
    icon: 'success',
    confirmButtonColor: '#2a52be',
  }).then(() => {
    window.location.href = '/login';
  });
};

export const handleTokenExpirationLogout = () => {
  removeToken();
  Swal.fire({
    title: '로그인 유효기간 만료',
    text: '자동 로그아웃 되었습니다.',
    icon: 'error',
    confirmButtonColor: '#2a52be',
  }).then(() => {
    window.location.href = '/login';
  });
};

export const handleAlreadyLoggedOut = () => {
  removeToken();
  Swal.fire({
    title: '로그아웃 상태',
    text: '현재 로그아웃된 상태입니다.',
    icon: 'error',
    confirmButtonColor: '#2a52be',
  }).then(() => {
    window.location.href = '/login';
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

/* 공통 성공 & 실패 */

export const handleSuccessSubject = (subject, action) => {
  Swal.fire({
    title: `${action} 성공`,
    text: `${subject} ${action} 성공했습니다`,
    icon: 'success',
    confirmButtonColor: '#2a52be',
  }).then(() => {
    window.location.reload();
  });
};

export const handleSuccessSubjectNotReload = (
  //새로고침 없음
  subject,
  action,
  navigate,
  path
) => {
  Swal.fire({
    title: `${action} 성공`,
    text: `${subject} ${action} 성공했습니다`,
    icon: 'success',
    confirmButtonColor: '#2a52be',
  }).then(() => {
    navigate(`${path}`);
  });
};

export const handleFailureSubject = (subject, action) => {
  Swal.fire({
    title: `${action} 실패`,
    text: `${subject} ${action} 실패했습니다`,
    icon: 'error',
    confirmButtonColor: '#2a52be',
  });
};

export const handleProblemSubject = (subject) => {
  Swal.fire({
    title: `${subject} 실패`,
    text: `${subject} 중 문제가 발생했습니다.`,
    icon: 'error',
    confirmButtonColor: '#4568DC',
  });
};

/*이미지 업로드*/

export const handleNoImage = () => {
  Swal.fire({
    title: '이미지 파일 아님',
    text: '이미지 파일만 업로드 가능합니다',
    icon: 'error',
    confirmButtonColor: '#2a52be',
  });
};
