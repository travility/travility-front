import axios from "axios";
import axiosInstance from "../util/axiosInterceptor";

export const addBudgets = async (accountBookId, budgets) => {
  const response = await axiosInstance.post(
    `/accountbook/${accountBookId}/budget`,
    budgets
  );
  return response.data;
};

const apiKey = process.env.REACT_APP_EXCHANGERATE_API_KEY;

export const fetchCurrencyCodes = async () => {
  try {
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${apiKey}/codes`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching currency codes:", error);
    throw error;
  }
};

export const fetchExchangeRate = async (currency) => {
  try {
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${currency}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    throw error;
  }
};
