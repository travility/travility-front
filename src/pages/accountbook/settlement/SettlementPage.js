import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../../styles/accountbook/SettlementPage.module.css';
import { formatNumberWithCommas, formatDate } from '../../../util/calcUtils';
import { Button } from '../../../styles/StyledComponents';
import {
  getAccountBook,
  getPerPersonAmount,
  getTotalSharedExpensesAndExchangeRates,
} from '../../../api/settlementApi';
import Share from '../../../components/settlement/Share';
import SettlementExchangeRate from '../../../components/settlement/SettlementExchangeRate';

const SettlementPage = () => {
  const { id } = useParams();
  const [accountBook, setAccountBook] = useState(null);
  const [currencyToAvgExchangeRate, setCurrencyToAvgExchangeRate] = useState(
    []
  );
  const [totalSharedExpenses, setTotalSharedExpenses] = useState(0);
  const [perPersonExpense, setPerPersonExpense] = useState(0);
  const [displayedPerPersonExpense, setDisplayedPerPersonExpense] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isExchangeRateModalOpen, setIsExchangeRateModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountBook = await getAccountBook(id);
        setAccountBook(accountBook);

        const totalSharedExpenseAndExchangeRates =
          await getTotalSharedExpensesAndExchangeRates(id);
        setCurrencyToAvgExchangeRate(
          totalSharedExpenseAndExchangeRates.currencyToAvgExchangeRate
        );
        setTotalSharedExpenses(
          totalSharedExpenseAndExchangeRates.totalSharedExpenses
        );

        const perPersonExpense = await getPerPersonAmount(id);
        setPerPersonExpense(perPersonExpense);

        setDisplayedPerPersonExpense(0); // 애니메이션 시작 전 초기화
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [id, navigate]);

  //화면이 렌더링 될 때마다 perPersonExpense 애니메이션
  useEffect(() => {
    const duration = 1000; //밀리초 단위 -> 1초 (애니메이션 지속 시간)
    const startTime = performance.now(); //시작 시간

    const animate = (currentTime) => {
      //currentTime -> requestAnimationFrame이 제공하는 타임 스탬프
      const elapsed = currentTime - startTime; //애니메이션 시작 후 경과 시간
      const progress = Math.min(elapsed / duration, 1); //애니메이션 진행 상황 계산 (0에서 1 사이의 값)
      const currentValue = Math.floor(progress * perPersonExpense); //진행 상황에 알맞은 값
      setDisplayedPerPersonExpense(currentValue); //값 업데이트

      //애니메이션이 끝나지 않았으면 다음 프레임에 다시 호출
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    // perPersonExpense가 0보다 클 때 애니메이션 시작
    if (perPersonExpense > 0) {
      requestAnimationFrame(animate);
    }
  }, [perPersonExpense]); //1인당 정산 금액이 바뀔 때마다 실행

  const goSettlementExpenseList = () => {
    navigate(`/settlement/${id}/expenses`, { state: { accountBook } });
  };

  if (!accountBook) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className={styles.SettlementPage}>
        <div className={styles.shareButtonContainer}>
          <div className={styles.shareButtonContent}>
            <Button
              className={styles.shareButton}
              onClick={() => setIsShareModalOpen(true)}
            >
              <p className={styles.shareButton_text}>공유하기</p>
              <img
                className={styles.shareButton_icon}
                src="/images/account/share.png"
                alt="공유하기"
              />
            </Button>
          </div>
        </div>
        <div className={styles.settlementContainer}>
          <div className={styles.settlementContent}>
            <div className={styles.title}>{accountBook.title}</div>
            {accountBook && (
              <div
                className={styles.tripInfo}
                style={{
                  backgroundImage: `url(http://localhost:8080/images/${accountBook.imgName})`,
                }}
              >
                <div className={styles.accountBook_list_item_detail}>
                  <div className={styles.accountBook_list_title_and_flag}>
                    <span className={styles.accountBook_list_flag}>
                      <img src={accountBook.countryFlag} alt="국기" />
                    </span>
                    <span className={styles.accountBook_list_title}>
                      {accountBook.countryName}
                    </span>
                  </div>
                  <span className={styles.accountBook_list_dates}>
                    {`${formatDate(accountBook.startDate)} ~ ${formatDate(
                      accountBook.endDate
                    )}`}
                  </span>
                </div>
              </div>
            )}
            <div className={styles.settlementDetails}>
              <div className={styles.settlementDetails_item}>
                여행 인원 : {accountBook.numberOfPeople}
              </div>
              <div className={styles.settlementDetails_item}>
                여행 일정 : {accountBook.startDate} ~ {accountBook.endDate}
              </div>
              <div className={styles.settlementDetails_item}>
                <span className={styles.amount}>
                  정산 금액 : {formatNumberWithCommas(totalSharedExpenses)} 원
                </span>
                <span className={styles.settlementExchangeRate_container}>
                  <Button onClick={() => setIsExchangeRateModalOpen(true)}>
                    정산 환율
                  </Button>
                </span>
              </div>
            </div>
            <div className={styles.perPersonExpense}>
              {formatNumberWithCommas(displayedPerPersonExpense)} 원
            </div>
            <div className={styles.settlementExpenseListButtonContainer}>
              <Button
                className={styles.settlementExpenseListButton}
                onClick={goSettlementExpenseList}
              >
                목록보기
              </Button>
            </div>
          </div>
        </div>
      </div>
      {isShareModalOpen && (
        <Share
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          imgName={accountBook.imgName}
          countryName={accountBook.countryName}
        />
      )}
      {isExchangeRateModalOpen && (
        <SettlementExchangeRate
          isOpen={isExchangeRateModalOpen}
          onClose={() => setIsExchangeRateModalOpen(false)}
          currencyToAvgExchangeRate={currencyToAvgExchangeRate}
        />
      )}
    </>
  );
};

export default SettlementPage;
