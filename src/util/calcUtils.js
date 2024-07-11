// 슷지 천단위 ',' 삽입
export const formatNumberWithCommas = (number) => {
  if (number == null || isNaN(number)) {
    return "0";
  }
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// 예산 평균 환율 계산
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

// 원화 총지출액 계산
export const calculateTotalAmountInKRW = (accountBook) => {
  // 가계부나 지출 또는 예산이 없을 경우
  if (
    !accountBook ||
    !accountBook.expenses ||
    !accountBook.budgets ||
    !accountBook.expenses.length ||
    !accountBook.budgets.length
  ) {
    return "KRW 0";
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

  return `KRW ${totalAmount.toLocaleString()}`;
};

// 날짜 포맷
export const formatDate = (dateString) => {
  return dateString.split("T")[0];
};
