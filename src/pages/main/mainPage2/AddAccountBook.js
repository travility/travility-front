import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchCountry from '../../../components/SearchCountry';
import AddBudget from '../../../components/AddBudget';
import styles from '../../../styles/main/mainPage2/AddAccountBook.module.css';
import { addAccountBook } from '../../../api/accountbookApi';

const AddAccountBook = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errorDate, setErrorDate] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState('');
  const [countryName, setCountryName] = useState('');
  const [countryFlag, setCountryFlag] = useState('');
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [budget, setBudget] = useState('');
  const [budgets, setBudgets] = useState([]);
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState(''); //글자수 에러 메세지
  const [inputCount, setInputCount] = useState(0); //글자수 변경 카운트
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  //여행 추가
  const handleAddAccountBook = async () => {
    const errors = {};

    if (!startDate) errors.startDate = '여행 시작일을 입력해주세요.';
    if (!endDate) errors.endDate = '여행 종료일을 입력해주세요.';
    if (!numberOfPeople) errors.numberOfPeople = '여행 인원을 입력해주세요.';
    if (!countryName) errors.countryName = '여행지를 선택해주세요.';
    if (!budget) errors.budget = '예산을 입력해주세요.';
    if (!title) errors.title = '여행의 이름을 입력해주세요.';

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const accountBookData = {
      startDate,
      endDate,
      countryName,
      countryFlag,
      numberOfPeople: parseInt(numberOfPeople),
      title,
      budgets,
    };

    console.log('전송되는 데이터:', accountBookData); // 데이터 확인

    try {
      const accountBookResponse = await addAccountBook(accountBookData);
      console.log(accountBookResponse);
      navigate(`/accountbook/detail/${accountBookResponse.id}`);
    } catch (error) {
      console.error('가계부 추가 중 오류가 발생했습니다:', error);
    }
  };

  //여행 국가
  const handleCountrySelect = (country) => {
    setCountryName(country.country_nm);
    setCountryFlag(country.download_url);
  };

  //예산 제출
  const handleBudgetSubmit = (budgets) => {
    setBudgets(budgets);
    // 총 예산 금액
    const totalBudget = budgets.reduce(
      (sum, budget) =>
        sum + parseFloat(budget.amount) * parseFloat(budget.exchangeRate),
      0
    );
    setBudget(totalBudget.toLocaleString());
  };

  //여행 시작일
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    if (endDate && newStartDate > endDate) {
      setEndDate(newStartDate);
    }
  };

  //여행 종료일
  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    if (newEndDate < startDate) {
      setErrorDate('여행 시작일 이전 날짜는 선택할 수 없습니다.');
    } else {
      setEndDate(newEndDate);
      setErrorDate('');
    }
  };

  //인원 수
  const handleNumberOfPeopleChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 0) {
      setNumberOfPeople(value);
    }
  };

  //여행제목 글자수 제한
  const handleTitleChange = (e) => {
    const input = e.target.value;

    if (input.length <= 22) {
      setTitle(input);
      setTitleError('');
    } else {
      setTitleError('제목은 공백 포함 22 글자까지 입력 가능합니다.');
    }

    setInputCount(input.length); // 글자 수를 inputCount에 저장
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
              onChange={handleStartDateChange}
              required
            />
            <span>~</span>
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              required
            />
          </div>
          {errorDate && (
            <p className={styles.addAccount_errorDate}>{errorDate}</p>
          )}
          {formErrors.startDate && (
            <p className={styles.addAccount_errorDate}>
              {formErrors.startDate}
            </p>
          )}
          {formErrors.endDate && (
            <p className={styles.addAccount_errorDate}>{formErrors.endDate}</p>
          )}
        </div>
        <div className={styles.addAccount_formGroup}>
          <label>몇 명이서 떠나시나요?</label>
          <input
            type="number"
            value={numberOfPeople}
            onChange={handleNumberOfPeopleChange}
            placeholder="인원 입력"
            min="1"
            required
          />
          {formErrors.numberOfPeople && (
            <p className={styles.addAccount_errorDate}>
              {formErrors.numberOfPeople}
            </p>
          )}
        </div>
        <div className={styles.addAccount_formGroup}>
          <label>어디로 떠나시나요?</label>
          {/* <Destination onCountrySelect={handleCountrySelect} /> */}
          <div
            className={styles.selectedCountryInput}
            onClick={() => setIsCountryModalOpen(true)}
          >
            {countryName ? (
              <>
                <img
                  src={countryFlag}
                  alt={countryName}
                  className={styles.flag}
                />
                <span>{countryName}</span>
              </>
            ) : (
              <input
                type="text"
                placeholder="여행지 선택"
                readOnly
                className={styles.searchInput}
              />
            )}
            <button
              className={styles.searchButton}
              onClick={() => setIsCountryModalOpen(true)}
            >
              <img src="/images/main/mainPage/search_br.png" alt="Search" />
            </button>
          </div>
          {formErrors.countryName && (
            <p className={styles.addAccount_errorDate}>
              {formErrors.countryName}
            </p>
          )}
        </div>
        <div className={styles.addAccount_formGroup}>
          <label>예산은 얼마인가요?</label>
          <input
            type="text"
            value={budget}
            readOnly
            placeholder="금액 입력"
            onClick={() => setIsBudgetModalOpen(true)}
            required
          />
          {formErrors.budget && (
            <p className={styles.addAccount_errorDate}>{formErrors.budget}</p>
          )}
        </div>
        <div className={styles.addAccount_formGroup}>
          <label>여행의 이름을 정해주세요.</label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="제목 입력"
            maxLength="22"
            required
          />
          <div className={styles.addAccount_title_container}>
            <span className={styles.addAccount_title_error}>{titleError}</span>
            <span className={styles.addAccount_title_count}>
              {inputCount}/22 자
            </span>
          </div>
          {formErrors.title && (
            <p className={styles.addAccount_errorDate}>{formErrors.title}</p>
          )}
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
      {isCountryModalOpen && (
        <SearchCountry
          onSelectCountry={handleCountrySelect}
          closeModal={() => setIsCountryModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AddAccountBook;
