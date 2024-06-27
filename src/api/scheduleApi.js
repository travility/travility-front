import axiosInstance from '../util/axiosInterceptor';

// 캘린더에 날짜뿌리기
export const getAccountBooks = async () => {
  try {
    const response = await axiosInstance.get('/accountBook/schedule');
    return response.data;
  } catch (error) {
    console.error("fetch 오류임", error);
    throw error;
  }
};
