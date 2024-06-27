import React from "react";
import AddAccountBook from "./AddAccountBook";
import RecentAccountBooks from "./RecentAccountBooks";
import AverageDailyExpense from "./AverageDailyExpense";
import TopDestinations from "./TopDestinations";
import styles from "../../../styles/main/mainPage2/MainPage.module.css";

const MainPage = () => {
  const memberId = 1;

  return (
    <div className={styles.mainPageContainer}>
      <div className={styles.leftPanel}>
        <AddAccountBook memberId={memberId} />
      </div>
      <div className={styles.centerPanel}>
        <RecentAccountBooks />
      </div>
      <div className={styles.rightPanel}>
        <AverageDailyExpense />
        <TopDestinations />
      </div>
      <div className={styles.navigationButtonsContainer}>
      <div className={styles.navigationButtons}>
        <button>
          <img src="/images/main/mainPage/accountIcon.png" alt="accountBook" />
          전체 가계부 보기
        </button>
        <button>
          <img
            src="/images/main/mainPage/myCalendarIcon.png"
            alt="myCalendar"
          />
          내 캘린더
        </button>
        <button>
          <img src="/images/main/mainPage/myReportIcon.png" alt="myReport" />
          마이리포트
        </button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
