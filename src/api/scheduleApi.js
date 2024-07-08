import axiosInstance from '../util/axiosInterceptor';


export const fetchEvents = async () => {
  try {
    const response = await axiosInstance.get('/accountBook/schedule');
    console.log('가계부 일정:', response.data);
    return response.data;
  } catch (error) {
    console.error('가계부 정보를 가져오는 중에 오류가 발생했습니다:', error);
    throw error;
  }
};

export const fetchDailyExpenses = async (accountbookId) => {
  try {
    const response = await axiosInstance.get(`/accountBook/schedule/${accountbookId}`);
    console.log(`accountbookid가 갖고 있는 expense ${accountbookId}:`, response.data);

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && typeof response.data === 'object') {
      return Object.entries(response.data).map(([date, amount]) => ({
        expenseDate: date,
        amount: amount
      }));
    } else {
      console.error('Unexpected response data format:', response.data);
      return [];
    }
  } catch (error) {
    console.error(`날짜별 지출 정보를 가져오는 중에 오류가 발생했습니다:`, error);
    throw error;
  }
};

