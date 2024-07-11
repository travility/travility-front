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
  calculateAverageExchangeRates,
} from "../../../util/calcUtils";

const ExpenseList = ({ accountBook, selectedDate }) => {
  const [filter, setFilter] = useState("all");
  const [currency, setCurrency] = useState("all");
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    let filtered = accountBook.expenses;

    if (selectedDate !== "all" && selectedDate !== "preparation") {
      filtered = filtered.filter(
        (expense) =>
          new Date(expense.expenseDate).toISOString().split("T")[0] ===
          selectedDate
      );
    } else if (selectedDate === "preparation") {
      filtered = filtered.filter(
        (expense) =>
          new Date(expense.expenseDate) < new Date(accountBook.startDate)
      );
    }

    if (filter === "shared") {
      filtered = filtered.filter((expense) => expense.isShared);
    } else if (filter === "personal") {
      filtered = filtered.filter((expense) => !expense.isShared);
    }

    setFilteredExpenses(filtered);
  }, [selectedDate, filter, accountBook.expenses]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleCurrencyChange = (selectedOption) => {
    setCurrency(selectedOption ? selectedOption.value : "all");
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
    currency === "all"
      ? formatNumberWithCommas(calculateTotalBudgetInKRW(accountBook.budgets))
      : formatNumberWithCommas(
          calculateTotalBudget(accountBook.budgets, currency)
        );

  const totalExpenses =
    currency === "all"
      ? formatNumberWithCommas(
          calculateTotalAmountInKRW(
            accountBook.expenses,
            calculateAverageExchangeRates(accountBook.budgets)
          )
        )
      : formatNumberWithCommas(
          calculateTotalExpenses(accountBook.expenses, currency)
        );

  const remainingBudget = formatNumberWithCommas(
    currency === "all"
      ? calculateTotalBudgetInKRW(accountBook.budgets) -
          calculateTotalAmountInKRW(
            accountBook.expenses,
            calculateAverageExchangeRates(accountBook.budgets)
          )
      : calculateTotalBudget(accountBook.budgets, currency) -
          calculateTotalExpenses(accountBook.expenses, currency)
  );

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "var(--background-color)",
      border: "1px solid var(--line-color)",
      borderRadius: "0.3rem",
      width: "8rem",
      color: "var(--text-color)",
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
        color: "#fff",
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

    return `${totalAmount.toLocaleString()}`;
  };

  const totalAmountInKRWForFilteredExpenses =
    calculateTotalAmountInKRWForFilteredExpenses(filteredExpenses);

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
            <label htmlFor="currency">화폐 통화 선택</label>
            <Select
              id="currency"
              onChange={handleCurrencyChange}
              options={[{ label: "전체", value: "all" }, ...uniqueCurrencies]}
              styles={customStyles}
              isSearchable={false}
              noOptionsMessage={() => "선택 가능한 화폐가 없습니다"}
            />
          </div>
          <div className={styles.budgetInfo_container}>
            <span className={styles.budgetInfo}>
              <label>예산</label> {totalBudget}
            </span>
            <span className={styles.budgetInfo}>
              <label>지출</label> {totalExpenses}
            </span>
            <span className={styles.budgetInfo}>
              <label>잔액</label> {remainingBudget}
            </span>
          </div>
        </div>
        <div className={styles.totalAmount}>
          <label>** 원화 환산 금액</label>
          지출 합계: {totalAmountInKRWForFilteredExpenses} 원
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
