import React, { useState, useEffect } from "react";
import styles from "../styles/components/AddBudget.module.css";
import Select from "react-select";
import { selectStyles } from "../util/CustomStyles";
import { fetchCurrencyCodes, fetchExchangeRate } from "../api/budgetApi";
import {
  ModalOverlay,
  Modal,
  ModalHeader,
  CloseButton,
  Button,
  ErrorMessage,
  Input,
} from "../styles/StyledComponents";
import { formatNumberWithCommas } from "../util/calcUtils";

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
          setCurrencies(
            data.supported_codes.map(([code, name]) => ({
              value: code,
              label: `${name} (${code})`,
            }))
          );
          if (!currency) {
            setCurrency(data.supported_codes[0][0]); // 초기 기본값 설정
          }
        }
      } catch (error) {
        alert("화폐 코드를 불러오는 중 오류가 발생했습니다.");
      }
    };

    loadCurrencyCodes();
  }, [currency]);

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
    const remainingBudgets = budgets.filter((_, index) => index !== editIndex);
    const expenseCurrencies = new Set(
      remainingBudgets.map((budget) => budget.curUnit)
    );
    if (expenseCurrencies.size < 1) {
      alert("지출에 사용된 화폐 코드는 최소한 하나는 존재해야 합니다.");
      return;
    }
    setBudgets(remainingBudgets);
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
    setCurrency(currencies[0] ? currencies[0].value : "KRW");
    setAmount("");
    setExchangeRate("1.00");
    setEditIndex(null);
    setAmountError("");
    setExchangeRateError("");
  };

  const customSelectStyles = {
    ...selectStyles,
    control: (base) => ({
      ...base,
      width: "100%",
    }),

    valueContainer: (base) => ({
      ...base,
      padding: "0.2rem 0.5rem",
      margin: "0 auto",
    }),

    singleValue: (base) => ({
      ...base,
      fontSize: "0.7em",
      fontWeight: "600",
    }),
  };

  return (
    <>
      {isOpen && (
        <ModalOverlay>
          <Modal>
            <ModalHeader>
              <h4>예산 등록</h4>
              <CloseButton onClick={onClose}>&times;</CloseButton>
            </ModalHeader>
            <div className={styles.modal_content}>
              <div className={styles.addBudget_form}>
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

                <div className={styles.addBudget_formGroup}>
                  <div className={styles.currency}>
                    <label htmlFor="currency">화폐</label>
                    <Select
                      id="currency"
                      name="currency"
                      styles={customSelectStyles}
                      value={currencies.find((c) => c.value === currency)}
                      onChange={(selectedOption) =>
                        setCurrency(selectedOption.value)
                      }
                      options={currencies}
                      isDisabled={editIndex !== null}
                    />
                  </div>
                </div>
                <div className={styles.addBudget_formGroup}>
                  <label htmlFor="amount">금액</label>
                  <Input
                    id="amount"
                    name="amount"
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="금액 입력"
                  />
                </div>
                <div className="error_container">
                  {amountError && <ErrorMessage>{amountError}</ErrorMessage>}
                </div>

                <div className={styles.addBudget_formGroup}>
                  <label htmlFor="exchangeRate">
                    환율
                    <span className={styles.exchangeRate_label}>
                      {currency} 1.00 = KRW
                    </span>
                  </label>
                  <Input
                    id="exchangeRate"
                    name="exchangeRate"
                    type="text"
                    value={exchangeRate}
                    onChange={handleExchangeRateChange}
                  />
                </div>
                <div className="error_container">
                  {exchangeRateError && (
                    <ErrorMessage>{exchangeRateError}</ErrorMessage>
                  )}
                </div>
              </div>
              <div className={styles.button_container}>
                <Button
                  className={styles.add_button}
                  onClick={
                    editIndex !== null ? handleEditBudget : handleAddBudget
                  }
                >
                  {editIndex !== null ? "수정" : "예산 추가하기"}
                </Button>
                {editIndex !== null && (
                  <Button
                    className={styles.delete_button}
                    onClick={handleDeleteBudget}
                  >
                    삭제
                  </Button>
                )}
              </div>
              <div className={styles.budget_summary}>
                <h3>예산 금액</h3>
                <div className={styles.budget_detail_container}>
                  {budgets.map((budget, index) => (
                    <div
                      key={index}
                      className={styles.budget_detail}
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
                  총 예산 금액 :{" "}
                  <span>
                    KRW {formatNumberWithCommas(calculateTotalAmount())}
                  </span>
                </div>
              </div>
              <Button
                className={styles.registerButton}
                onClick={handleRegister}
              >
                등록
              </Button>
            </div>
          </Modal>
        </ModalOverlay>
      )}
    </>
  );
};

export default AddBudget;
