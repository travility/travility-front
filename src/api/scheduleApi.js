import axiosInstance from '../util/axiosInterceptor';

export const fetchEvents = async () => {
  try {
    const response = await axiosInstance.get('/accountBook/schedule');
    console.log('Fetched events:', response.data);
    return response.data;
  } catch (error) {
    console.error('가계부 정보를 가져오는 중에 오류가 발생했습니다:', error);
    throw error;
  }
};

export const fetchDailyExpenses = async (accountbookId) => {
    try {
      const response = await axiosInstance.get(`/accountBook/schedule/${accountbookId}`);
      console.log(`Fetched daily expenses for accountbookId ${accountbookId}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`날짜별 지출 정보를 가져오는 중에 오류가 발생했습니다:`, error);
      throw error;
    }
  };
