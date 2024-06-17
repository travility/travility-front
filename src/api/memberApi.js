import axios from 'axios';

const API_SERVER_HOST = 'http://localhost:8080/api';

//아이디 중복 확인
export const checkUsername = async (username) => {
  const response = await axios.get(`${API_SERVER_HOST}/duplicate-username`, {
    params: {
      username: username,
    },
  });
  return response.data;
};

//회원가입
export const signup = async (member) => {
  const response = await axios.post(`${API_SERVER_HOST}/signup`, member);
  return response.data;
};
