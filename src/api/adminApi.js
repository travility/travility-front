import axiosInstance from '../util/axiosInterceptor';

//회원 리스트
export const getMemberList = async (page, size, sort) => {
  const response = await axiosInstance.get(
    `/admin/users?page=${page}&size=${size}&sort=${sort}`
  );
  return response.data;
};

//총 회원수
export const getTotalMembersCount = async () => {
  const response = await axiosInstance.get('/admin/users/total-count');
  return response.data;
};

//오늘 신규 가입자 수
export const getNewMembersCountToday = async () => {
  const response = await axiosInstance.get('/admin/users/new-today');
  return response.data;
};

//관리자 모드 회원 계정 삭제
export const deleteMemberByAdmin = async (username) => {
  const response = await axiosInstance.delete('/admin/users', {
    data: username,
  });
  return response;
};
