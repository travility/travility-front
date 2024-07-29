import React, { useEffect, useState } from 'react';
import {
  getTotalBudgetByAccountBookId,
  getRemainingBudget,
  getTotalExpenseByAccountBookId,
} from '../../api/expenseApi';
import styles from '../../styles/statistics/TotalResult.module.css';
import { formatNumberWithCommas } from '../../util/calcUtils';
import { getTotalBudget, getTotalExpenditure } from '../../api/statisticsApi';

// 예산 - 지출 보여주는거 (예산보다 x원 더 사용했어요)
const TotalResult = ({ accountBookId }) => {
  const [totalexpenses, setTotalExpenses] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);

  const [displayTotalExpenses, setDisplayTotalExpenses] = useState(0);
  const [displayRemainingBudget, setDisplayRemainingBudget] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const totalexpenses = await getTotalExpenseByAccountBookId(
        //   accountBookId
        // );
        // setTotalExpenses(totalexpenses);

        // const budgetData = await getTotalBudgetByAccountBookId(accountBookId);
        // setTotalBudget(budgetData);

        // const remainingBudgetData = await getRemainingBudget(accountBookId);
        // setRemainingBudget(remainingBudgetData);

        const totalexpenses = await getTotalExpenditure(accountBookId);
        setTotalExpenses(totalexpenses);

        const budgetData = await getTotalBudget(accountBookId);
        setTotalBudget(budgetData);

        const remainingBudgetData = budgetData - totalexpenses;
        setRemainingBudget(remainingBudgetData);
      } catch (error) {
        console.error('예산 데이터 불러오기 실패 :', error);
      }
    };

    fetchData();
  }, [accountBookId]);

  useEffect(() => {
    const duration = 1000; // 애니메이션 지속 시간 (ms)
    const frames = 60; // 초당 프레임 수
    const totalFrames = (duration / 1000) * frames; // 전체 프레임 수
    let currentFrame = 0;

    const animate = () => {
      const progress = currentFrame / totalFrames;
      const easeOutQuad = progress * (2 - progress);
      const expensesAmount = Math.floor(totalexpenses * easeOutQuad);
      const remainingAmount = Math.floor(remainingBudget * easeOutQuad);
      setDisplayTotalExpenses(expensesAmount);
      setDisplayRemainingBudget(remainingAmount);
      currentFrame++;
      if (currentFrame < totalFrames) {
        requestAnimationFrame(animate);
      } else {
        setDisplayTotalExpenses(totalexpenses);
        setDisplayRemainingBudget(remainingBudget);
      }
    };

    requestAnimationFrame(animate);
  }, [totalexpenses, remainingBudget]);

  return (
    <div className={styles.budgetContainer}>
      <div className={styles.budgetHeader}>
        <div>
          이번 여행에서{' '}
          <span className={styles.total_text_color}>
            {formatNumberWithCommas(displayTotalExpenses.toFixed(0))}
          </span>
          원 썼어요!
        </div>
        <div>
          {remainingBudget > 0 ? (
            <>
              예산 {formatNumberWithCommas(totalBudget.toFixed(0))} 원에서{' '}
              <span className={styles.highlight}>
                {formatNumberWithCommas(displayRemainingBudget.toFixed(0))}
              </span>
              원 아꼈어요
            </>
          ) : remainingBudget < 0 ? (
            <>
              예산보다{' '}
              <span className={styles.highlight}>
                {formatNumberWithCommas(-displayRemainingBudget.toFixed(0))}
              </span>
              원 더 사용했어요
            </>
          ) : (
            '예산과 동일하게 사용했어요!'
          )}
        </div>
      </div>
    </div>
  );
};

export default TotalResult;
