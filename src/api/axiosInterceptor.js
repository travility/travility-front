import axios from 'axios';

const API_SERVER_HOST = 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL: API_SERVER_HOST,
  timeout: 10000,
});

//요청 전 실행
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('Authorization');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default axiosInstance;