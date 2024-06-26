import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./AccountSidebar";
import ExpenseList from "./ExpenseList";
import styles from "../../../styles/accountbook/AccountBookMain.module.css";

const dummyData = [
  {
    id: 1,
    countryName: "대한민국",
    startDate: "2024-06-07",
    endDate: "2024-06-11",
    imgName: "seoul.jpeg",
    title: "서울 여행",
    numberOfPeople: 3,
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
    budgets: [
      {
        id: 1,
        isShared: true,
        curUnit: "KRW",
        exchangeRate: 1.0,
        amount: 500000,
      },
      {
        id: 2,
        isShared: true,
        curUnit: "USD",
        exchangeRate: 1200.0,
        amount: 500,
      },
      {
        id: 3,
        isShared: true,
        curUnit: "USD",
        exchangeRate: 1100.0,
        amount: 300,
      },
    ],
  },
  {
    id: 2,
    countryName: "호주",
    startDate: "2024-04-17",
    endDate: "2024-04-22",
    imgName: "호주 이미지 경로",
    title: "호주 여행",
    numberOfPeople: 3,
    expenses: [],
    budgets: [],
  },
  {
    id: 3,
    countryName: "일본",
    startDate: "2024-05-01",
    endDate: "2024-05-05",
    imgName: "일본 이미지 경로",
    title: "일본 여행",
    numberOfPeople: 3,
    expenses: [],
    budgets: [],
  },
  {
    id: 4,
    countryName: "몽골",
    startDate: "2024-07-10",
    endDate: "2024-07-15",
    imgName: "몽골 이미지 경로",
    title: "몽골 여행",
    numberOfPeople: 3,
    expenses: [],
    budgets: [],
  },
  {
    id: 5,
    countryName: "스위스",
    startDate: "2024-08-01",
    endDate: "2024-08-10",
    imgName: "스위스 이미지 경로",
    title: "스위스 여행",
    numberOfPeople: 3,
    expenses: [],
    budgets: [],
  },
  {
    id: 6,
    countryName: "영국",
    startDate: "2024-09-05",
    endDate: "2024-09-12",
    imgName: "영국 이미지 경로",
    title: "영국 여행",
    numberOfPeople: 3,
    expenses: [],
    budgets: [],
  },
];

const AccountBookMain = () => {
  const { id } = useParams();
  const [accountBook, setAccountBook] = useState(null);
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  useEffect(() => {
    const accountBookData = dummyData.find((book) => book.id === parseInt(id));
    setAccountBook(accountBookData);
    if (accountBookData) {
      setFilteredExpenses(accountBookData.expenses);
    }
  }, [id]);

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
