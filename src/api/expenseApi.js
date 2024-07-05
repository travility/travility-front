import axiosInstance from '../util/axiosInterceptor';

export const getExpenseStatistics = async () => {
  const response = await axiosInstance.get('/accountbook/detail');
  return response.data;
};

export const getUserInfo = async () => {
  const response = await axiosInstance.get('/accountbook/userinfo');
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
