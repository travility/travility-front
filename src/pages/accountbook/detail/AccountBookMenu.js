import React from "react";
import { Button } from "../../../styles/StyledComponents";
import styles from "../../../styles/accountbook/AccountBookDetail.module.css";

const AccountBookMenu = ({ onBudgetClick, onExpenseClick, onShowStatistics }) => {
  return (
    <div className={styles.accountbook_icons}>
      <span>
        <Button onClick={onShowStatistics}>
          <img src="/images/account/statistic.png" alt="statistic" />
          <p>지출 통계</p>
        </Button>
      </span>
      <span>
        <Button onClick={onBudgetClick}>
          <img src="/images/account/local_atm.png" alt="budget" />
          <p>예산 추가</p>
        </Button>
      </span>
      <span>
        <Button onClick={onExpenseClick}>
          <img src="/images/account/write.png" alt="addExpense" />
          <p>지출 추가</p>
        </Button>
      </span>
    </div>
  );
};

export default AccountBookMenu;
