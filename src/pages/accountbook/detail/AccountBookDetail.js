import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAccountBookById } from "../../../api/accountbookApi";
import Sidebar from "./AccountSidebar";
import ExpenseList from "./ExpenseList";
import styles from "../../../styles/accountbook/AccountBookDetail.module.css";

const AccountBookDetail = () => {
  const { id } = useParams();
  const [accountBook, setAccountBook] = useState(null);
  const [selectedDate, setSelectedDate] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <div>Loading...🐷</div>;
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
    setSelectedDate(selectedDate);
  };

  const handleShowAll = () => {
    setSelectedDate("all");
  };

  const handleShowPreparation = () => {
    setSelectedDate("preparation");
  };

  return (
    <div className={styles.dashboard}>
      <Sidebar
        accountBook={accountBook}
        dates={dateList}
        onDateChange={handleDateChange}
        onShowAll={handleShowAll}
        onShowPreparation={handleShowPreparation}
      />
      <ExpenseList accountBook={accountBook} selectedDate={selectedDate} />
    </div>
  );
};

export default AccountBookDetail;
