import axios from 'axios';
import axiosInstance from '../util/axiosInterceptor';
import { API_URL } from '../config/apiConfig';

//아이디 중복 확인
export const checkUsername = async (username) => {
  const response = await axios.get(`${API_URL}/auth/duplicate-username`, {
    params: {
      username: username,
    },
  });
  return response.data;
};

//회원가입
export const signup = async (member) => {
  const response = await axios.post(`${API_URL}/signup`, member);
  return response;
};

//로그인
export const login = async (data) => {
  const response = await axios.post(`${API_URL}/login`, data, {
    withCredentials: true,
  });
  return response;
};

// OAuth2 쿠키로부터 응답 헤더 토큰 생성
export const setAccessTokenFromRefreshToken = async () => {
  const response = await axios.get(`${API_URL}/auth/social-jwt`, {
    withCredentials: true,
  }); // 인증정보를 포함하여 요청
  return response;
};

//액세스 토큰 재발급
export const getNewAccessToken = async () => {
  const response = await axios.post(
    `${API_URL}/auth/reissue`,
    {},
    { withCredentials: true }
  );
  return response;
};

//로그아웃
export const logout = async () => {
  const response = await axiosInstance.post('/logout');
  return response;
};

//JWT 존재 여부
export const checkToken = async () => {
  const response = await axiosInstance.get('/auth/check-token');
  return response.data;
};

//사용자 정보 추출
export const getMemberInfo = async () => {
  const response = await axiosInstance.get('/users');
  return response.data;
};

//비밀번호 찾기
export const forgotPassword = async (data) => {
  const response = await axios.post(`${API_URL}/users/forgot-password`, data);
  return response;
};

//비밀번호 확인
export const confirmPassword = async (password) => {
  const response = await axiosInstance.post('/users/confirm-password', {
    password,
  });
  return response.data;
};

//비밀번호 변경
export const updatePassword = async (password) => {
  const response = await axiosInstance.post('/users/update-password', {
    password,
  });
  return response;
};

//회원 탈퇴
export const deleteMember = async () => {
  const response = await axiosInstance.delete('/users');
  return response;
};
