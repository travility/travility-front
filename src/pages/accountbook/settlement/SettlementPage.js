import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../../styles/accountbook/SettlementPage.module.css';
import { formatDate } from '../../../api/accountbookApi';
import { Button } from '../../../styles/StyledComponents';
import {
  getAccountBook,
  getPerPersonAmount,
  getTotalSharedExpenses,
} from '../../../api/settlementApi';
import Share from '../../../components/Share';
import { formatNumberWithCommas } from '../../../util/calcUtils';

//헤더의 로그아웃 안 보이게
//네비바 안 보이게
//정산할 지출 없을때 어떻게 보여줄지
const SettlementPage = () => {
  const { id } = useParams();
  const [accountBook, setAccountBook] = useState(null);
  const [totalSharedExpense, setTotalSharedExpense] = useState(0);
  const [perPersonExpense, setPerPersonExpense] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fechData = async () => {
      try {
        const accountBook = await getAccountBook(id);
        setAccountBook(accountBook);

        const totalSharedExpense = await getTotalSharedExpenses(id);
        setTotalSharedExpense(totalSharedExpense);

        const perPersonExpense = await getPerPersonAmount(id);
        setPerPersonExpense(perPersonExpense);
      } catch (error) {
        console.error(error);
      }
    };
    fechData();
    console.log(accountBook);
  }, [id, navigate]);

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
              ></img>
            </Button>
          </div>
        </div>
        <div className={styles.settlementContainer}>
          <div className={styles.settlementContent}>
            <div className={styles.title}>{accountBook.title}</div>
            {accountBook && (
              <div
                className={styles.tripInfo} //여행 정보
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
                정산 금액 : {formatNumberWithCommas(totalSharedExpense)} 원
              </div>
            </div>
            <div className={styles.perPersonExpense}>
              {formatNumberWithCommas(perPersonExpense)} 원
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
    </>
  );
};

export default SettlementPage;
