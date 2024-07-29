import axios from 'axios';

//정산용 가계부 조회
export const getAccountBook = async (id) => {
  const response = await axios.get(`/api/settlement/${id}/accountbook`);
  return response.data;
};

//공동 경비 합계
export const getTotalSharedExpensesAndExchangeRates = async (id) => {
  const reponse = await axios.get(`/api/settlement/${id}/totals`);
  return reponse.data;
};
