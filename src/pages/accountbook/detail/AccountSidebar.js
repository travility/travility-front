import React, { useState } from "react";
import styles from "../../../styles/accountbook/AccountBookDetail.module.css";
import AddBudget from "../../../components/AddBudget";
import AddExpense from "../../../components/AddExpense";
import { addBudgets } from "../../../api/budgetApi";
import { addExpense } from "../../../api/expenseApi";

const AccountSidebar = ({
  accountBook,
  dates,
  onDateChange,
  onShowAll,
  onShowPreparation,
  expenses = [],
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [totalBudget, setTotalBudget] = useState(
    accountBook.budgets.reduce(
      (sum, budget) =>
        sum + parseFloat(budget.amount) * parseFloat(budget.exchangeRate),
      0
    )
  );

  const backgroundImage = accountBook.imgName
    ? `/images/account/${accountBook.imgName}`
    : "";

  const formatDate = (date) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Intl.DateTimeFormat("ko-KR", options)
      .format(date)
      .replace(/\./g, ".")
      .replace(/.$/, "");
  };

  const handleDateChange = (date) => {
    setSelectedOption(date);
    onDateChange(date.toLocaleDateString());
  };

  const handleShowAll = () => {
    setSelectedOption("all");
    onShowAll();
  };

  const handleShowPreparation = () => {
    setSelectedOption("preparation");
    onShowPreparation();
  };

  const handleBudgetSubmit = async (budgets) => {
    const totalBudget = budgets.reduce(
      (sum, budget) =>
        sum + parseFloat(budget.amount) * parseFloat(budget.exchangeRate),
      0
    );
    setTotalBudget(totalBudget.toFixed(2));

    try {
      const budgetsResponse = await addBudgets(accountBook.id, budgets);
      console.log("Budgets updated successfully:", budgetsResponse);
    } catch (error) {
      console.error("Error updating budgets:", error);
    } finally {
      setIsBudgetModalOpen(false);
    }
  };

  const handleExpenseSubmit = async (expense) => {
    try {
      const expenseResponse = await addExpense(expense);
      console.log("Expense added successfully:", expenseResponse);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsExpenseModalOpen(false);
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div
        className={styles.tripInfo}
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        }}
      >
        <h2>{accountBook.title}</h2>
        <p>
          {formatDate(dates[0])} - {formatDate(dates[dates.length - 1])}
        </p>
        <p>총 예산: {totalBudget.toLocaleString()} KRW</p>
      </div>
      <div className={styles.dateButtons}>
        <button
          onClick={handleShowAll}
          className={selectedOption === "all" ? styles.selected : ""}
        >
          모두 보기
          <span className={styles.selectedIcon}>
            {selectedOption === "all" ? "<" : ">"}
          </span>
        </button>
        <button
          onClick={handleShowPreparation}
          className={selectedOption === "preparation" ? styles.selected : ""}
        >
          준비
          <span className={styles.selectedIcon}>
            {selectedOption === "preparation" ? "<" : ">"}
          </span>
        </button>
        {dates.map((date, index) => (
          <button
            key={index}
            onClick={() => handleDateChange(date)}
            className={
              selectedOption?.getTime?.() === date.getTime()
                ? styles.selected
                : ""
            }
          >
            Day {index + 1}
            <span className={styles.tripDate}>{formatDate(date)}</span>
            <span className={styles.selectedIcon}>
              {selectedOption?.getTime?.() === date.getTime() ? "<" : ">"}
            </span>
          </button>
        ))}
      </div>
      <div className={styles.icons}>
        <span>
          <button>
            <img src="/images/account/statistic.png" alt="statistic" />
          </button>
          <p>지출 통계</p>
        </span>
        <span>
          <button onClick={() => setIsBudgetModalOpen(true)}>
            <img src="/images/account/local_atm.png" alt="budget" />
          </button>
          <p>화폐/예산 추가</p>
        </span>
        <span>
          <button onClick={() => setIsExpenseModalOpen(true)}>
            <img src="/images/account/write.png" alt="addExpense" />
          </button>
          <p>지출내역 추가</p>
        </span>
      </div>
      {isBudgetModalOpen && (
        <AddBudget
          isOpen={isBudgetModalOpen}
          onClose={() => setIsBudgetModalOpen(false)}
          onSubmit={handleBudgetSubmit}
          accountBookId={accountBook.id}
          initialBudgets={accountBook.budgets}
        />
      )}
      {isExpenseModalOpen && (
        <AddExpense
          isOpen={isExpenseModalOpen}
          onClose={() => setIsExpenseModalOpen(false)}
          onSubmit={handleExpenseSubmit}
          accountBookId={accountBook.id}
        />
      )}
    </aside>
  );
};

export default AccountSidebar;
