import axiosInstance from '../util/axiosInterceptor';

export const getMyReportData = async () => {
  const response = await axiosInstance.get('/accountbook/myreport');
  return response.data;
};

export const getExpenditureByCategory = async (accountBookId) => {
  const response = await axiosInstance.get('/accountbook/expenses/category', {
    params: { accountBookId },
  });
  return response.data;
};

export const getTotalExpenditure = async (accountBookId) => {
  const response = await axiosInstance.get('/accountbook/expenses/total', {
    params: { accountBookId },
  });
  return response.data;
};

export const getTotalBudget = async (accountBookId) => {
  const response = await axiosInstance.get('/accountbook/expenses/budget', {
    params: { accountBookId },
  });
  return response.data;
};
