import React, { useEffect, useState } from "react";
import styles from "../../../styles/accountbook/AccountBookDetail.module.css";
import AddBudget from "../../../components/AddBudget";
import AddExpense from "../../../components/AddExpense";
import { addBudgets } from "../../../api/budgetApi";
import { addExpense } from "../../../api/expenseApi";
import {
  updateAccountBook,
  calculateTotalAmountInKRW,
  formatDate,
} from "../../../api/accountbookApi";
import TripInfo from "./TripInfo";
import {
  handleSuccessSubject,
  handlefailureSubject,
} from "../../../util/logoutUtils";

const AccountSidebar = ({
  accountBook,
  dates,
  onDateChange,
  onShowAll,
  onShowPreparation,
  expenses = [],
  onShowStatistics // 추가된 부분
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isTripInfoModalOpen, setIsTripInfoModalOpen] = useState(false);
  const [totalBudget, setTotalBudget] = useState(0);

  useEffect(() => {
    const initialTotalBudget = accountBook.budgets.reduce(
      (sum, budget) =>
        sum + parseFloat(budget.amount) * parseFloat(budget.exchangeRate),
      0
    );
    setTotalBudget(initialTotalBudget.toFixed(2));
  }, [accountBook]);

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
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setIsTripInfoModalOpen(false);
    window.location.reload();
  };

  useEffect(() => {
    console.log("accountBook:", accountBook);
  }, [accountBook]);

  return (
    <aside className={styles.sidebar}>
      <div
        key={accountBook.id}
        className={styles.tripInfo}
        style={{
          backgroundImage: `url(${
            accountBook.imgName || "/images/default.png"
          })`,
        }}
        onClick={() => setIsTripInfoModalOpen(true)}
      >
        <div className={styles.accountBook_list_item_detail}>
          <div className={styles.accountBook_list_title_and_flag}>
            <span className={styles.accountBook_list_flag}>
              <img src={accountBook.countryFlag} alt="국기" />
            </span>
            <span className={styles.accountBook_list_title}>
              {accountBook.title}
            </span>
          </div>
          <span className={styles.accountBook_list_dates}>
            {`${formatDate(accountBook.startDate)} ~ ${formatDate(
              accountBook.endDate
            )}`}
          </span>
          <span className={styles.accountBook_list_edit}>
            <img src="/images/account/add_box.png" alt="+" />
            {accountBook.imgName ? "수정하기" : "사진을 추가하세요."}
          </span>
        </div>
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
            <span className={styles.tripDate}>
              {formatDate(date.toISOString())}
            </span>
            <span className={styles.selectedIcon}>
              {selectedOption?.getTime?.() === date.getTime() ? "<" : ">"}
            </span>
          </button>
        ))}
      </div>
      <div className={styles.accountbook_icons}>
        <span>
          <button onClick={onShowStatistics}>
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
      {isTripInfoModalOpen && (
        <TripInfo
          isOpen={isTripInfoModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleAccountBookSubmit}
          accountBook={accountBook}
        />
      )}
    </aside>
  );
};

export default AccountSidebar;
