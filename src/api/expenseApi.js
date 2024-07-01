import axiosInstance from "../util/axiosInterceptor";

export const getExpenseStatistics = async () => {
  const response = await axiosInstance.get("/accountbook/detail");
  return response.data;
};

export const getUserInfo = async () => {
  const response = await axiosInstance.get("/accountbook/userinfo");
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
