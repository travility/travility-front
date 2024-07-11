import React, { useEffect, useState } from 'react';
import {
  CloseButton,
  Modal,
  ModalHeader,
  ModalOverlay,
} from '../../styles/StyledComponents';
import styles from '../../styles/components/SettlementDetail.module.css';
import { formatNumberWithCommas } from '../../util/calcUtils';

const SettlementDetail = ({
  isOpen,
  onClose,
  exchangeRatesByCurrency,
  totalSharedExpensesByCurrency,
}) => {
  const [totalSharedExpenses, setTotalSharedExpenses] = useState([]);

  useEffect(() => {
    setTotalSharedExpenses(Object.values(totalSharedExpensesByCurrency));
  }, [totalSharedExpensesByCurrency]);

  return (
    <>
      {isOpen && (
        <ModalOverlay>
          <Modal>
            <ModalHeader>
              <div className={styles.settlemDetail_title}>정산 금액</div>
              <CloseButton onClick={onClose}>&times;</CloseButton>
            </ModalHeader>
            <div className={styles.settlementDetail_container}>
              {Object.entries(exchangeRatesByCurrency).map(
                //통화코드 : 환율
                ([currency, rate]) => (
                  <div className={styles.settlemDetail_content} key={currency}>
                    <span className={styles.exchangeRate_currency}>
                      {currency} 1.00 ={' '}
                    </span>
                    <span className={styles.exchangeRate_rate}>
                      KRW {formatNumberWithCommas(rate)}
                    </span>
                    <div className={styles.totalSharedExpenseByCurrency}>
                      {formatNumberWithCommas(
                        totalSharedExpensesByCurrency[currency]
                      )}{' '}
                      ₩
                    </div>
                  </div>
                )
              )}
              <div className={styles.totalSharedExpense}>
                ={' '}
                {Object.values(totalSharedExpensesByCurrency).reduce(
                  (sum, currentValue) => sum + currentValue,
                  0
                )}{' '}
                ₩
              </div>
            </div>
            <div></div>
            <div className={styles.description}>
              해당 환율은 가중 평균 환율로 계산되었습니다.
            </div>
          </Modal>
        </ModalOverlay>
      )}
    </>
  );
};

export default SettlementDetail;
