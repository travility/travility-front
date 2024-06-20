import axios from 'axios';

const API_SERVER_HOST = 'http://localhost:8080/api';

//아이디 중복 확인
export const checkUsername = async (username) => {
  const response = await axios.get(
    `${API_SERVER_HOST}/auth/duplicate-username`,
    {
      params: {
        username: username,
      },
    }
  );
  return response.data;
};

//회원가입
export const signup = async (member) => {
  const response = await axios.post(`${API_SERVER_HOST}/signup`, member);
  return response.data;
};

//로그인
export const login = async (data) => {
  const response = await axios.post(`${API_SERVER_HOST}/login`, data);
  return response;
};

// OAuth2 쿠키로부터 응답 헤더 토큰 생성
export const getTokenfromCookie = async () => {
  const response = await axios.get(`${API_SERVER_HOST}/auth/social-jwt`, {
    withCredentials: true,
  }); // 인증정보를 포함하여 요청
  return response;
};

//로그아웃
export const logout = async (token) => {
  const response = await axios.post(
    `${API_SERVER_HOST}/logout`,
    {}, //post 요청 시, 두 번째 인자는 바디
    { headers: { Authorization: token }, withCredentials: true }
  );
  return response;
};
