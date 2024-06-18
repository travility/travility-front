import React, { useEffect, useState } from "react";
import Sidebar from "./AccountSidebar";
import ExpenseList from "./ExpenseList";
import styles from "../../../styles/accountbook/AccountBookMain.module.css";

const AccountBookMain = () => {
  const [accountBook, setAccountBook] = useState(null);
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  useEffect(() => {
    // Dummy data
    const accountBookData = {
      startDate: "2024-06-07",
      endDate: "2024-06-11",
      title: "서울 여행",
      imgName: "seoul.jpeg",
      numberOfPeople: 3,
      totalBudget: 1000000,
      remainingSharedBudget: 500000,
      remainingPersonalBudget: 200000,
      expenses: [
        {
          id: 1,
          title: "KTX (부산-서울)",
          expenseDate: "2024-06-05",
          currency: "KRW",
          amount: 100000,
          isShared: true,
          imgName: "transport.png",
          memo: "KTX 기차표",
          paymentMethod: "CARD",
          category: "TRANSPORTATION",
        },
        {
          id: 2,
          title: "샤브샤브",
          expenseDate: "2024-06-07",
          currency: "KRW",
          amount: 40000,
          isShared: false,
          imgName: "shabu.png",
          memo: "점심 식사",
          paymentMethod: "CASH",
          category: "FOOD",
        },
        {
          id: 3,
          title: "관광",
          expenseDate: "2024-06-07",
          currency: "USD",
          amount: 2000,
          isShared: true,
          imgName: "tourism.png",
          memo: "관광지 입장료",
          paymentMethod: "CARD",
          category: "TOURISM",
        },
        {
          id: 4,
          title: "쇼핑",
          expenseDate: "2024-06-08",
          currency: "KRW",
          amount: 25000,
          isShared: false,
          imgName: "shopping.png",
          memo: "기념품 구매",
          paymentMethod: "CASH",
          category: "SHOPPING",
        },
      ],
    };
    setAccountBook(accountBookData);
    setFilteredExpenses(accountBookData.expenses);
  }, []);

  if (!accountBook) {
    return <div>Loading...</div>;
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
    const filtered = accountBook.expenses.filter(
      (expense) =>
        new Date(expense.expenseDate).toLocaleDateString() === selectedDate
    );
    setFilteredExpenses(filtered);
  };

  const handleShowAll = () => {
    setFilteredExpenses(accountBook.expenses);
  };

  const handleShowPreparation = () => {
    const filtered = accountBook.expenses.filter(
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
      />
      <ExpenseList expenses={filteredExpenses} />
    </div>
  );
};

export default AccountBookMain;
