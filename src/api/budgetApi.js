import axios from 'axios';
import axiosInstance from '../util/axiosInterceptor';
import { EXCHANGERATE_API_KEY } from '../config/apiConfig';

/* 예산 등록 */
export const addBudgets = async (accountBookId, budgets) => {
  const response = await axiosInstance.put(
    `/accountbook/${accountBookId}/budget`,
    budgets
  );
  return response.data;
};

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
