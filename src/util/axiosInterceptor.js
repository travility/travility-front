import axios from 'axios';

const API_SERVER_HOST = 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL: API_SERVER_HOST,
  timeout: 10000,
  withCredentials: true,
});

//요청 전 실행
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('Authorization');
    config.headers.Authorization = token;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//응답 전 실행
axiosInstance.interceptors.response.use(
  (response) => {
    //2xx 범위에 있는 상태 코드 or 응답 데이터가 있는 작업 수행
    return response;
  },
  (error) => {
    //2xx 외의 범위에 있는 상태 코드 or 응답 오류가 있는 작업 수행
    console.log(error);
    if (
      //토큰이 만료되었을 경우
      error.response.status === 401 &&
      error.response.data.message === 'Token expired'
    ) {
      return Promise.reject('Token expired');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
