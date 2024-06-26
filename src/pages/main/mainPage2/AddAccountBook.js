import React, { useState } from "react";
import WhereYouGo from "../../../components/WhereYouGo";
import styles from "../../../styles/main/mainPage2/AddAccountBook.module.css";
import axios from "axios";

const AddAccountBook = ({ memberId }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [budget, setBudget] = useState("");
  const [title, setTitle] = useState("");
  const [countryName, setCountryName] = useState("");
  const [countryFlag, setCountryFlag] = useState("");

  const handleAddAccountBook = async () => {
    const accountBookData = {
      startDate,
      endDate,
      countryName,
      countryFlag,
      numberOfPeople: parseInt(numberOfPeople),
      title,
      member: { memberId },
    };

    // try {
    //   const response = await axios.post("/api/accountBooks", accountBookData);
    //   console.log("가계부가 성공적으로 추가되었습니다:", response.data);
    // } catch (error) {
    //   console.error("가계부 추가 중 오류가 발생했습니다:", error);
    // }
  };

  const handleCountrySelect = (country) => {
    setCountryName(country.country_nm);
    setCountryFlag(country.download_url);
  };

  return (
    <div className={styles.addAccountBookContainer}>
      <h2>계획 중이신 여행에 대해 알려주세요.</h2>
      <form className={styles.addAccount_form}>
        <div className={styles.addAccount_formGroup}>
          <label>언제 떠나시나요?</label>
          <div className={styles.addAccount_dateRange}>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <span>~</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>
        <div className={styles.addAccount_formGroup}>
          <label>몇 명이서 떠나시나요?</label>
          <input
            type="number"
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(e.target.value)}
            placeholder="인원 입력"
            required
          />
        </div>
        <div className={styles.addAccount_formGroup}>
          <label>어디로 떠나시나요?</label>
          <WhereYouGo onCountrySelect={handleCountrySelect} />
        </div>
        <div className={styles.addAccount_formGroup}>
          <label>예산은 얼마인가요?</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="금액 입력"
            required
          />
        </div>
        <div className={styles.addAccount_formGroup}>
          <label>여행의 이름을 정해주세요.</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목 입력"
            required
          />
        </div>
        <button
          className={styles.addAccount_button}
          type="button"
          onClick={handleAddAccountBook}
        >
          새 가계부 추가
        </button>
      </form>
    </div>
  );
};

export default AddAccountBook;
