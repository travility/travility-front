import React, { useState, useEffect } from "react";
import ExpenseItem from "./ExpenseItem";
import styles from "../../../styles/accountbook/AccountBookDetail.module.css";
import { Button } from "../../../styles/StyledComponents";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ExpenseList = ({ expenses = [], settlement }) => {
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

  // 정산 모드일 때 필터링된 지출 중 공동경비인 것만 보여줌
  const settlementFilteredExpenses = Object.keys(filteredExpenses).reduce(
    (acc, date) => {
      const filtered = filteredExpenses[date].filter((expense) => {
        if (settlement && expense.isShared) return true; // 정산 모드일때 공동경비인 경우만 필터링
        return !settlement; // 정산 모드가 아닌 경우에는 모두 필터링하지 않음
      });

      if (filtered.length > 0) {
        acc[date] = filtered;
      }

      return acc;
    },
    {}
  );

  const goSettlement = () => {
    if (!expenses || expenses.length === 0) {
      Swal.fire({
        title: "정산 실패",
        text: "정산할 지출이 없습니다",
        icon: "error",
        confirmButtonColor: "#2a52be",
      });
    } else {
      const accountBookId = expenses[0].accountBookId;
      navigate(`/settlement/${accountBookId}`);
    }
  };

  return (
    <div className={styles.expenseListContainer}>
      <div className={styles.expenseListHeader}>
        {!settlement && (
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
        )}
        {!settlement && (
          <div className={styles.settlementButton}>
            <Button onClick={goSettlement}>정산하기</Button>
          </div>
        )}
      </div>
      <div className={styles.expenseList}>
        {Object.keys(settlementFilteredExpenses).length === 0 ? (
          <p className={styles.noExpenses}>지출 내역이 없습니다.</p>
        ) : (
          Object.keys(settlementFilteredExpenses).map((date, index) => (
            <div key={index}>
              <div className={styles.expenseDate}>{date}</div>
              {settlementFilteredExpenses[date].map((expense, idx) => (
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
