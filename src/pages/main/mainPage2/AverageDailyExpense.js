import React, { useState } from "react";
import styles from "../../../styles/main/mainPage2/MainPage.module.css";
import WhereYouGo from "../../../components/WhereYouGo";

const AverageDailyExpense = () => {
  const [countryName, setCountryName] = useState("");
  const [countryFlag, setCountryFlag] = useState("");

  const handleCountrySelect = (country) => {
    setCountryName(country.country_nm);
    setCountryFlag(country.download_url);
  };

  return (
    <div className={styles.averageDailyExpenseContainer}>
      <h3>이번 여행, 얼마가 필요할까?</h3>
      <div className={styles.searchContainer}>
        <WhereYouGo onCountrySelect={handleCountrySelect} />
      </div>
      <div className={styles.result}>
        <p>???</p>
        <p>로 떠난 여행객들은 하루 평균 ???원을 썼어요!</p>
      </div>
    </div>
  );
};

export default AverageDailyExpense;
