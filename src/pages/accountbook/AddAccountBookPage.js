import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/accountbook/AddAccountBookPage.module.css';
// src\styles\accountbook\AccountBookPage.module.css

const AddAccountBookPage = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [country, setCountry] = useState('');
  const [totalBudget, setTotalBudget] = useState('');
  const [tripName, setTripName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
  }, []);

  const handleAddAccountBook = () => {
    // 여기에 가계부 추가 로직을 구현하세요
    navigate('/accountbook/main');
  };

  const handleViewAllAccountBooks = () => {
    navigate('/addaccountbookpage');
  };

  const handleViewMyCalendar = () => {
    navigate('/mycalendar');
  };

  const handleViewMyReport = () => {
    navigate('/myreport');
  };

  return (
    <div className={styles.addaccountbook_page}>
      <h2>계획 중이신 여행에 대해 알려주세요.</h2>
      <div className={styles.form_group}>
        <label className={styles.label}>언제 떠나시나요?</label>
        <input
          type="date"
          className={styles.input}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className={styles.input}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div className={styles.form_group}>
        <label className={styles.label}>몇 명이서 떠나시나요?</label>
        <input
          type="number"
          className={styles.input}
          value={numberOfPeople}
          onChange={(e) => setNumberOfPeople(e.target.value)}
          min="1"
        />
      </div>
      <div className={styles.form_group}>
        <label className={styles.label}>어디로 떠나시나요?</label>
        <input
          type="text"
          className={styles.input}
          placeholder="여행지 선택"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
      </div>
      <div className={styles.form_group}>
        <label className={styles.label}>예산은 얼마인가요?</label>
        <input
          type="number"
          className={styles.input}
          placeholder="금액"
          value={totalBudget}
          onChange={(e) => setTotalBudget(e.target.value)}
        />
      </div>
      <div className={styles.form_group}>
        <label className={styles.label}>여행의 이름을 정해주세요.</label>
        <input
          type="text"
          className={styles.input}
          placeholder="제목 입력"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
        />
      </div>
      <button className={styles.button} onClick={handleAddAccountBook}>새 가계부 추가</button>
      <button className={styles.button} onClick={handleViewAllAccountBooks}>전체 가계부 보기</button>
      <button className={styles.button} onClick={handleViewMyCalendar}>내 캘린더</button>
      <button className={styles.button} onClick={handleViewMyReport}>마이 리포트</button>
    </div>
  );
};

export default AddAccountBookPage;
