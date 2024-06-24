import axios from 'axios';
import axiosInstance from '../util/axiosInterceptor';

const API_SERVER_HOST = 'http://localhost:8080/api';

export const getMemberList = async () => {
  const response = await axiosInstance.get('/admin/users');
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
