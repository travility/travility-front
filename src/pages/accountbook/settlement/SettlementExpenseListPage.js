import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../../styles/accountbook/settlement/SettlementMain.module.css';
import { Button } from '../../../styles/common/StyledComponents';
import { formatNumberWithCommas } from '../../../util/calcUtils';
import UpdateExpense from '../detail/UpdateExpenseModal';
import { SERVER_URL } from '../../../config/apiConfig';

const categoryImages = {
  TRANSPORTATION: 'transportation.png',
  ACCOMMODATION: 'accommodation.png',
  FOOD: 'food.png',
  TOURISM: 'tourism.png',
  SHOPPING: 'shopping.png',
  OTHERS: 'others.png',
};

const SettlementExpenseListPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const accountBook = state?.accountBook;
  const [groupedExpenses, setGroupedExpenses] = useState({});
  const [isUpdateExpenseModalOpen, setIsUpdateExpenseModalOpen] =
    useState(false);
  const [selectedExpense, setSelectedExpense] = useState();

  useEffect(() => {
    // 가계부가 있다면
    if (accountBook) {
      let sharedExpenses = accountBook.expenses
        .filter(
          //공동 경비 필터링
          (expense) => expense.isShared
        )
        .sort((a, b) => new Date(a.expenseDate) - new Date(b.expenseDate)); //날짜 오름차순 정렬

      // 지출일자별 그룹화
      const grouped = sharedExpenses.reduce((acc, expense) => {
        const date = new Date(expense.expenseDate).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(expense);
        return acc;
      }, {});
      setGroupedExpenses(grouped);
    }
  }, [accountBook]);

  if (!accountBook) {
    return <div>Loading...</div>;
  }

  const openUpdateExpense = (expense) => {
    setIsUpdateExpenseModalOpen(true);
    setSelectedExpense(expense);
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className={styles.settlementExpenseListPage}>
        <div className={styles.settlementExpenseListPage_header}>
          <Button className={styles.goBackButton} onClick={goBack}>
            <p className={styles.goBackButton_text}>← 정산하기</p>
          </Button>
        </div>
        <div className={styles.expenseList_container}>
          <h2 className={styles.accountBook_title}>{accountBook.title}</h2>
          <div className={styles.expenseList}>
            {Object.keys(groupedExpenses).length === 0 ? (
              <p className={styles.noExpenses}>지출 내역이 없습니다.</p>
            ) : (
              Object.keys(groupedExpenses).map((date, index) => (
                <div key={index}>
                  <div className={styles.expenseDate}>{date}</div>
                  {groupedExpenses[date].map((expense, idx) => (
                    <div
                      key={idx}
                      className={styles.expenseItem}
                      onClick={() => openUpdateExpense(expense)}
                    >
                      <img
                        className={styles.categoryImg}
                        src={`/images/accountbook/category/${
                          categoryImages[expense.category] || 'others.png'
                        }`}
                        alt={expense.category}
                      />
                      <span className={styles.currency}>{expense.curUnit}</span>
                      <span className={styles.amount}>
                        {formatNumberWithCommas(expense.amount)}
                      </span>
                      <span className={styles.title2}>{expense.title}</span>
                      <img
                        className={styles.expenseImg}
                        src={
                          expense.imgName
                            ? `${SERVER_URL}/images/${expense.imgName}`
                            : '/images/dashboard/default_image.png'
                        }
                        alt="지출 이미지"
                      />
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {isUpdateExpenseModalOpen && (
        <UpdateExpense
          isOpen={isUpdateExpenseModalOpen}
          onClose={() => setIsUpdateExpenseModalOpen(false)}
          isSettlement={true}
          expense={selectedExpense}
          accountBook={accountBook}
        />
      )}
    </>
  );
};

export default SettlementExpenseListPage;
