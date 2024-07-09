import axios from 'axios';

const API_SERVER_HOST = 'http://localhost:8080/api';

//정산용 가계부 조회
export const getAccountBook = async (id) => {
  const response = await axios.get(
    `${API_SERVER_HOST}/settlement/${id}/accountbook`
  );
  return response.data;
};

//공동 경비 합계
export const getTotalSharedExpensesAndExchangeRates = async (id) => {
  const reponse = await axios.get(`${API_SERVER_HOST}/settlement/${id}/totals`);
  return reponse.data;
};

//1인당 정산 금액
export const getPerPersonAmount = async (id) => {
  const response = await axios.get(
    `${API_SERVER_HOST}/settlement/${id}/per-person`
  );
  return response.data;
};
