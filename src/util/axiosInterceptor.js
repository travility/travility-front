import axios from 'axios';
import { getNewAccessToken } from '../api/memberApi';
import { saveToken } from './tokenUtils';
import {
  handleAlreadyLoggedOut,
  handleTokenExpirationLogout,
} from './swalUtils';

let isRefreshing = false;
let refreshQueue = []; //액세스 토큰 재발급 중 대기 중인 요청 담는 배열

const axiosInstance = axios.create({
  baseURL: "/api",
  timeout: 10000,
  withCredentials: true,
});

// 요청 전 실행
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('Authorization');
    config.headers.Authorization = token;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 전 실행
axiosInstance.interceptors.response.use(
  (response) => {
    // 2xx 범위에 있는 상태 코드 or 응답 데이터가 있는 작업 수행
    return response;
  },
  async (error) => {
    // 2xx 외의 범위에 있는 상태 코드 or 응답 오류가 있는 작업 수행
    const originalRequest = error.config; // 원래 요청 정보

    if (error.response.data === 'access token expired') {
      if (!isRefreshing) {
        //재발급 중
        isRefreshing = true;
        try {
          const response = await getNewAccessToken(); // 액세스 토큰 재발급
          const accessToken = response.headers.get('Authorization');

          saveToken(accessToken); // 로컬스토리지에 저장
          isRefreshing = false;

          // 모든 대기 중인 요청에 새 액세스 토큰 제공하여 재시도
          refreshQueue.forEach((callback) => callback(accessToken));
          refreshQueue = []; //모두 실행 후 배열 비우기

          return axiosInstance(originalRequest); // 최종적으로 원래 요청 재시도
        } catch (error) {
          console.log(error);
          isRefreshing = false;
          if (error.response.data === 'refresh token expired') {
            //리프레시 토큰 만료
            handleTokenExpirationLogout();
          } else if (
            error.response.data === 'refresh token null' ||
            error.response.data === 'invalid refresh token'
          ) {
            handleAlreadyLoggedOut();
          }
          return Promise.reject(error);
        }
      } else {
        // 재발급 중인 경우 대기열에 추가
        return new Promise((resolve, reject) => {
          refreshQueue.push((accessToken) => {
            originalRequest.headers.Authorization = accessToken;
            resolve(axiosInstance(originalRequest));
          });
        });
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
