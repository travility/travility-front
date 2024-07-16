import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import ExpenseItem from "./ExpenseItem";
import styles from "../../../styles/accountbook/AccountBookDetail.module.css";
import { Button } from "../../../styles/StyledComponents";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  formatNumberWithCommas,
  calculateTotalAmountInKRW,
  calculateTotalBudget,
  calculateTotalExpenses,
  calculateAverageExchangeRate,
} from "../../../util/calcUtils";

const ExpenseList = ({ accountBook, selectedDate }) => {
  const [filter, setFilter] = useState("all");
  const [currency, setCurrency] = useState({ label: "전체", value: "all" });
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [filteredBudgets, setFilteredBudgets] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    let filteredExp = accountBook.expenses;
    let filteredBudg = accountBook.budgets;

    const formatDate = (date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    const startDate = formatDate(accountBook.startDate);

    if (selectedDate !== "all" && selectedDate !== "preparation") {
      const selected = formatDate(selectedDate);
      filteredExp = filteredExp.filter(
        (expense) =>
          formatDate(expense.expenseDate).getTime() === selected.getTime()
      );
    } else if (selectedDate === "preparation") {
      filteredExp = filteredExp.filter(
        (expense) => formatDate(expense.expenseDate) < startDate
      );
    }

    if (filter === "shared") {
      filteredExp = filteredExp.filter((expense) => expense.isShared);
      filteredBudg = filteredBudg.filter((budget) => budget.isShared);
    } else if (filter === "personal") {
      filteredExp = filteredExp.filter((expense) => !expense.isShared);
      filteredBudg = filteredBudg.filter((budget) => !budget.isShared);
    }

    if (currency.value !== "all") {
      filteredExp = filteredExp.filter(
        (expense) => expense.curUnit === currency.value
      );
      filteredBudg = filteredBudg.filter(
        (budget) => budget.curUnit === currency.value
      );
    }

    setFilteredExpenses(filteredExp);
    setFilteredBudgets(filteredBudg);
  }, [
    selectedDate,
    filter,
    currency,
    accountBook.expenses,
    accountBook.budgets,
  ]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleCurrencyChange = (selectedOption) => {
    setCurrency(selectedOption || { label: "전체", value: "all" });
  };

  const goSettlement = () => {
    const sharedExpenses = accountBook.expenses.filter(
      (expense) => expense.isShared
    );
    if (sharedExpenses.length === 0) {
      Swal.fire({
        title: "정산 실패",
        text: "정산할 공동경비 지출이 없습니다",
        icon: "error",
        confirmButtonColor: "#2a52be",
      });
    } else {
      navigate(`/settlement/${accountBook.id}`);
    }
  };

  const groupedExpenses = filteredExpenses.reduce((acc, expense) => {
    const date = new Date(expense.expenseDate).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(expense);
    return acc;
  }, {});

  const uniqueCurrencies = useMemo(() => {
    return Array.from(
      new Set(accountBook.budgets.map((budget) => budget.curUnit))
    ).map((curUnit) => ({
      label: curUnit,
      value: curUnit,
    }));
  }, [accountBook.budgets]);

  const calculateTotalBudgetInKRW = (budgets) => {
    const averageExchangeRates = {};
    budgets.forEach((budget) => {
      if (!averageExchangeRates[budget.curUnit]) {
        averageExchangeRates[budget.curUnit] = calculateAverageExchangeRate(
          budgets,
          budget.curUnit
        );
      }
    });

    const totalBudgetInKRW = budgets.reduce((total, budget) => {
      const exchangeRate = averageExchangeRates[budget.curUnit] || 1;
      return total + budget.amount * exchangeRate;
    }, 0);

    return totalBudgetInKRW;
  };

  const totalBudget =
    currency.value === "all"
      ? formatNumberWithCommas(calculateTotalBudgetInKRW(filteredBudgets))
      : formatNumberWithCommas(
          calculateTotalBudget(filteredBudgets, currency.value).toFixed(2)
        );

  const totalExpensesInKRW = calculateTotalAmountInKRW({
    expenses: filteredExpenses,
    budgets: filteredBudgets,
  });

  const totalExpensesInSelectedCurrency = calculateTotalExpenses(
    filteredExpenses,
    currency.value
  );

  const totalExpenses =
    currency.value === "all"
      ? formatNumberWithCommas(totalExpensesInKRW)
      : formatNumberWithCommas(totalExpensesInSelectedCurrency.toFixed(2));

  const calculateCumulativeTotalExpenses = (selectedDate, currency) => {
    const formatDate = (date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    const selected = formatDate(selectedDate);
    const startDate = formatDate(accountBook.startDate);

    let cumulativeExpenses = accountBook.expenses.filter((expense) => {
      const expenseDate = formatDate(expense.expenseDate);
      return expenseDate <= selected;
    });

    if (filter === "shared") {
      cumulativeExpenses = cumulativeExpenses.filter(
        (expense) => expense.isShared
      );
    } else if (filter === "personal") {
      cumulativeExpenses = cumulativeExpenses.filter(
        (expense) => !expense.isShared
      );
    }

    if (currency !== "all") {
      cumulativeExpenses = cumulativeExpenses.filter(
        (expense) => expense.curUnit === currency
      );
      return calculateTotalExpenses(cumulativeExpenses, currency).toFixed(2);
    }

    return calculateTotalAmountInKRW({
      expenses: cumulativeExpenses,
      budgets: accountBook.budgets,
    });
  };

  const cumulativeTotalExpenses =
    selectedDate !== "all" && selectedDate !== "preparation"
      ? calculateCumulativeTotalExpenses(selectedDate, currency.value)
      : currency.value === "all"
      ? totalExpensesInKRW
      : calculateTotalExpenses(filteredExpenses, currency.value).toFixed(2);

  const formattedCumulativeTotalExpenses =
    currency.value === "all"
      ? formatNumberWithCommas(parseFloat(cumulativeTotalExpenses).toFixed(0))
      : formatNumberWithCommas(parseFloat(cumulativeTotalExpenses).toFixed(2));

  const remainingBudget =
    currency.value === "all"
      ? formatNumberWithCommas(
          (
            calculateTotalBudgetInKRW(filteredBudgets) -
            parseFloat(cumulativeTotalExpenses)
          ).toFixed(0)
        )
      : formatNumberWithCommas(
          (
            calculateTotalBudget(filteredBudgets, currency.value) -
            parseFloat(cumulativeTotalExpenses)
          ).toFixed(2)
        );

  const calculateTotalAmountInKRWForFilteredExpenses = (expenses) => {
    const averageExchangeRates = {};
    accountBook.budgets.forEach((budget) => {
      if (!averageExchangeRates[budget.curUnit]) {
        averageExchangeRates[budget.curUnit] = calculateAverageExchangeRate(
          accountBook.budgets,
          budget.curUnit
        );
      }
    });

    const totalAmount = expenses.reduce((total, expense) => {
      const exchangeRate = averageExchangeRates[expense.curUnit] || 1;
      return total + expense.amount * exchangeRate;
    }, 0);

    return Math.round(totalAmount);
  };

  const totalAmountInKRWForFilteredExpenses =
    selectedDate !== "all" && selectedDate !== "preparation"
      ? calculateTotalAmountInKRWForFilteredExpenses(filteredExpenses)
      : totalExpensesInKRW;

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "var(--background-color)",
      border: "1px solid var(--line-color)",
      borderRadius: "0.3rem",
      width: "4rem",
      minHeight: "1rem",
      color: "var(--text-color)",
      marginTop: "0.4rem",
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0.2rem 0.5rem",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      width: "1rem",
      padding: "0.2rem",
    }),
    option: (base) => ({
      ...base,
      display: "flex",
      alignItems: "center",
      background: "var(--background-color)",
      color: "var(--text-color)",
      fontSize: "0.7em",
      ":hover": {
        background: "var(--main-color)",
        color: "#ffffff",
      },
    }),
    singleValue: (base) => ({
      ...base,
      display: "flex",
      alignItems: "center",
      color: "var(--text-color)",
      fontSize: "0.8em",
    }),
  };

  return (
    <div className={styles.expenseList_container}>
      <div className={styles.expenseList_header}>
        <div className={styles.filter_buttons}>
          <Button
            className={filter === "all" ? styles.selected_button : ""}
            onClick={() => handleFilterChange("all")}
          >
            모두보기
          </Button>
          <Button
            className={filter === "shared" ? styles.selected_button : ""}
            onClick={() => handleFilterChange("shared")}
          >
            공동경비
          </Button>
          <Button
            className={filter === "personal" ? styles.selected_button : ""}
            onClick={() => handleFilterChange("personal")}
          >
            개인경비
          </Button>
        </div>
        <div className={styles.settlement_button}>
          <Button onClick={goSettlement}>정산하기</Button>
        </div>
      </div>
      <div className={styles.expenseList_summary_container}>
        <div className={styles.expenseList_summary}>
          <div className={styles.currency_select}>
            <label htmlFor="currency">화폐 선택</label>
            <Select
              id="currency"
              value={currency}
              onChange={handleCurrencyChange}
              options={[{ label: "전체", value: "all" }, ...uniqueCurrencies]}
              styles={customStyles}
              isSearchable={false}
              noOptionsMessage={() => "선택 가능한 화폐가 없습니다"}
            />
          </div>
          <div className={styles.budgetInfo_container}>
            <span className={styles.budgetInfo}>
              <label>총 예산</label> {totalBudget}
            </span>
            <span className={styles.budgetInfo}>
              <label>누적 지출</label> {formattedCumulativeTotalExpenses}
            </span>
            <span className={styles.budgetInfo}>
              <label>잔액</label> {remainingBudget}
            </span>
          </div>
        </div>
        <div className={styles.totalAmount_container}>
          <div className={styles.totalAmount}>
            <label>[ 지출 합계 ]</label>
            {currency.value === "all" || currency.value === "KRW" ? (
              ""
            ) : (
              <>
                <div className={styles.amountCurrency}>
                  {currency.value}{" "}
                  {formatNumberWithCommas(
                    totalExpensesInSelectedCurrency.toFixed(2)
                  )}
                </div>
              </>
            )}
          </div>
          <div className={styles.amountKRW}>
            {formatNumberWithCommas(totalAmountInKRWForFilteredExpenses)} 원
            <label>** 원화 환산 금액</label>
          </div>
        </div>
      </div>
      <div className={styles.expenseList}>
        {Object.keys(groupedExpenses).length === 0 ? (
          <p className={styles.noExpenses}>지출 내역이 없습니다.</p>
        ) : (
          Object.keys(groupedExpenses).map((date, index) => (
            <div key={index}>
              <div className={styles.expenseDate}>{date}</div>
              {groupedExpenses[date].map((expense, idx) => (
                <ExpenseItem
                  key={idx}
                  expense={expense}
                  accountBook={accountBook}
                />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
