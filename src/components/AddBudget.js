import React, { useState } from "react";
import styles from "../styles/components/AddBudget.module.css";

const AddBudget = ({ onClose, onSubmit }) => {
  const [budgetType, setBudgetType] = useState("shared");
  const [currency, setCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const [budgets, setBudgets] = useState([]);

  const handleAddBudget = () => {
    const newBudget = {
      type: budgetType,
      currency,
      amount,
      exchangeRate,
    };
    setBudgets([...budgets, newBudget]);
    setCurrency("");
    setAmount("");
    setExchangeRate("");
  };

  const handleRegister = () => {
    onSubmit(budgets);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>예산 등록</h2>
        <div className={styles.budgetType}>
          <label>
            <input
              type="radio"
              value="shared"
              checked={budgetType === "shared"}
              onChange={() => setBudgetType("shared")}
            />
            공동경비
          </label>
          <label>
            <input
              type="radio"
              value="personal"
              checked={budgetType === "personal"}
              onChange={() => setBudgetType("personal")}
            />
            개인경비
          </label>
        </div>
        <div className={styles.gridContainer}>
          <div className={styles.formGroup}>
            <label htmlFor="currency">화폐</label>
            <input
              id="currency"
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              placeholder="화폐 선택"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="amount">금액</label>
            <input
              id="amount"
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="금액 입력"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="exchangeRate">적용환율</label>
            <div className={styles.exchangeRate}>
              USD 1.00 = KRW{" "}
              <input
                id="exchangeRate"
                type="text"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(e.target.value)}
              />
            </div>
          </div>
        </div>
        <button className={styles.addButton} onClick={handleAddBudget}>
          예산 추가하기
        </button>
        <div className={styles.budgetSummary}>
          <h3>예산 금액</h3>
          {budgets.map((budget, index) => (
            <div key={index} className={styles.budgetDetail}>
              <span>{budget.type === "shared" ? "공동경비" : "개인경비"}</span>
              <span>
                {budget.currency} {budget.amount}
              </span>
              <span>USD 1.00 = KRW {budget.exchangeRate}</span>
            </div>
          ))}
          <div className={styles.totalBudget}>
            총 예산 금액 : <span>{/* Total amount logic here */}</span>
          </div>
        </div>
        <button className={styles.registerButton} onClick={handleRegister}>
          등록
        </button>
      </div>
    </div>
  );
};
export default AddBudget;
