import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/accountbook/AccountBookListPage.module.css';

const dummyData = [
  { id: 1, country: '서울', startDate: '2024-06-07', endDate: '2024-06-11', amount: 'KRW 652,500', image: null },
  { id: 2, country: '호주', startDate: '2024-04-17', endDate: '2024-04-22', amount: 'KRW 3,652,500', image: '호주 이미지 경로' },
  { id: 3, country: '일본', startDate: '2024-05-01', endDate: '2024-05-05', amount: 'KRW 1,500,000', image: '일본 이미지 경로' },
  { id: 4, country: '몽골', startDate: '2024-07-10', endDate: '2024-07-15', amount: 'KRW 2,000,000', image: '몽골 이미지 경로' },
  { id: 5, country: '스위스', startDate: '2024-08-01', endDate: '2024-08-10', amount: 'KRW 4,000,000', image: '스위스 이미지 경로' },
  { id: 6, country: '영국', startDate: '2024-09-05', endDate: '2024-09-12', amount: 'KRW 3,200,000', image: '영국 이미지 경로' },
];

const AccountBookListPage = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/addaccountbookpage');
  };

  return (
    <div className={styles.accountBookPage}>
      <div className={styles.header}>
        <h2>전체 가계부</h2>
        <button onClick={handleBackClick}>홈으로 돌아가기</button>
      </div>
      <div className={styles.gridContainer}>
        {dummyData.map((book) => (
          <div key={book.id} className={styles.gridItem}>
            <img src={book.image || '디폴트 이미지 경로'} alt={book.country} className={styles.image} />
            <div className={styles.info}>
              <span>{book.country}</span>
              <span>{`${book.startDate} ~ ${book.endDate}`}</span>
              <span>{book.amount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountBookListPage;
