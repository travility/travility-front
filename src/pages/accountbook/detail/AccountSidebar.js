import React, { useEffect, useState } from "react";
import styles from "../../../styles/accountbook/AccountBookDetail.module.css";
import AddBudget from "../../../components/AddBudget";
import AddExpense from "../../../components/AddExpense";
import { addBudgets } from "../../../api/budgetApi";
import { addExpense } from "../../../api/expenseApi";
import { updateAccountBook } from "../../../api/accountbookApi";
import { formatDate } from "../../../util/calcUtils";
import UpdateTripInfo from "./UpdateTripInfo";
import {
  handleSuccessSubject,
  handlefailureSubject,
} from "../../../util/logoutUtils";
import { Button } from "../../../styles/StyledComponents";
import TripInfo from "../../../components/TripInfo";

const AccountSidebar = ({
  accountBook,
  dates,
  onDateChange,
  onShowAll,
  onShowPreparation,
  expenses = [],
  onShowStatistics // 추가된 부분
}) => {
  const [selectedOption, setSelectedOption] = useState("all");
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isTripInfoModalOpen, setIsTripInfoModalOpen] = useState(false);

  const handleDateChange = (date) => {
    setSelectedOption(date.toLocaleDateString());
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
    try {
      const totalBudget = budgets.reduce(
        (sum, budget) =>
          sum + parseFloat(budget.amount) * parseFloat(budget.exchangeRate),
        0
      );

      const budgetsResponse = await addBudgets(accountBook.id, budgets);
      console.log("Budgets updated successfully:", budgetsResponse);
      handleSuccessSubject("예산", "수정");
    } catch (error) {
      console.error("Error updating budgets:", error);
      handlefailureSubject("예산", "수정");
    } finally {
      setIsBudgetModalOpen(false);
    }
  };

  const handleExpenseSubmit = async (expense) => {
    try {
      const expenseResponse = await addExpense(expense);
      console.log("Expense added successfully:", expenseResponse);
      handleSuccessSubject("지출", "추가");
    } catch (error) {
      console.error("Error:", error);
      handlefailureSubject("지출", "추가");
    } finally {
      setIsExpenseModalOpen(false);
    }
  };

  const handleAccountBookSubmit = async (tripInfo) => {
    try {
      const accountBookResponse = await updateAccountBook(
        accountBook.id,
        tripInfo
      );
      console.log("AccountBook updated successfully: ", accountBookResponse);
      handleSuccessSubject("가계부", "수정");
    } catch (error) {
      console.log("Error updating AccountBook: ", error);
      handlefailureSubject("가계부", "수정");
    } finally {
      setIsTripInfoModalOpen(false);
    }
  };

  return (
    <aside className={styles.sidebar}>
      <TripInfo
        accountBook={accountBook}
        onClick={() => setIsTripInfoModalOpen(true)}
      />
      <div className={styles.date_buttons}>
        <Button
          onClick={handleShowAll}
          className={selectedOption === "all" ? styles.selected : ""}
        >
          모두 보기
          <span>{selectedOption === "all" ? "<" : ">"}</span>
        </Button>
        <Button
          onClick={handleShowPreparation}
          className={selectedOption === "preparation" ? styles.selected : ""}
        >
          준비
          <span>{selectedOption === "preparation" ? "<" : ">"}</span>
        </Button>
        {dates.map((date, index) => (
          <Button
            key={index}
            onClick={() => handleDateChange(date)}
            className={
              selectedOption === date.toLocaleDateString()
                ? styles.selected
                : ""
            }
          >
            Day {index + 1}
            <span className={styles.tripDate}>
              {formatDate(date.toISOString())}
            </span>
            <span>
              {selectedOption === date.toLocaleDateString() ? "<" : ">"}
            </span>
          </Button>
        ))}
      </div>
      <div className={styles.accountbook_icons}>
        <span>
          {/* <button onClick={onShowStatistics}> */}
          <Button onClick={onShowStatistics}>
            <img src="/images/account/statistic.png" alt="statistic" />
          </Button>
          <p>지출 통계</p>
        </span>
        <span>
          <Button onClick={() => setIsBudgetModalOpen(true)}>
            <img src="/images/account/local_atm.png" alt="budget" />
          </Button>
          <p>
            화폐/예산
            <br />
            추가
          </p>
        </span>
        <span>
          <button onClick={() => setIsExpenseModalOpen(true)}>
            <img src="/images/account/write.png" alt="addExpense" />
          </button>
          <p>
            지출내역
            <br />
            추가
          </p>
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
          accountBook={accountBook}
        />
      )}
      {isTripInfoModalOpen && (
        <UpdateTripInfo
          isOpen={isTripInfoModalOpen}
          onClose={() => setIsTripInfoModalOpen(false)}
          onSubmit={handleAccountBookSubmit}
          accountBook={accountBook}
        />
      )}
    </aside>
  );
};

export default AccountSidebar;
