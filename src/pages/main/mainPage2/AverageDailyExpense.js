import React, { useState } from "react";
import styles from "../../../styles/main/mainPage2/MainPage.module.css";
import WhereYouGo from "../../../components/WhereYouGo";

//이번 여행, 얼마가 필요할까?
const AverageDailyExpense = () => {
  const [countryName, setCountryName] = useState("");
  const [countryFlag, setCountryFlag] = useState("");

  const handleCountrySelect = (country) => {
    setCountryName(country.country_nm);
    setCountryFlag(country.download_url);
  };

  return (
    <div className={styles.average_daily_expense_container}>
      <h3>이번 여행, 얼마가 필요할까?</h3>
      <div className={styles.average_daily_expense_search_container}>
        <WhereYouGo onCountrySelect={handleCountrySelect} />
      </div>
      <div className={styles.average_daily_expense_search_result}>
            <div>
              <span className={styles.average_daily_expense_countryName}>
              {countryName ? countryName : "???"}
                </span> (으)로 떠난 여행객들은
            </div>
            <div> 하루 평균  
              {/*<span className={styles.averageAmount}>
              sql 문 만들어서 사용
              </span>*/}
               ???? 원을 썼어요!
            </div>
      </div>
    </div>
  );
};

export default AverageDailyExpense;
