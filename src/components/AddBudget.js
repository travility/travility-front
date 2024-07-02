import React, { useState, useEffect } from "react";
import styles from "../styles/components/AddBudget.module.css";
import { fetchCurrencyCodes, fetchExchangeRate } from "../api/budgetApi";

const AddBudget = ({ isOpen, onClose, onSubmit, initialBudgets }) => {
  const [budgetType, setBudgetType] = useState("shared");
  const [currency, setCurrency] = useState("KRW");
  const [amount, setAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState("1.00");
  const [budgets, setBudgets] = useState(initialBudgets || []);
  const [currencies, setCurrencies] = useState([]);
  const [amountError, setAmountError] = useState("");
  const [exchangeRateError, setExchangeRateError] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const loadCurrencyCodes = async () => {
      try {
        const data = await fetchCurrencyCodes();
        if (data && data.supported_codes) {
          setCurrencies(data.supported_codes);
        }
      } catch (error) {
        alert("화폐 코드를 불러오는 중 오류가 발생했습니다.");
      }
    };

    loadCurrencyCodes();
  }, []);

  useEffect(() => {
    const loadExchangeRate = async () => {
      if (currency) {
        try {
          const data = await fetchExchangeRate(currency);
          if (data && data.conversion_rates && data.conversion_rates.KRW) {
            setExchangeRate(data.conversion_rates.KRW.toFixed(2));
          } else {
            setExchangeRate("1.00");
          }
        } catch (error) {
          setExchangeRate("1.00");
        }
      }
    };

    loadExchangeRate();
  }, [currency]);

  const handleAddBudget = () => {
    if (!amount) {
      setAmountError("금액을 입력하세요.");
      return;
    }
    if (!exchangeRate) {
      setExchangeRateError("환율을 입력하세요.");
      return;
    }
    const newBudget = {
      isShared: budgetType === "shared",
      curUnit: currency,
      amount: parseFloat(amount).toFixed(2),
      exchangeRate,
    };
    setBudgets([...budgets, newBudget]);
    resetForm();
  };

  const handleEditBudget = () => {
    if (!amount) {
      setAmountError("금액을 입력하세요.");
      return;
    }
    if (!exchangeRate) {
      setExchangeRateError("환율을 입력하세요.");
      return;
    }
    const updatedBudgets = budgets.map((budget, index) =>
      index === editIndex
        ? {
            ...budget,
            isShared: budgetType === "shared",
            curUnit: currency,
            amount: parseFloat(amount).toFixed(2),
            exchangeRate,
          }
        : budget
    );
    setBudgets(updatedBudgets);
    resetForm();
  };

  const handleDeleteBudget = () => {
    const updatedBudgets = budgets.filter((_, index) => index !== editIndex);
    setBudgets(updatedBudgets);
    resetForm();
  };

  const handleRegister = () => {
    onSubmit(budgets);
    onClose();
  };

  const calculateTotalAmount = () => {
    return budgets
      .reduce((total, budget) => {
        const budgetAmount = parseFloat(budget.amount) || 0;
        const budgetExchangeRate = parseFloat(budget.exchangeRate) || 1;
        return total + budgetAmount * budgetExchangeRate;
      }, 0)
      .toFixed(2);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(value)) {
      setAmountError("");
      setAmount(value);
    } else {
      setAmountError("숫자를 입력하세요.");
    }
  };

  const handleExchangeRateChange = (e) => {
    const value = e.target.value;
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(value)) {
      setExchangeRateError("");
      setExchangeRate(value);
    } else {
      setExchangeRateError("숫자를 입력하세요.");
    }
  };

  const handleBudgetClick = (index) => {
    const budget = budgets[index];
    setBudgetType(budget.isShared ? "shared" : "personal");
    setCurrency(budget.curUnit);
    setAmount(budget.amount.toString());
    setExchangeRate(budget.exchangeRate.toString());
    setEditIndex(index);
  };

  const resetForm = () => {
    setBudgetType("shared");
    setCurrency("KRW");
    setAmount("");
    setExchangeRate("1.00");
    setEditIndex(null);
    setAmountError("");
    setExchangeRateError("");
  };

  return (
    <>
      {isOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div className={styles.modalHeader_title}>예산 등록</div>
              <button className={styles.closeButton} onClick={onClose}>
                &times;
              </button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.radioGroup}>
                <div className={styles.budgetType}>
                  <label>
                    <input
                      type="radio"
                      id="budgetTypeShared"
                      name="budgetType"
                      value="shared"
                      checked={budgetType === "shared"}
                      onChange={() => setBudgetType("shared")}
                    />
                    공동경비
                  </label>
                  <label>
                    <input
                      type="radio"
                      id="budgetTypePersonal"
                      name="budgetType"
                      value="personal"
                      checked={budgetType === "personal"}
                      onChange={() => setBudgetType("personal")}
                    />
                    개인경비
                  </label>
                </div>
              </div>
              <div className={styles.addFormContainer}>
                <div className={styles.formGroup}>
                  <div className={styles.formGroupRow}>
                    <label htmlFor="currency">화폐</label>
                    <select
                      id="currency"
                      name="currency"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      {currencies.map(([code, name]) => (
                        <option key={code} value={code}>
                          {name} ({code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <div className={styles.formGroupRow}>
                    <label htmlFor="amount">금액</label>
                    <input
                      id="amount"
                      name="amount"
                      type="text"
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder="금액 입력"
                    />
                  </div>
                  {amountError && (
                    <span className={styles.error}>{amountError}</span>
                  )}
                </div>
              </div>
              <div className={styles.exchangeRateContainer}>
                <div className={styles.formGroup}>
                  <div className={styles.formGroupRow}>
                    <label htmlFor="exchangeRate">{currency} 1.00 = KRW</label>
                    <input
                      id="exchangeRate"
                      name="exchangeRate"
                      type="text"
                      value={exchangeRate}
                      onChange={handleExchangeRateChange}
                    />
                  </div>
                  {exchangeRateError && (
                    <span className={styles.error}>{exchangeRateError}</span>
                  )}
                </div>
              </div>
              <div className={styles.buttonContainer}>
                <button
                  className={styles.addButton}
                  onClick={
                    editIndex !== null ? handleEditBudget : handleAddBudget
                  }
                >
                  {editIndex !== null ? "수정" : "예산 추가하기"}
                </button>
                {editIndex !== null && (
                  <button
                    className={styles.deleteButton}
                    onClick={handleDeleteBudget}
                  >
                    삭제
                  </button>
                )}
              </div>
              <div className={styles.budgetSummary}>
                <h3>예산 금액</h3>
                <div className={styles.budgetDetailContainer}>
                  {budgets.map((budget, index) => (
                    <div
                      key={index}
                      className={styles.budgetDetail}
                      onClick={() => handleBudgetClick(index)}
                    >
                      <span>{budget.isShared ? "공동경비" : "개인경비"}</span>
                      <span>
                        {budget.curUnit} {parseFloat(budget.amount).toFixed(2)}
                      </span>
                      <span>
                        {budget.curUnit} 1.00 = KRW {budget.exchangeRate}
                      </span>
                    </div>
                  ))}
                </div>
                <div className={styles.totalBudget}>
                  총 예산 금액 : <span>KRW {calculateTotalAmount()}</span>
                </div>
              </div>
              <button
                className={styles.registerButton}
                onClick={handleRegister}
              >
                등록
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddBudget;
