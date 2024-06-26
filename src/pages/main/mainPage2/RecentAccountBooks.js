import React from "react";
import styles from "../../../styles/main/mainPage2/MainPage.module.css";

const dummyData = [
  {
    id: 1,
    country: "서울",
    startDate: "2024-06-07",
    endDate: "2024-06-11",
    amount: "KRW 652,500",
    image: null,
  },
  {
    id: 2,
    country: "호주",
    startDate: "2024-04-17",
    endDate: "2024-04-22",
    amount: "KRW 3,652,500",
    image: "path/to/australia.jpg",
  },
];

const RecentAccountBooks = () => {
  return (
    <div className={styles.recentAccountBooksContainer}>
      <h3>최근 내 가계부</h3>
      <div className={styles.accountBooksList}>
        {dummyData.map((book) => (
          <div key={book.id} className={styles.accountBookItem}>
            <img
              src={book.image || "path/to/default-image.jpg"}
              alt={book.country}
            />
            <div>
              <span>{book.country}</span>
              <span>{`${book.startDate} ~ ${book.endDate}`}</span>
              <span>{book.amount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentAccountBooks;
