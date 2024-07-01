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
