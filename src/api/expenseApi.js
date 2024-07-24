import axiosInstance from '../util/axiosInterceptor';

// 유저 정보 가져오기
export const getUserInfo = async () => {
  const response = await axiosInstance.get("/accountbook/userinfo");
  return response.data;
};

// 마이리포트
export const getExpenseStatistics = async () => {
  const response = await axiosInstance.get('/accountbook/detail');
  return response.data;
};

//지출 등록
export const addExpense = async (expenseData) => {
  try {
    const response = await axiosInstance.post(
      '/accountbook/expense',
      expenseData
    );
    return response.data;
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
};

// 지출통계
export const getExpenseStatisticsByDate = async (accountBookId) => {
  const response = await axiosInstance.get("/accountbook/statistics/category", { 
    params: { accountBookId }
  });
  return response.data;
};

// 결제 방법별 지출통계
export const getPaymentMethodStatisticsByDate = async (accountBookId, date) => {
  const response = await axiosInstance.get(`/accountbook/statistics/paymentMethod`, {
    params: { accountBookId, date }
  });
  return response.data;
};

//추가
export const getUniqueExpenseDates = async (accountBookId) => {
  const response = await axiosInstance.get(`/statistics/unique-dates`, {
      params: { accountBookId },
  });
  return response.data; 
};

// 한 일정에 대한 카테고리별 총 지출
export const getTotalCategoryStatistics = async (accountBookId) => {
  const response = await axiosInstance.get("/accountbook/statistics/totalcategory", { 
    params: { accountBookId }
  });
  return response.data;
};

//==예산 - 지출==//
// 일정에 대한 총 예산 가져오기
export const getTotalBudgetByAccountBookId = async (accountBookId) => {
  const response = await axiosInstance.get('/accountbook/statistics/totalbudget', {
    params: { accountBookId }
  });
  return response.data;
};

// 일정에 대한 총 지출 가져오기
export const getTotalExpenseByAccountBookId = async (accountBookId) => {
  const response = await axiosInstance.get('/accountbook/statistics/totalexpense', {
    params: { accountBookId }
  });
  return response.data;
};

// 일정에 대한 남은 예산 가져오기
export const getRemainingBudget = async (accountBookId) => {
  const response = await axiosInstance.get('/accountbook/statistics/remaining-budget', {
    params: { accountBookId }
  });
  return response.data;
};
//==예산 - 지출==//

//==라인차트 불러오기==//
// 특정 카테고리 + 날짜별 지출통계
export const getStatisticsByCategoryAndDates = async (accountBookId, category) => {
  const response = await axiosInstance.get('/accountbook/statistics/category-by-dates', {
    params: {
      accountBookId,
      category
    }
  });
  return response.data;
};

//지출 수정
export const updateExpense = async (id, newExpenseData) => {
  const response = await axiosInstance.put(
    `/accountbook/expense/${id}`,
    newExpenseData
  );
  return response;
};

//지출 삭제
export const deleteExpense = async (id) => {
  const response = await axiosInstance.delete(`/accountbook/expense/${id}`);
  return response;
};