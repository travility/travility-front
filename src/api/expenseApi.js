import axiosInstance from "../util/axiosInterceptor";

// 유저 정보 가져오기
export const getUserInfo = async () => {
  const response = await axiosInstance.get("/accountbook/userinfo");
  return response.data;
};

// 마이리포트
export const getExpenseStatistics = async () => {
  const response = await axiosInstance.get("/accountbook/detail");
  return response.data;
};

export const addExpense = async (expenseData) => {
  try {
    const response = await axiosInstance.post(
      "/accountbook/expense",
      expenseData
    );
    return response.data;
  } catch (error) {
    console.error("Error adding expense:", error);
    throw error;
  }
};

// 지출통계
export const getExpenseStatisticsByDate = async (accountBookId) => {
  const response = await axiosInstance.get("/accountbook/statistics/category", { 
    params: { accountBookId }
  });
  return response.data;
};
