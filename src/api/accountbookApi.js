import axios from 'axios';
import axiosInstance from '../util/axiosInterceptor';

// 국가, 국기 API
export const fetchCountryFlags = async () => {
  const response = await axios.get(
    `https://apis.data.go.kr/1262000/CountryFlagService2/getCountryFlagList2?serviceKey=${process.env.REACT_APP_COUNTRY_API_KEY}&numOfRows=220`
  );
  return response.data;
};

// 가계부 등록
export const addAccountBook = async (accountBookData) => {
  const updatedData = {
    ...accountBookData,
    country:
      accountBookData.country === '미합중국' ? '미국' : accountBookData.country,
  };
  const response = await axiosInstance.post('/accountbook', updatedData);
  return response.data;
};

//전체 가계부 조회
export const getAccountBooks = async (sort) => {
  const response = await axiosInstance.get(
    `/accountbook/accountbooks?sort=${sort}`
  );
  return response.data;
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

//가계부 엑셀화
export const exportAccountBook = async (id, krw) => {
  const response = await axiosInstance.get(
    `/accountbook/${id}/export?krw=${krw}`,
    {
      responseType: 'blob', // 응답을 Blob으로 처리
    }
  );
  return response.data;
};
