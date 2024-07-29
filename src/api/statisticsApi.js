import axiosInstance from '../util/axiosInterceptor';

//마이리포트
export const getMyReportData = async () => {
  const response = await axiosInstance.get('/statistics/myreport');
  return response.data;
};

//지출 통계

//총 누적 지출
export const getTotalExpenditure = async (accountBookId) => {
  const response = await axiosInstance.get('/statistics/total', {
    params: { accountBookId },
  });
  return response.data;
};

//총 예산
export const getTotalBudget = async (accountBookId) => {
  const response = await axiosInstance.get('/statistics/total/budget', {
    params: { accountBookId },
  });
  return response.data;
};

//카테고리별 총 지출
export const getTotalExpenditureByCategory = async (accountBookId) => {
  const response = await axiosInstance.get('/statistics/total/category', {
    params: { accountBookId },
  });
  return response.data;
};

//일자별 통계(지출 항목)
export const getDailyCategoryExpense = async (accountBookId) => {
  const response = await axiosInstance.get('/statistics/daily/category', {
    params: { accountBookId },
  });
  return response.data;
};

//일자별 통계(결제 방법)
export const getDailyPaymentMethodExpense = async (accountBookId, date) => {
  const response = await axiosInstance.get('/statistics/daily/paymentmethod', {
    params: { accountBookId, date },
  });
  return response.data;
};

export const getDailyCategoryExpenseForLineChart = async (
  accountBookId,
  category
) => {
  const response = await axiosInstance.get('/statistics/daily/line-chart', {
    params: { accountBookId, category },
  });
  return response.data;
};
