import React, { useEffect, useState } from 'react';
import { getTotalBudgetByAccountBookId, getRemainingBudget } from "../../api/expenseApi";
import styles from '../../styles/statistic/TotalResult.module.css';

// 예산 - 지출 보여주는거 (예산보다 x원 더 사용했어요)
const TotalResult = ({ accountBookId }) => {
  const [totalBudget, setTotalBudget] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const budgetData = await getTotalBudgetByAccountBookId(accountBookId);
        setTotalBudget(budgetData);

        const remainingBudgetData = await getRemainingBudget(accountBookId);
        setRemainingBudget(remainingBudgetData);
      } catch (error) {
        console.error("예산 데이터 불러오기 실패 :", error);
      }
    };

    fetchData();
  }, [accountBookId]);

  const renderBudgetMessage = () => {
    if (remainingBudget > 0) {
      return `예산에서 ${remainingBudget.toLocaleString()}원 아꼈어요.`;
    } else if (remainingBudget < 0) {
      return `예산보다 ${(-remainingBudget).toLocaleString()}원 더 사용했어요.`;
    } else {
      return "예산과 동일하게 사용했어요.";
    }
  };

  return (
    <div className={styles.budgetContainer}>
      <h3 className={styles.budgetHeader}>{renderBudgetMessage()}</h3>
      <p className={styles.totalBudget}>*예산 : {totalBudget.toLocaleString()}원</p>
    </div>
  );
};

export default TotalResult;
