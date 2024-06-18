import React from "react";
import ExpenseItem from "./ExpenseItem";
import styles from "../../../styles/accountbook/AccountBookMain.module.css";

const ExpenseList = ({ expenses }) => {
  const groupedExpenses = expenses.reduce((acc, expense) => {
    const date = new Date(expense.expenseDate).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(expense);
    return acc;
  }, {});

  return (
    <div className={styles.expenseList}>
      {Object.keys(groupedExpenses).map((date, index) => (
        <div key={index}>
          <div className={styles.expenseDate}>{date}</div>
          {groupedExpenses[date].map((expense, idx) => (
            <ExpenseItem
              key={idx}
              type={expense.isShared ? "공동경비" : "개인경비"}
              category={expense.category}
              currency={expense.currency}
              amount={expense.amount}
              description={expense.title}
              imgName={expense.imgName}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;
