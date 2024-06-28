import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAccountBookById } from "../../../api/accountbookApi";
import Sidebar from "./AccountSidebar";
import ExpenseList from "./ExpenseList";
import styles from "../../../styles/accountbook/AccountBookDetail.module.css";

const AccountBookDetail = () => {
  const { id } = useParams();
  const [accountBook, setAccountBook] = useState(null);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccountBook = async () => {
      try {
        const data = await getAccountBookById(id);
        setAccountBook(data);
        setFilteredExpenses(data.expenses || []); // 기본값으로 빈 배열 설정
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountBook();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!accountBook) {
    return <div>Account book not found</div>;
  }

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

  const dateList = getDateRange(accountBook.startDate, accountBook.endDate);

  const handleDateChange = (selectedDate) => {
    const expenses = accountBook.expenses || [];
    const filtered = expenses.filter(
      (expense) =>
        new Date(expense.expenseDate).toLocaleDateString() === selectedDate
    );
    setFilteredExpenses(filtered);
  };

  const handleShowAll = () => {
    setFilteredExpenses(accountBook.expenses || []);
  };

  const handleShowPreparation = () => {
    const expenses = accountBook.expenses || [];
    const filtered = expenses.filter(
      (expense) =>
        new Date(expense.expenseDate) < new Date(accountBook.startDate)
    );
    setFilteredExpenses(filtered);
  };

  return (
    <div className={styles.dashboard}>
      <Sidebar
        accountBook={accountBook}
        dates={dateList}
        onDateChange={handleDateChange}
        onShowAll={handleShowAll}
        onShowPreparation={handleShowPreparation}
        expenses={accountBook.expenses || []}
      />
      <ExpenseList expenses={filteredExpenses} />
    </div>
  );
};

export default AccountBookDetail;
