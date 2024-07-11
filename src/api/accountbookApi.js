import axios from 'axios';
import axiosInstance from '../util/axiosInterceptor';

// 국가, 국기 API
export const fetchCountryFlags = async () => {
  const response = await axios.get(
    'https://apis.data.go.kr/1262000/CountryFlagService2/getCountryFlagList2?serviceKey=z%2FJgcFj7mwylmN3DSWOtCJ3XE86974ujj%2F53Mfb1YbaHtY84TApx4CYY4ipu%2FLUt%2F7i7Us3aJ5FXWDFvGX3sJQ%3D%3D&numOfRows=220'
  );
  return response.data;
};

//가계부 등록
export const addAccountBook = async (accountBookData) => {
  const response = await axiosInstance.post('/accountbook', accountBookData);
  return response.data;
};

//가계부 전체 조회
export const getAccountBooks = async () => {
  try {
    const response = await axiosInstance.get('/accountbook/accountbooks');
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching account books:', error);
    throw error;
  }
};

//가계부 조회
export const getAccountBookById = async (id) => {
  try {
    const response = await axiosInstance.get(`/accountbook/${id}`);
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching account book with id ${id}:`, error);
    throw error;
  }
};

//가계부 수정
export const updateAccountBook = async (id, newAccountBookData) => {
  const response = await axiosInstance.put(
    `/accountbook/${id}`,
    newAccountBookData
  );
  return response;
};

//가계부 삭제
export const deleteAccountBook = async (id) => {
  try {
    const response = await axiosInstance.delete(`/accountbook/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting account book with id ${id}:`, error);
    throw error;
  }
};

// 예산 평균 환율 계산
export const calculateAverageExchangeRate = (budgets, currency) => {
  const relevantBudgets = budgets.filter((b) => b.curUnit === currency);
  const totalAmount = relevantBudgets.reduce(
    (sum, budget) => sum + budget.amount,
    0
  );
  const weightedSum = relevantBudgets.reduce(
    (sum, budget) => sum + budget.exchangeRate * budget.amount,
    0
  );
  return weightedSum / totalAmount;
};

// 원화 총지출액 계산
export const calculateTotalAmountInKRW = (accountBook) => {
  if (
    !accountBook ||
    !accountBook.expenses ||
    !accountBook.budgets ||
    !accountBook.expenses.length ||
    !accountBook.budgets.length
  ) {
    return 'KRW 0';
  }

  const averageExchangeRates = {};
  accountBook.budgets.forEach((budget) => {
    if (!averageExchangeRates[budget.curUnit]) {
      averageExchangeRates[budget.curUnit] = calculateAverageExchangeRate(
        accountBook.budgets,
        budget.curUnit
      );
    }
  });

  const totalAmount = accountBook.expenses.reduce((total, expense) => {
    const exchangeRate = averageExchangeRates[expense.currency] || 1;
    return total + expense.amount * exchangeRate;
  }, 0);

  return `KRW ${totalAmount.toLocaleString()}`;
};

// 날짜 포맷
export const formatDate = (dateString) => {
  return dateString.split('T')[0];
};
