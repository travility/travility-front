import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Destination from "../../../components/Destination";
import AddBudget from "../../../components/AddBudget";
import styles from "../../../styles/main/mainPage2/AddAccountBook.module.css";
import { addAccountBook } from "../../../api/accountbookApi";

const AddAccountBook = ({ authToken }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [budget, setBudget] = useState("");
  const [title, setTitle] = useState("");
  const [countryName, setCountryName] = useState("");
  const [countryFlag, setCountryFlag] = useState("");
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("Authorization");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUsername(payload.sub);
    }
  }, []);

  const handleAddAccountBook = async () => {
    const accountBookData = {
      startDate,
      endDate,
      countryName,
      countryFlag,
      numberOfPeople: parseInt(numberOfPeople),
      title,
      member: { username },
      budgets,
    };

    console.log("전송되는 데이터:", accountBookData);

    try {
      const accountBookResponse = await addAccountBook(accountBookData);
      navigate(`/accountbook/detail/${accountBookResponse.id}`);
    } catch (error) {
      console.error("가계부 추가 중 오류가 발생했습니다:", error);
    }
  };

  const handleCountrySelect = (country) => {
    setCountryName(country.country_nm);
    setCountryFlag(country.download_url);
  };

  const handleBudgetSubmit = (budgets) => {
    setBudgets(budgets);
    // 총 예산 금액 계산
    const totalBudget = budgets.reduce(
      (sum, budget) =>
        sum + parseFloat(budget.amount) * parseFloat(budget.exchangeRate),
      0
    );
    setBudget(totalBudget.toFixed(2));
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
          <Destination onCountrySelect={handleCountrySelect} />
        </div>
        <div
          className={styles.addAccount_formGroup}
          onClick={() => setIsBudgetModalOpen(true)}
        >
          <label>예산은 얼마인가요?</label>
          <input
            type="number"
            value={budget}
            readOnly
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
      {isBudgetModalOpen && (
        <AddBudget
          isOpen={isBudgetModalOpen}
          onClose={() => setIsBudgetModalOpen(false)}
          onSubmit={handleBudgetSubmit}
          initialBudgets={budgets}
        />
      )}
    </div>
  );
};

export default AddAccountBook;
