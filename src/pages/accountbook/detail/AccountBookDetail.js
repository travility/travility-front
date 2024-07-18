import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getAccountBookById,
  updateAccountBook,
} from "../../../api/accountbookApi";
import AccountBookDate from "./AccountBookDate";
import ExpenseList from "./ExpenseList";
import AccountBookMenu from "./AccountBookMenu";
import TripInfo from "../../../components/TripInfo";
import UpdateTripInfo from "./UpdateTripInfo";
import AddBudget from "../../../components/AddBudget";
import AddExpense from "../../../components/AddExpense";
import { addBudgets } from "../../../api/budgetApi";
import { addExpense } from "../../../api/expenseApi";
import {
  handleSuccessSubject,
  handleFailureSubject,
} from "../../../util/logoutUtils";
import styles from "../../../styles/accountbook/AccountBookDetail.module.css";

const AccountBookDetail = () => {
  const { id } = useParams();
  const [accountBook, setAccountBook] = useState(null);
  const [selectedDate, setSelectedDate] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isTripInfoModalOpen, setIsTripInfoModalOpen] = useState(false);

  useEffect(() => {
    const fetchAccountBook = async () => {
      try {
        const data = await getAccountBookById(id);
        setAccountBook(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountBook();
  }, [id]);

  const getDateRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    endDate = new Date(endDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const dateList = accountBook
    ? getDateRange(accountBook.startDate, accountBook.endDate)
    : [];

  const handleDateChange = (selectedDate) => setSelectedDate(selectedDate);

  const handleShowAll = () => setSelectedDate("all");

  const handleShowPreparation = () => setSelectedDate("preparation");

  const handleBudgetSubmit = async (budgets) => {
    try {
      await addBudgets(accountBook.id, budgets);
      handleSuccessSubject("예산", "수정");
    } catch (error) {
      console.error("Error updating budgets:", error);
      handleFailureSubject("예산", "수정");
    } finally {
      setIsBudgetModalOpen(false);
    }
  };

  const handleExpenseSubmit = async (expense) => {
    try {
      await addExpense(expense);
      handleSuccessSubject("지출", "추가");
    } catch (error) {
      console.error("Error:", error);
      handleFailureSubject("지출", "추가");
    } finally {
      setIsExpenseModalOpen(false);
    }
  };

  const handleAccountBookSubmit = async (tripInfo) => {
    try {
      await updateAccountBook(accountBook.id, tripInfo);
      handleSuccessSubject("가계부", "수정");
    } catch (error) {
      console.error("Error updating AccountBook: ", error);
      handleFailureSubject("가계부", "수정");
    } finally {
      setIsTripInfoModalOpen(false);
    }
  };

  if (loading) {
    return <div>Loading...🐷</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!accountBook) {
    return <div>Account book not found</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.sidebar}>
        <div className={styles.tripInfoAndMenu}>
          <TripInfo
            accountBook={accountBook}
            onClick={() => setIsTripInfoModalOpen(true)}
          />
          <AccountBookMenu
            onBudgetClick={() => setIsBudgetModalOpen(true)}
            onExpenseClick={() => setIsExpenseModalOpen(true)}
          />
        </div>
        <AccountBookDate
          accountBook={accountBook}
          dates={dateList}
          onDateChange={handleDateChange}
          onShowAll={handleShowAll}
          onShowPreparation={handleShowPreparation}
        />
      </div>
      <ExpenseList accountBook={accountBook} selectedDate={selectedDate} />
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
    </div>
  );
};

export default AccountBookDetail;
