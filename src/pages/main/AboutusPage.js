import React from "react";
import styles from "../../styles/main/AboutusPage.module.css";
import { ReactComponent as Logo } from "../../icon/Travility.svg";

const AboutUsPage = () => {
  return (
    <div className={styles.pageContainer}>
      <img
        className={styles.bgImg}
        src="/images/intro/bgImg.png"
        alt="bg-img"
      />
      <div className="inner">
        <header className={styles.header}>
          <div>
            <Logo className={styles.logo} />
          </div>
        </header>

        <section className={styles.section1}>
          <div className={styles.sec1_content}>
            <div className={styles.sec1_textContainer}>
              <h1>여행을 더욱 편리하게, 당신의 지출을 완벽하게 관리하세요!</h1>
              <h2>"Travility"</h2>
              <p>
                Travel & Facility의 합성어로, 여행을 더욱 편리하게 만들어드리는
                어플입니다.
              </p>
            </div>
            <button className={styles.login_button}>Login</button>
          </div>
        </section>
        <section className={styles.section2}>
          <img src="/images/intro/main2.png" alt="main2" />
        </section>
        <section className={styles.section3}>
          <h2>간편하고 쉽게, 누구나 여행 가계부를 작성할 수 있어요</h2>
          <img src="/images/intro/accountPage.png" alt="accountPage" />
        </section>
        <section className={styles.section4}>
          <img src="/images/intro/pinkMonster.png" alt="pinkMonster" />
          <img src="/images/intro/purpleMonster.png" alt="purpleMonster" />
          <img src="/images/intro/like.png" alt="like" />
          <img src="/images/intro/paperPlane.png" alt="paperPlane" />
          <div className={`${styles.box} ${styles.box_top}`}>
            <h1>한눈에 보는 예산과 지출</h1>
            <p>예산 대비 지출 상황을 실시간으로 확인하세요.</p>
            <img src="/images/intro/woodenHand.png" alt="woodenHand" />
          </div>
          <div className={`${styles.box} ${styles.box_left}`}>
            <h1>실시간 통계 제공</h1>
            <p>지출 현황을 다양한 그래프와 차트로 확인하세요.</p>
            <img src="/images/intro/donutChart.png" alt="donutChart" />
            <img src="/images/intro/payment.png" alt="payment" />
          </div>
          <div className={`${styles.box} ${styles.box_center}`}>
            <h1>여행 어시스턴트</h1>
            <p>
              여행 준비 단계부터 여행중, 여행을 다녀와서까지 당신만의 여행
              어시스턴트가 되어드릴게요.
            </p>
            <img src="/images/intro/worldBook.png" alt="worldBook" />
          </div>
          <div className={`${styles.box} ${styles.box_right}`}>
            <h1>다양한 카테고리 관리</h1>
            <p>
              교통, 숙박, 음식, 관광 등 다양한 카테고리로 지출을 관리하세요.
            </p>
            <img src="/images/intro/category.png" alt="category" />
          </div>
          <div className={`${styles.box} ${styles.box_bottom_center}`}>
            <h1>직관적인 인터페이스</h1>
            <p>
              Travility만의 직관적 인터페이스로 실용적이고 편리하게 사용이
              가능합니다.
            </p>
          </div>
          <div className={`${styles.box} ${styles.box_bottom_right}`}>
            <h1>효율적인 여행 계획 수립</h1>
            <p>
              인기 여행지와 나라별 하루 평균 지출액을 확인하여 여행 계획에
              도움을 받을 수 있어요.
            </p>
            <img src="/images/intro/check.png" alt="check" />
            <img src="/images/intro/planner.png" alt="planner" />
          </div>
        </section>
        <section className={styles.section5}>
          <h2>한눈에 보는 나의 여행기</h2>
          <p>마이 리포트 기능을 이용해보세요</p>
          <img src="/images/intro/myReport.png" alt="myReport" />
        </section>
        <section className={styles.section6}>
          <h2>내 돈 관리, 지출부터 일정까지 똑똑하게</h2>
          <p className={styles.title}>캘린더 기능을 이용해보세요</p>
          <p className={styles.detail}>
            내 여행 기록과 일자별 소비 내역까지 한 번에 볼 수 있어요.
          </p>
          <img src="/images/intro/calendar.png" alt="calendar" />
          <h2>지금 바로 시작하세요!</h2>
        </section>
      </div>
    </div>
  );
};

export default AboutUsPage;
