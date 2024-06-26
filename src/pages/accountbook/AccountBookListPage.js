import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/accountbook/AccountBookListPage.module.css";

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

const AccountBookListPage = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/main");
  };

  const handleAccountBookClick = (book) => {
    navigate(`/accountbook/main/${book.id}`);
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
    <div className={styles.accountBook_list_page}>
      <div className={styles.accountBook_list_header}>
        <div className={styles.accountBook_list_header_container}>
          <p className={styles.accountBook_list_header_total}>전체 가계부</p>
          <div className={styles.accountBook_list_header_total_line}></div>
        </div>
        <button
          onClick={handleHomeClick}
          className={styles.accountBook_list_home_button}
        >
          홈으로 돌아가기
        </button>
      </div>

      <div className={styles.accountBook_list_grid_container}>
        {dummyData.map((book) => (
          <div
            key={book.id}
            className={styles.accountBook_list_grid_item}
            style={{
              backgroundImage: `url(${
                book.imgName || "/public/images/default.png"
              })`,
            }}
            onClick={() => handleAccountBookClick(book)}
            alt={book.title}
          >
            <div className={styles.accountBook_list_info}>
              <span className={styles.accountBook_list_title}>
                {/* <div>국기 표시 영역</div> - 추후 수정 */}
                {book.title}
              </span>
              <span className={styles.accountBook_list_dates}>
                {`${book.startDate} ~ ${book.endDate}`}
              </span>
            </div>
            <span className={styles.accountBook_list_amount}>
              {calculateTotalAmountInKRW(book)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountBookListPage;
