import React from "react";
import AddAccountBook from "./AddAccountBook";
import RecentAccountBooks from "./RecentAccountBooks";
import styles from "../../../styles/main/mainPage2/MainPage.module.css";

const MainPage = () => {
  const memberId = 1;

  return (
    <div className="wrapper">
      <div className={styles.mainpage_container}>
        <div className={styles.addAccountBook}>
          <AddAccountBook memberId={memberId} />
        </div>
        <div className={styles.recentAccountBooks}>
          <RecentAccountBooks />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
