// 숫자 천단위 ',' 삽입
export const formatNumberWithCommas = (number) => {
  if (number == null || isNaN(number)) {
    return "0";
  }

  // 정수 부분과 소수 부분 분리
  const [integerPart, decimalPart] = number.toString().split(".");

  // 정수 부분 포맷팅
  const formattedIntegerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );

  return decimalPart
    ? `${formattedIntegerPart}.${decimalPart}`
    : formattedIntegerPart;
};

// 특정 통화 평균 환율 계산
export const calculateAverageExchangeRate = (budgets, currency) => {
  const relevantBudgets = budgets.filter((b) => b.curUnit === currency);
  const totalAmount = relevantBudgets.reduce(
    (sum, budget) => sum + budget.amount,
    0
  );
  const weightedSum = relevantBudgets.reduce(
    (sum, budget) => sum + budget.exchangeRate * budget.amount,
    0
  );

  return weightedSum / totalAmount;
};

// 각 통화 단위의 평균 환율 계산 및 저장
export const calculateAverageExchangeRates = (budgets) => {
  const averageExchangeRates = {};
  budgets.forEach((budget) => {
    if (!averageExchangeRates[budget.curUnit]) {
      averageExchangeRates[budget.curUnit] = calculateAverageExchangeRate(
        budgets,
        budget.curUnit
      );
    }
  });
  return averageExchangeRates;
};

// 원화 환산 총 지출 계산
export const calculateTotalExpenseInKRW = (expenses, budgets) => {
  // 지출 또는 예산이 없을 경우
  if (!expenses || !budgets || !expenses.length || !budgets.length) {
    return 0;
  }

  const averageExchangeRates = calculateAverageExchangeRates(budgets);

  const totalExpenseInKRW = expenses.reduce((total, expense) => {
    const exchangeRate = averageExchangeRates[expense.curUnit] || 1;
    return total + expense.amount * exchangeRate;
  }, 0);

  return totalExpenseInKRW.toFixed(0);
};

// 원화 환산 총 예산 계산
export const calculateTotalBudgetInKRW = (budgets) => {
  const averageExchangeRates = calculateAverageExchangeRates(budgets);

  const totalBudgetInKRW = budgets.reduce((total, budget) => {
    const exchangeRate = averageExchangeRates[budget.curUnit] || 1;
    return total + budget.amount * exchangeRate;
  }, 0);

  return totalBudgetInKRW.toFixed(0);
};

// 특정 통화 예산 합계 계산
export const calculateTotalBudget = (budgets, currency) => {
  return budgets
    .filter((budget) => budget.curUnit === currency)
    .reduce((sum, budget) => sum + budget.amount, 0);
};

// 특정 통화 지출 합계 계산
export const calculateTotalExpenses = (expenses, currency) => {
  return expenses
    .filter((expense) => expense.curUnit === currency)
    .reduce((sum, expense) => sum + expense.amount, 0);
};

// 날짜 포맷
export const formatDate = (dateString) => {
  return dateString.split("T")[0];
};

export const commaFormatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}.${month}.${day}`;
};
