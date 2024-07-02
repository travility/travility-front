import React from "react";
import AddAccountBook from "./AddAccountBook";
import RecentAccountBooks from "./RecentAccountBooks";
import styles from "../../../styles/main/mainPage2/MainPage.module.css";

const MainPage = () => {
  const memberId = 1;

  return (
    <div className={styles.mainPageContainer}>
      <div className={styles.addAccountBook}>
        <AddAccountBook memberId={memberId} />
      </div>
      <div className={styles.recentAccountBooks}>
        <RecentAccountBooks />
      </div>
      <div className={styles.deco}>뭐 넣을까요...</div>
    </div>
  );
};

export default MainPage;
