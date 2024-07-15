import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../../styles/accountbook/SettlementExpenseListPage.module.css";
import { Button } from "../../../styles/StyledComponents";

const categoryImages = {
  TRANSPORTATION: "transportation.png",
  ACCOMMODATION: "accommodation.png",
  FOOD: "food.png",
  TOURISM: "tourism.png",
  SHOPPING: "shopping.png",
  OTHERS: "others.png",
};

const SettlementExpenseListPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const accountBook = state?.accountBook;
  const [groupedExpenses, setGroupedExpenses] = useState({});

  useEffect(() => {
    // 공동경비 지출내역 필터링
    if (accountBook) {
      const sharedExpenses = accountBook.expenses.filter(
        (expense) => expense.isShared
      );
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

  const goBack = () => {
    navigate(-1);
  };

  return (
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
                <div key={idx} className={styles.expenseItem}>
                  <img
                    className={styles.categoryImg}
                    src={`/images/account/category/${
                      categoryImages[expense.category] || "others.png"
                    }`}
                    alt={expense.category}
                  />
                  <span className={styles.currency}>{expense.curUnit}</span>
                  <span className={styles.amount}>{expense.amount}</span>
                  <span className={styles.description}>{expense.title}</span>
                  {expense.imgName ? (
                    <img
                      className={styles.expenseImg}
                      src={`http://localhost:8080/images/${expense.imgName}`}
                      alt="지출 이미지"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div
                      className={`${styles.expenseImg} ${styles.defaultImg}`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
      <div>
        <Button onClick={goBack}>돌아가기</Button>
      </div>
    </div>
  );
};

export default SettlementExpenseListPage;
