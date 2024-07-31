import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchCountry from '../common/SearchCountryModal';
import AddBudget from '../accountbook/detail/AddBudgetModal';
import styles from '../../styles/main/MainPage.module.css';
import { addAccountBook } from '../../api/accountbookApi';
import {
  Button,
  ErrorMessage,
  Input,
  DateInput as OriginalDateInput,
} from '../../styles/common/StyledComponents';
import {
  handleFailureSubject,
  handleSuccessSubjectNotReload,
} from '../../util/swalUtils';
import styled from 'styled-components';

//달력 모양 색깔만 변경
const DateInput = styled(OriginalDateInput)`
  &::-webkit-calendar-picker-indicator {
    filter: invert(53%) sepia(93%) saturate(1462%) hue-rotate(200deg)
      brightness(91%) contrast(104%) !important;
  }
`;

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
  const [titleError, setTitleError] = useState(''); // 글자수 에러 메세지
  const [inputCount, setInputCount] = useState(0); // 글자수 변경 카운트
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  //모달 위치 동적 계산
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const inputRef = useRef(null);

  // 여행 추가
  const handleAddAccountBook = async () => {
    const errors = {};

    if (!startDate || !endDate) errors.dateRange = '여행일정을 입력해주세요.';
    if (endDate < startDate)
      errors.dateRange = '여행 시작일 이전 날짜는 선택할 수 없습니다.';
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
      numberOfPeople: numberOfPeople === '' ? '' : parseInt(numberOfPeople, 10),
      title,
      budgets,
    };

    try {
      const accountBookResponse = await addAccountBook(accountBookData);
      console.log(accountBookResponse);
      handleSuccessSubjectNotReload(
        '가계부',
        '추가',
        navigate,
        `/accountbook/detail/${accountBookResponse.id}`
      );
    } catch (error) {
      console.error('가계부 추가 중 오류가 발생했습니다:', error);
      handleFailureSubject('가계부', '추가');
    }
  };

  // 여행 국가
  const handleCountrySelect = (country) => {
    setCountryName(country.country_nm);
    setCountryFlag(country.download_url);
    setFormErrors((prevErrors) => ({ ...prevErrors, countryName: '' }));
    setIsCountryModalOpen(false);
  };

  // 모달 위치 동적 계산
  const handleOpenCountryModal = () => {
    if (inputRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      let leftPosition = inputRect.left + window.scrollX;

      // 반응형 조정을 위한 예제 (화면 크기에 따라 위치 조정)
      if (viewportWidth <= 530) {
        leftPosition = inputRect.left + window.scrollX;
      } else if (viewportWidth >= 531 && viewportWidth <= 860) {
        leftPosition = inputRect.left + window.scrollX;
      } else if (viewportWidth >= 861 && viewportWidth <= 1024) {
        leftPosition = inputRect.left + window.scrollX - 5;
      } else {
        leftPosition = inputRect.left + window.scrollX - 250;
      }

      setModalPosition({
        top: inputRect.bottom + window.scrollY - 18,
        left: leftPosition,
      });
    }
    setIsCountryModalOpen(true);
  };

  // 예산 제출
  const handleBudgetSubmit = (budgets) => {
    setBudgets(budgets);
    const totalBudget = budgets.reduce(
      (sum, budget) =>
        sum + parseFloat(budget.amount) * parseFloat(budget.exchangeRate),
      0
    );
    setBudget(totalBudget.toLocaleString());
    setFormErrors((prevErrors) => ({ ...prevErrors, budget: '' }));
  };

  // 여행 시작일
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    if (endDate && newStartDate > endDate) {
      setEndDate(newStartDate);
    }
    setFormErrors((prevErrors) => ({ ...prevErrors, dateRange: '' }));
  };

  // 여행 종료일
  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    if (newEndDate < startDate) {
      setErrorDate('여행 시작일 이전 날짜는 선택할 수 없습니다.');
    } else {
      setEndDate(newEndDate);
      setErrorDate('');
    }
    setFormErrors((prevErrors) => ({ ...prevErrors, dateRange: '' }));
  };

  // 인원 수
  const handleNumberOfPeopleChange = (e) => {
    const value = e.target.value;
    if (value === '' || (/^\d*$/.test(value) && parseInt(value, 10) >= 1)) {
      setNumberOfPeople(value);
      setFormErrors((prevErrors) => ({ ...prevErrors, numberOfPeople: '' }));
    } else {
      setFormErrors((prevErrors) => ({ ...prevErrors, numberOfPeople: '' }));
    }
  };

  // 여행 제목 글자수 제한
  const handleTitleChange = (e) => {
    const input = e.target.value;

    if (input.length <= 20) {
      setTitle(input);
      setTitleError('');
    } else {
      setTitleError('제목은 공백 포함 20 글자까지 입력 가능합니다.');
    }

    setInputCount(input.length > 20 ? 20 : input.length);
    setFormErrors((prevErrors) => ({ ...prevErrors, title: '' }));
  };

  return (
    <div className="wrapper">
      <h3 className={styles.addAccount_form_title}>
        계획 중이신 여행에 대해 알려주세요.
      </h3>
      <form className={styles.addAccount_form}>
        <div className={styles.addAccount_formGroup}>
          <label>언제 떠나시나요?</label>
          <div className={styles.addAccount_dateRange}>
            <DateInput
              value={startDate}
              onChange={handleStartDateChange}
              required
            />
            <span>~</span>
            <DateInput
              value={endDate}
              onChange={handleEndDateChange}
              required
            />
          </div>
          <div className="error_container">
            {errorDate && <ErrorMessage>{errorDate}</ErrorMessage>}
            {formErrors.dateRange && (
              <ErrorMessage>{formErrors.dateRange}</ErrorMessage>
            )}
          </div>
        </div>
        <div className={styles.addAccount_formGroup}>
          <label>몇 명이서 떠나시나요?</label>
          <Input
            type="text"
            value={numberOfPeople}
            onChange={handleNumberOfPeopleChange}
            placeholder="인원 입력"
            required
          />
          <div className="error_container">
            {formErrors.numberOfPeople && (
              <ErrorMessage>{formErrors.numberOfPeople}</ErrorMessage>
            )}
          </div>
        </div>
        <div className={styles.addAccount_formGroup}>
          <label>어디로 떠나시나요?</label>
          <div
            className={styles.country_input}
            onClick={handleOpenCountryModal}
            ref={inputRef}
          >
            {countryName ? (
              <div className={styles.selectedCountry}>
                <img
                  src={countryFlag}
                  alt={countryName}
                  className={styles.flag}
                />
                <span>{countryName}</span>
              </div>
            ) : (
              <Input
                ref={inputRef}
                type="text"
                placeholder="여행지 선택"
                readOnly
              />
            )}
            <button
              type="button"
              className={styles.search_button}
              onClick={handleOpenCountryModal}
            >
              <img src="/images/main/mainPage/search_br.png" alt="Search" />
            </button>
          </div>
          <div className="error_container">
            {formErrors.countryName && (
              <ErrorMessage>{formErrors.countryName}</ErrorMessage>
            )}
          </div>
        </div>
        <div className={styles.addAccount_formGroup}>
          <label>예산은 얼마인가요?</label>
          <Input
            type="text"
            value={budget}
            readOnly
            placeholder="금액 입력"
            onClick={() => setIsBudgetModalOpen(true)}
            required
          />
          <div className="error_container">
            {formErrors.budget && (
              <ErrorMessage>{formErrors.budget}</ErrorMessage>
            )}
          </div>
        </div>
        <div className={styles.addAccount_formGroup}>
          <label>여행의 이름을 정해주세요.</label>
          <Input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="제목 입력"
            maxLength="20"
            required
          />
          <div className="error_container">
            {(formErrors.title || titleError) && (
              <ErrorMessage>{formErrors.title || titleError}</ErrorMessage>
            )}
            <span className={styles.addAccount_title_count}>
              {inputCount}/20 자
            </span>
          </div>
        </div>
        <Button
          type="button"
          className={styles.addAccount_button}
          onClick={handleAddAccountBook}
        >
          새 가계부 추가
        </Button>
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
          modalPosition={modalPosition} // modalPosition을 전달
        />
      )}
    </div>
  );
};

export default AddAccountBook;
