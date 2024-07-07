import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ExpenseList from '../detail/ExpenseList';
import styles from '../../../styles/accountbook/SettlementExpenseListPage.module.css';
import { Button } from '../../../styles/StyledComponents';

const SettlementExpenseListPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const accountBook = state?.accountBook;
  const [expenses, setExpenses] = useState();

  useEffect(() => {
    if (accountBook) {
      setExpenses(accountBook.expenses);
    }
    console.log(expenses);
  }, [accountBook, expenses]);

  if (!accountBook) {
    return <div>Loading...</div>;
  }

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.SettlementExpenseListPage}>
      <div className={styles.ExpenseListContainer}>
        <div className={styles.title}>{accountBook.title}</div>
        <div className={styles.expenseList}>
          <ExpenseList expenses={expenses} settlement={true} />
        </div>
        <div>
          <Button className={styles.goBackButton} onClick={goBack}>
            돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettlementExpenseListPage;
