import React, { useState } from 'react';
import styles from '../../../styles/accountbook/TripInfo.module.css';
import Destination from '../../../components/Destination';

const TripInfo = ({ isOpen, onClose, accountBook }) => {
  const [countryName, setCountryName] = useState(accountBook.countryName);
  const [countryFlag, setCountryFlag] = useState(accountBook.countryFlag);
  const [title, setTitle] = useState(accountBook.title);
  const [startDate, setStartDate] = useState(accountBook.startDate);
  const [endDate, setEndDate] = useState(accountBook.endDate);

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    return date.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식으로 변환
  };

  const handleCountrySelect = (country) => {
    setCountryName(country.country_nm);
    setCountryFlag(country.download_url);
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleStartDate = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDate = (e) => {
    setEndDate(e.target.value);
  };

  return (
    <>
      {isOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <button className={styles.closeButton} onClick={onClose}>
                &times;
              </button>
              <div className={styles.modalHeader_title}>여행 정보</div>
            </div>
            <div className={styles.modalContent}>
              <Destination
                initialCountryName={countryName}
                initialCountryFlag={countryFlag}
                onCountrySelect={handleCountrySelect}
              />
              <input
                type="text"
                className={styles.title}
                value={title}
                onChange={handleTitle}
              ></input>

              <div className={styles.dates}>
                <input
                  type="date"
                  className={styles.startDate}
                  value={formatDate(startDate)}
                  onChange={handleStartDate}
                ></input>
                <span className={styles.separator}>~</span>
                <input
                  type="date"
                  className={styles.startDate}
                  value={formatDate(endDate)}
                  onChange={handleEndDate}
                ></input>
              </div>
              <div className={styles.imageContainer}>
                <img
                  className={styles.image}
                  src={accountBook.imageUrl}
                  alt="대표이미지"
                />
              </div>
              <button className={styles.modifyButton}>수정</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TripInfo;
