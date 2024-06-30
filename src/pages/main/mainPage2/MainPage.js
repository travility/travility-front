import React from "react";
import { useNavigate } from "react-router-dom";
import AddAccountBook from "./AddAccountBook";
import RecentAccountBooks from "./RecentAccountBooks";
import styles from "../../../styles/main/mainPage2/MainPage.module.css";

const MainPage = () => {
  const memberId = 1;

  return (
    <div className={styles.mainPageContainer}>
      <div className={styles.leftPanel}>
        <AddAccountBook memberId={memberId} />
      </div>
      <div className={styles.rightPanel}>
        <RecentAccountBooks />
      </div>
    </div>
  );
};

export default MainPage;
