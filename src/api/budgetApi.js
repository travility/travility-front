import axios from 'axios';
import axiosInstance from '../util/axiosInterceptor';

/* 예산 등록 */
export const addBudgets = async (accountBookId, budgets) => {
  const response = await axiosInstance.put(
    `/accountbook/${accountBookId}/budget`,
    budgets
  );
  return response.data;
};

/* 통화코드,환율 api */
const EXCHANGERATE_API_KEY = process.env.REACT_APP_EXCHANGERATE_API_KEY;

export const fetchCurrencyCodes = async () => {
  try {
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${EXCHANGERATE_API_KEY}/codes`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching currency codes:', error);
    throw error;
  }
};

export const fetchExchangeRate = async (currency) => {
  try {
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${EXCHANGERATE_API_KEY}/latest/${currency}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    throw error;
  }
};
