import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/accountbook/AccountBookListPage.module.css";

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
    budgets: [],
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

  const handleBackClick = () => {
    navigate("/addaccountbookpage");
  };

  const handleAccountBookClick = (book) => {
    navigate(`/accountbook/main/${book.id}`);
  };

  return (
    <div className={styles.accountBookPage}>
      <div className={styles.header}>
        <h2>전체 가계부</h2>
        <button onClick={handleBackClick}>홈으로 돌아가기</button>
      </div>
      <div className={styles.gridContainer}>
        {dummyData.map((book) => (
          <div
            key={book.id}
            className={styles.gridItem}
            onClick={() => handleAccountBookClick(book)}
          >
            <img
              src={book.imgName || "디폴트 이미지 경로"}
              alt={book.countryName}
              className={styles.image}
            />
            <div className={styles.info}>
              <span>{book.countryName}</span>
              <span>{`${book.startDate} ~ ${book.endDate}`}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountBookListPage;
