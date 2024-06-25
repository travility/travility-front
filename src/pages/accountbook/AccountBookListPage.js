import React from 'react';
import { useNavigate } from 'react-router-dom';
import CountryFlags from '../../components/CountryFlags';
import styles from '../../styles/accountbook/AccountBookListPage.module.css';


const dummyData = [
  { id: 1, title: '서울 여행', startDate: '2024-06-07', endDate: '2024-06-11', amount: 'KRW 1,000,000', country: 'KR', imgName: '/images/account/seoul.jpeg' },
  { id: 2, title: '호주', startDate: '2024-04-17', endDate: '2024-04-22', amount: 'KRW 3,652,500', country: 'AU', imgName: '' },
  { id: 3, title: '일본', startDate: '2024-05-01', endDate: '2024-05-05', amount: 'KRW 1,500,000', country: 'JP', imgName: '' },
  { id: 4, title: '몽골', startDate: '2024-07-10', endDate: '2024-07-15', amount: 'KRW 2,000,000', country: 'MN', imgName: '' },
  { id: 5, title: '스위스', startDate: '2024-08-01', endDate: '2024-08-10', amount: 'KRW 4,000,000', country: 'CH', imgName: '' },
  { id: 6, title: '영국', startDate: '2024-09-05', endDate: '2024-09-12', amount: 'KRW 3,200,000', country: 'GB', imgName: '' },
];

const AccountBookListPage = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/addaccountbookpage');
  };


  return (
    <div className={styles.accountBook_list_page}>
      
      <div className={styles.accountBook_list_header}>
        <div className={styles.accountBook_list_header_container}>
          <p className={styles.accountBook_list_header_total}>전체 가계부</p>
          <div className={styles.accountBook_list_header_total_line}></div>
        </div>
          <button 
          onClick={handleHomeClick}
          className={styles.accountBook_list_home_button}
          >홈으로 돌아가기
          </button>
      </div>

      <div className={styles.accountBook_list_grid_container}>
        {dummyData.map((book) => (
          <div key={book.id} 
          className={styles.accountBook_list_grid_item}
          style={{ 
            backgroundImage: `url(${book.imgName || '/public/images/dafault.jpg'})`
           }}
          onClick={()=> navigate(`/accountbook/main/:id`)}
          alt={book.title} 
          >
                <div className={styles.accountBook_list_info}>
                  <span className={styles.accountBook_list_title}>
                    {/* <div>국기 표시 영역</div> - 추후 수정 */}
                    {book.title}
                    </span>
                  <span className={styles.accountBook_list_dates}>
                    {`${book.startDate} ~ ${book.endDate}`}</span>
                  </div>
                  <span className={styles.accountBook_list_amount}>{book.amount}</span>
          </div>
        ))}
      </div>
    </div>      
      );
};


export default AccountBookListPage;
