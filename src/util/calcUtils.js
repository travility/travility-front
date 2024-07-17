// 숫자 천단위 ',' 삽입
export const formatNumberWithCommas = (number) => {
  if (number == null || isNaN(number)) {
    return "0";
  }

  //정수 부분과 소수 부분 분리
  const [integerPart, decimalPart] = number.toString().split(".");

  //정수 부분 포맷팅
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

export const calculateTotalAmountInKRW = (accountBook) => {
  // 가계부나 지출 또는 예산이 없을 경우
  if (
    !accountBook ||
    !accountBook.expenses ||
    !accountBook.budgets ||
    !accountBook.expenses.length ||
    !accountBook.budgets.length
  ) {
    return 0;
  }

  // 각 통화 단위의 평균 환율 계산 및 저장
  const averageExchangeRates = {};
  accountBook.budgets.forEach((budget) => {
    if (!averageExchangeRates[budget.curUnit]) {
      averageExchangeRates[budget.curUnit] = calculateAverageExchangeRate(
        accountBook.budgets,
        budget.curUnit
      );
    }
  });

  // 원화 변환 총합 계산
  const totalAmount = accountBook.expenses.reduce((total, expense) => {
    const exchangeRate = averageExchangeRates[expense.curUnit] || 1;
    return total + expense.amount * exchangeRate;
  }, 0);

  return totalAmount.toFixed(0);
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
// export const formatDate = (dateString) => {
//   return dateString.split("T")[0];
// };

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}.${month}.${day}`;
};
