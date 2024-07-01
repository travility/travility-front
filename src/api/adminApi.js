import axios from 'axios';
import axiosInstance from '../util/axiosInterceptor';

const API_SERVER_HOST = 'http://localhost:8080/api';

export const getMemberList = async (page, size, sort) => {
  const response = await axiosInstance.get(
    `/admin/users?page=${page}&size=${size}&sort=${sort}`
  );
  return response.data;
};

export const getTotalMembersCount = async () => {
  const response = await axiosInstance.get('/admin/users/total-count');
  return response.data;
};

export const getNewMembersCountToday = async () => {
  const response = await axiosInstance.get('/admin/users/new-today');
  return response.data;
};

export const deleteMemberByAdmin = async (username) => {
  const response = await axiosInstance.delete('/admin/users', {
    data: username,
  });
  return response;
};
