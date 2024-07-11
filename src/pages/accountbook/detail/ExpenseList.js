import React, { useState, useEffect } from "react";
import ExpenseItem from "./ExpenseItem";
import styles from "../../../styles/accountbook/AccountBookDetail.module.css";
import { Button } from "../../../styles/StyledComponents";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ExpenseList = ({ expenses, accountBook }) => {
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    console.log(expenses);
  }, [expenses]);

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

  const goSettlement = () => {
    if (!accountBook.expenses || accountBook.expenses.length === 0) {
      Swal.fire({
        title: "정산 실패",
        text: "정산할 지출이 없습니다",
        icon: "error",
        confirmButtonColor: "#2a52be",
      });
    } else {
      navigate(`/settlement/${accountBook.id}`);
    }
  };

  return (
    <div className={styles.expenseList_container}>
      <div className={styles.expenseList_header}>
        <div className={styles.filter_buttons}>
          <Button
            className={filter === "all" ? styles.selected_button : ""}
            onClick={() => setFilter("all")}
          >
            모두보기
          </Button>
          <Button
            className={filter === "shared" ? styles.selected_button : ""}
            onClick={() => setFilter("shared")}
          >
            공동경비
          </Button>
          <Button
            className={filter === "personal" ? styles.selected_button : ""}
            onClick={() => setFilter("personal")}
          >
            개인경비
          </Button>
        </div>
        <div className={styles.settlement_button}>
          <Button onClick={goSettlement}>정산하기</Button>
        </div>
      </div>
      <div className={styles.expenseList}>
        {Object.keys(filteredExpenses).length === 0 ? (
          <p className={styles.noExpenses}>지출 내역이 없습니다.</p>
        ) : (
          Object.keys(filteredExpenses).map((date, index) => (
            <div key={index}>
              <div className={styles.expenseDate}>{date}</div>
              {filteredExpenses[date].map((expense, idx) => (
                <ExpenseItem
                  key={idx}
                  expense={expense}
                  accountBook={accountBook}
                />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
