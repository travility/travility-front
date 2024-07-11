import React from 'react';
import {
  CloseButton,
  Modal,
  ModalHeader,
  ModalOverlay,
} from '../../styles/StyledComponents';
import styles from '../../styles/components/SettlementExchangeRate.module.css';

const ExchangeRateDetail = ({ isOpen, onClose, currencyToAvgExchangeRate }) => {
  return (
    <>
      {isOpen && (
        <ModalOverlay>
          <Modal>
            <ModalHeader>
              <div className={styles.settlemExchangeRate_title}>정산 환율</div>
              <CloseButton onClick={onClose}>&times;</CloseButton>
            </ModalHeader>
            <div className={styles.exchangeRates_container}>
              {Object.entries(currencyToAvgExchangeRate).map(
                //통화코드 : 환율
                ([currency, rate]) => (
                  <div key={currency} className={styles.exchangeRate}>
                    <span className={styles.exchangeRate_currency}>
                      {currency} 1.00 ={' '}
                    </span>
                    <span className={styles.exchangeRate_rate}>KRW {rate}</span>
                  </div>
                )
              )}
            </div>
            <div className={styles.description}>
              해당 환율은 가중 평균 환율로 계산되었습니다.
            </div>
          </Modal>
        </ModalOverlay>
      )}
    </>
  );
};

export default ExchangeRateDetail;
