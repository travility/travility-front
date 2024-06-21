import axios from 'axios';
import Cookies from 'js-cookie';

const API_SERVER_HOST = 'http://localhost:8080/api';

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_SERVER_HOST,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 설정: 쿠키에서 JWT 토큰을 가져와 헤더에 추가
axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get('token'); // 쿠키에서 JWT 토큰을 가져옴
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; // Authorization 헤더에 토큰 포함
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 아이디 중복 확인
export const checkUsername = async (username) => {
  const response = await axiosInstance.get('/duplicate-username', {
    params: { username },
  });
  return response.data;
};

// 회원가입
export const signup = async (member) => {
  const response = await axiosInstance.post('/signup', member);
  return response.data;
};

// 로그인
export const login = async (data) => {
  const response = await axios.post(`${API_SERVER_HOST}/login`, data);
  const token = response.data.token; // 서버에서 JWT 토큰을 받아옴
  if (token) {
    Cookies.set('token', token, { expires: 1 }); // JWT 토큰을 쿠키에 저장 (1일)
  }
  return response;
};

export default axiosInstance;
