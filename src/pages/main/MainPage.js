import React from "react";
import AddAccountBook from "./AddAccountBookCmp";
import RecentAccountBooks from "./RecentAccountBooksCmp";
import styles from "../../styles/main/MainPage.module.css";

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
