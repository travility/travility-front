import axiosInstance from './axiosInterceptor';

export const getExpenseStatistics = async () => {
  const response = await axiosInstance.get('/accountbook/detail');
  return response.data;
};

export const getUserInfo = async () => {
  const response = await axiosInstance.get('/accountbook/userinfo');
  return response.data;
};