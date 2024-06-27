import React, { useState } from "react";
import ExpenseItem from "./ExpenseItem";
import styles from "../../../styles/accountbook/AccountBookDetail.module.css";

const ExpenseList = ({ expenses = [] }) => {
  const [filter, setFilter] = useState("all");

  const groupedExpenses = expenses.reduce((acc, expense) => {
    const date = new Date(expense.expenseDate).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(expense);
    return acc;
  }, {});

  const filteredExpenses = Object.keys(groupedExpenses).reduce((acc, date) => {
    const filtered = groupedExpenses[date].filter((expense) => {
      if (filter === "all") return true;
      if (filter === "shared" && expense.isShared) return true;
      if (filter === "personal" && !expense.isShared) return true;
      return false;
    });

    if (filtered.length > 0) {
      acc[date] = filtered;
    }

    return acc;
  }, {});

  return (
    <div className={styles.expenseListContainer}>
      <div className={styles.filterButtons}>
        <button
          className={filter === "all" ? styles.selectedButton : ""}
          onClick={() => setFilter("all")}
        >
          모두보기
        </button>
        <button
          className={filter === "shared" ? styles.selectedButton : ""}
          onClick={() => setFilter("shared")}
        >
          공동경비
        </button>
        <button
          className={filter === "personal" ? styles.selectedButton : ""}
          onClick={() => setFilter("personal")}
        >
          개인경비
        </button>
      </div>
      <div className={styles.expenseList}>
        {Object.keys(filteredExpenses).map((date, index) => (
          <div key={index}>
            <div className={styles.expenseDate}>{date}</div>
            {filteredExpenses[date].map((expense, idx) => (
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
    </div>
  );
};

export default ExpenseList;
