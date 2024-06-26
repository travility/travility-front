import React, { useState } from "react";
import styles from "../../../styles/main/mainPage2/MainPage.module.css";
import { useNavigate } from "react-router-dom";

//최근 내 가계부
const dummyData = [
  {
    id: 1,
    countryName: "대한민국",
    startDate: "2024-06-07",
    endDate: "2024-06-11",
    imgName: "/images/account/seoul.jpeg",
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

const RecentAccountBooks = () => {

  const navigate = useNavigate();

  const [visibleStartIndex, setVisibleStartIndex] = useState(0);

  const handleRecentAccountBooksClick = (book) => {
    navigate(`/accountbook/main/${book.id}`);
  };

  const handlePrevClick = () => {
    setVisibleStartIndex((prevIndex) => (prevIndex - 2 >= 0 ? prevIndex - 2 : 0));
  };

  const handleNextClick = () => {
    setVisibleStartIndex((prevIndex) =>
      prevIndex + 2 < dummyData.length ? prevIndex + 2 : prevIndex
    );
  };

  const calculateAverageExchangeRate = (budgets, currency) => {
    const relevantBudgets = budgets.filter((b) => b.curUnit === currency);
    const totalAmount = relevantBudgets.reduce(
      (sum, budget) => sum + budget.amount,
      0
    );
    const weightedSum = relevantBudgets.reduce(
      (sum, budget) => sum + budget.exchangeRate * budget.amount,
      0
    );
    return weightedSum / totalAmount;
  };

  const calculateTotalAmountInKRW = (book) => {
    if (!book.expenses.length || !book.budgets.length) return "KRW 0";

    const averageExchangeRates = {};
    book.budgets.forEach((budget) => {
      if (!averageExchangeRates[budget.curUnit]) {
        averageExchangeRates[budget.curUnit] = calculateAverageExchangeRate(
          book.budgets,
          budget.curUnit
        );
      }
    });

    const totalAmount = book.expenses.reduce((total, expense) => {
      const exchangeRate = averageExchangeRates[expense.currency] || 1;
      return total + expense.amount * exchangeRate;
    }, 0);

    return `KRW ${totalAmount.toLocaleString()}`;
  };


  return (
      <div className={styles.recent_accountBooks_container}>
      <h3>최근 내 가계부</h3>
      <div className={styles.recent_accountBooks_list}>
          {dummyData.slice(visibleStartIndex, visibleStartIndex + 2).map((book) => (
            <div
              key={book.id}
              className={styles.recent_accountBooks_item}
              style={{
                backgroundImage: `url(${book.imgName || "/images/account/shabu.png"})`,
              }}
              onClick={() => handleRecentAccountBooksClick(book)}
              alt={book.title}
            >
            <div className={styles.recent_accountBooks_item_details}>
              <span className={styles.recent_accountBooks_item_title}>(플래그){book.title}</span>
              <span className={styles.recent_accountBooks_item_dates}>{`${book.startDate} ~ ${book.endDate}`}</span>
              <span className={styles.recent_accountBooks_item_amount}>{calculateTotalAmountInKRW(book)}</span>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.navigationButtons}>
        <button onClick={handlePrevClick} disabled={visibleStartIndex === 0}>
          pre
        </button>
        <button
          onClick={handleNextClick}
          disabled={visibleStartIndex + 2 >= dummyData.length}
        >
          next
        </button>
      </div>
    </div>
  );
  
};

export default RecentAccountBooks;
