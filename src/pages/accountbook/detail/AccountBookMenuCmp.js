import React from "react";
import { Button } from "../../../styles/common/StyledComponents";
import styles from "../../../styles/accountbook/detail/AccountBookDetail.module.css";

const AccountBookMenu = ({
  onBudgetClick,
  onExpenseClick,
  goExpenseStatistic,
}) => {
  return (
    <div className={styles.accountbook_icons}>
      <span>
        <Button onClick={goExpenseStatistic}>
          <img src="/images/accountbook/statistic.png" alt="statistic" />
          <p>지출 통계</p>
        </Button>
      </span>
      <span>
        <Button onClick={onBudgetClick}>
          <img src="/images/accountbook/local_atm.png" alt="budget" />
          <p>예산 추가</p>
        </Button>
      </span>
      <span>
        <Button onClick={onExpenseClick}>
          <img src="/images/accountbook/write.png" alt="addExpense" />
          <p>지출 추가</p>
        </Button>
      </span>
    </div>
  );
};

export default AccountBookMenu;
