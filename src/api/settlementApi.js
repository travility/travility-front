import axios from "axios";
import { API_URL } from "../config/apiConfig.js";

//정산용 가계부 조회
export const getAccountBook = async (id) => {
  const response = await axios.get(`${API_URL}/settlement/${id}/accountbook`);
  return response.data;
};

//공동 경비 합계
export const getTotalSharedExpensesAndExchangeRates = async (id) => {
  const reponse = await axios.get(`${API_URL}/settlement/${id}/totals`);
  return reponse.data;
};
