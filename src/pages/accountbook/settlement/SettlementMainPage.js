import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../../styles/accountbook/settlement/SettlementMain.module.css";
import { formatNumberWithCommas } from "../../../util/calcUtils";
import { Button } from "../../../styles/common/StyledComponents";
import {
  getAccountBook,
  getTotalSharedExpensesAndExchangeRates,
} from "../../../api/settlementApi";
import Share from "./SettlementShareModal";
import SettlementDetail from "./SettlementDetailModal";
import TripInfo from "../../common/TripInfoCmp";
import { handleProblemSubject } from "../../../util/swalUtils";
import UpdateTripInfo from "../detail/UpdateTripInfoModal";

const SettlementMainPage = () => {
  const { id } = useParams();
  const [accountBook, setAccountBook] = useState(null);
  const [exchangeRatesByCurrency, setExchangeRatesByCurrency] = useState({}); //통화 코드별 환율
  const [totalSharedExpensesByCurrency, setTotalSharedExpensesByCurrency] =
    useState({}); //통화 코드별 공동 경비 합계
  const [totalSharedExpenses, setTotalSharedExpenses] = useState(0); //총 공동 경비 합계
  const [perPersonExpense, setPerPersonExpense] = useState(0); //1인당 정산 금액
  const [displayedPerPersonExpense, setDisplayedPerPersonExpense] = useState(0); //애니메이션 적용 1인당 정산 금액
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSettlementDetailModalOpen, setIsSettlementDetailModalOpen] =
    useState(false);
  const [isTripInfoModalOpen, setIsTripInfoModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountBook = await getAccountBook(id);
        setAccountBook(accountBook);

        const totalSharedExpenseAndExchangeRates =
          await getTotalSharedExpensesAndExchangeRates(id);
        setExchangeRatesByCurrency(
          totalSharedExpenseAndExchangeRates.currencyToAvgExchangeRate
        );
        setTotalSharedExpensesByCurrency(
          totalSharedExpenseAndExchangeRates.totalSharedExpensesByCurrency
        );

        console.log(
          totalSharedExpenseAndExchangeRates.totalSharedExpensesByCurrency
        );

        //공동 경비 총 합계
        const totalExpenses = Object.values(
          totalSharedExpenseAndExchangeRates.totalSharedExpensesByCurrency
        ).reduce((sum, currentValue) => sum + currentValue, 0);
        const formattedTotalExpenses = totalExpenses.toFixed(0);
        setTotalSharedExpenses(formattedTotalExpenses);

        //1인당 정산 금액
        if (accountBook.numberOfPeople > 0) {
          setPerPersonExpense(
            formattedTotalExpenses / accountBook.numberOfPeople
          );
        }

        setDisplayedPerPersonExpense(0); //애니메이션 실행 전 초기화
      } catch (error) {
        console.error(error);
        handleProblemSubject("가계부 정산");
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

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  const goBack = () => {
    navigate(-1);
  };

  const goSettlementExpenseList = () => {
    navigate(`/settlement/${id}/expenses`, { state: { accountBook } });
  };

  if (!accountBook) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className={styles.SettlementPage}>
        <div className={styles.SettlementPage_header}>
          <div className={styles.goBackButton_container}>
            <Button className={styles.goBackButton} onClick={goBack}>
              <p className={styles.goBackButton_text}>← 가계부 상세보기</p>
            </Button>
          </div>
          <div className={styles.shareButton_container}>
            <Button
              className={styles.shareButton}
              onClick={() => setIsShareModalOpen(true)}
            >
              <p className={styles.shareButton_text}>공유하기</p>
              <img
                className={styles.shareButton_icon}
                src="/images/accountbook/settlement/share.png"
                alt="공유하기"
              />
            </Button>
          </div>
        </div>
        <div className={styles.settlementContainer}>
          <div className={styles.settlementContent}>
            <div className={styles.title} title={accountBook.title}>
              {truncateText(accountBook.title, 8)}
            </div>
            {accountBook && (
              <TripInfo
                accountBook={accountBook}
                onClick={() => setIsTripInfoModalOpen(true)}
                isSettlement={true}
              />
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
                <span className={styles.settlementDetail_container}>
                  <Button onClick={() => setIsSettlementDetailModalOpen(true)}>
                    자세히 보기
                  </Button>
                </span>
              </div>
              <div className={styles.description}>
                해당 금액은 반올림된 값입니다.
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
      {isSettlementDetailModalOpen && (
        <SettlementDetail
          isOpen={isSettlementDetailModalOpen}
          onClose={() => setIsSettlementDetailModalOpen(false)}
          exchangeRatesByCurrency={exchangeRatesByCurrency}
          totalSharedExpensesByCurrency={totalSharedExpensesByCurrency}
        />
      )}
      {isTripInfoModalOpen && (
        <UpdateTripInfo
          isOpen={isTripInfoModalOpen}
          onClose={() => setIsTripInfoModalOpen(false)}
          isSettlement={true}
          accountBook={accountBook}
        />
      )}
    </>
  );
};

export default SettlementMainPage;
