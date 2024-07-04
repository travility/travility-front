import React, { useState, useEffect } from "react";
import ExpenseItem from "./ExpenseItem";
import styles from "../../../styles/accountbook/AccountBookDetail.module.css";
import { Button } from "../../../styles/StyledComponents";

const ExpenseList = ({ expenses = [] }) => {
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    console.log(expenses);
  });

  // 지출 그룹화
  const groupedExpenses = expenses.reduce((acc, expense) => {
    const date = new Date(expense.expenseDate).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(expense);
    return acc;
  }, {});

  // 지출 필터링
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
        <Button
          className={filter === "all" ? styles.selectedButton : ""}
          onClick={() => setFilter("all")}
        >
          모두보기
        </Button>
        <Button
          className={filter === "shared" ? styles.selectedButton : ""}
          onClick={() => setFilter("shared")}
        >
          공동경비
        </Button>
        <Button
          className={filter === "personal" ? styles.selectedButton : ""}
          onClick={() => setFilter("personal")}
        >
          개인경비
        </Button>
      </div>
      <div className={styles.expenseList}>
        {Object.keys(filteredExpenses).length === 0 ? (
          <p className={styles.noExpenses}>지출 내역이 없습니다.</p>
        ) : (
          Object.keys(filteredExpenses).map((date, index) => (
            <div key={index}>
              <div className={styles.expenseDate}>{date}</div>
              {filteredExpenses[date].map((expense, idx) => (
                <ExpenseItem key={idx} expense={expense} />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
