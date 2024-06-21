import axiosInstance from './memberApi';

// 통계 데이터 가져오기
export const getExpenseStatistics = async () => {
  const response = await axiosInstance.get('/accountbook/detail');
  return response.data;
};
