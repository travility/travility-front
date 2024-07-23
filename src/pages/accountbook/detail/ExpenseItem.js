import React, { useState } from 'react';
import styles from '../../../styles/accountbook/AccountBookDetail.module.css';
import UpdateExpense from '../../../components/UpdateExpense';
import { formatNumberWithCommas } from '../../../util/calcUtils';

const categoryImages = {
  TRANSPORTATION: 'transportation.png',
  ACCOMMODATION: 'accommodation.png',
  FOOD: 'food.png',
  TOURISM: 'tourism.png',
  SHOPPING: 'shopping.png',
  OTHERS: 'others.png',
};

const ExpenseItem = ({ expense, accountBook }) => {
  const [imgError, setImgError] = useState(false);
  const categoryImage = categoryImages[expense.category] || 'others.png';
  const [isUpdateExpenseModalOpen, setIsUpdateExpenseModalOpen] =
    useState(false);

  return (
    <>
      <div
        className={styles.expenseItem}
        onClick={() => setIsUpdateExpenseModalOpen(true)}
      >
        <span className={styles.type}>
          {expense.isShared ? '공동' : '개인'}
        </span>
        <img
          className={styles.categoryImg}
          src={`/images/accountbook/category/${categoryImage}`}
          alt={expense.category}
        />
        <span className={styles.currency}>{expense.curUnit}</span>
        <span className={styles.amount}>
          {formatNumberWithCommas(expense.amount)}
        </span>
        <span className={styles.description}>{expense.title}</span>
        {imgError || !expense.imgName ? (
          <img
            className={styles.expenseImg}
            src="/images/dashboard/default_image.png"
            alt="지출 이미지"
          ></img>
        ) : (
          <img
            className={styles.expenseImg}
            src={`http://localhost:8080/images/${expense.imgName}`}
            alt="지출 이미지"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      {isUpdateExpenseModalOpen && (
        <UpdateExpense
          isOpen={isUpdateExpenseModalOpen}
          onClose={() => setIsUpdateExpenseModalOpen(false)}
          expense={expense}
          accountBook={accountBook}
        />
      )}
    </>
  );
};

export default ExpenseItem;
