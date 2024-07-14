import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/main/AboutusPage.module.css';
import Layout from '../../components/header/Layout.js';
import { TokenStateContext } from '../../App.js';

const AboutUsPage = () => {
  const { tokenStatus, memberInfo } = useContext(TokenStateContext);
  //const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (tokenStatus === 'Token valid') {
  //     setIsLoggedIn(true);
  //   }
  // }, [tokenStatus]);

  const handleButtonClick = () => {
    // if (tokenStatus === "Token valid") {
    //   navigate("/main");
    // } else {
    //   navigate("/login");
    // }
    if (memberInfo) {
      navigate('/main');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerSectionContainer}>
        <header className={styles.header}>
          <Layout />
        </header>
        <section className={styles.section1}>
          <div className={styles.sec1_content}>
            <div className={styles.sec1_textContainer}>
              <h1>
                여행을 더욱 편리하게,
                <br />
                <span>당신의 지출을 완벽하게 관리</span>하세요!
              </h1>
              <h2>"Travility"</h2>
              <p>
                Travel & Facility의 합성어로, <br />
                여행을 더욱 편리하게 만들어준다는 의미입니다.
              </p>
            </div>
            <button className={styles.login_button} onClick={handleButtonClick}>
              {/* <p>{tokenStatus === "Token valid" ? "Main" : "Login"}</p> */}
              <p>{memberInfo ? 'Main' : 'Login'}</p>
            </button>
          </div>
        </section>
      </div>
      <section className={styles.section2}>
        <img src="/images/main/main2.png" alt="main2" />
      </section>
      <section className={styles.section3}>
        <h1>
          간편하고 쉽게, <br />
          누구나 여행 가계부를 작성할 수 있어요
        </h1>
        <h3>여행 중 언제 어디서나 지출을 기록하고 관리하세요</h3>
        <img src="/images/main/accountPage.png" alt="accountPage" />
      </section>
      <section className={styles.section4}>
        <div className={styles.sec4_boxContainer}>
          <div className={styles.box_top_container}>
            <div className={`${styles.box} ${styles.box_top}`}>
              <h3>한눈에 보는 예산과 지출</h3>
              <p>
                예산 대비 지출 상황을 <br />
                실시간으로 확인하세요.
              </p>
              <img src="/images/main/woodenHand.png" alt="woodenHand" />
            </div>
            <div className={styles.imageGroup}>
              <img
                src="/images/main/purpleMonster.png"
                alt="purpleMonster"
                className={styles.purpleMonster}
              />
              <img
                src="/images/main/pinkMonster.png"
                alt="pinkMonster"
                className={styles.pinkMonster}
              />
              <img
                src="/images/main/like.png"
                alt="like"
                className={styles.like}
              />
            </div>
          </div>
          <div className={`${styles.box} ${styles.box_left}`}>
            <h3>실시간 통계 제공</h3>
            <p>
              지출 현황을 다양한 그래프와 <br />
              차트로 확인하세요.
            </p>
            <img src="/images/main/statistics.png" alt="statistics" />
          </div>
          <div className={`${styles.box} ${styles.box_center}`}>
            <h3>여행 어시스턴트</h3>
            <p>
              여행 준비 단계부터 여행중,
              <br />
              여행을 다녀와서까지
              <br />
              당신만의 여행 어시스턴트가 되어드릴게요.
            </p>
            <img src="/images/main/worldBook.png" alt="worldBook" />
          </div>
          <div className={`${styles.box} ${styles.box_right}`}>
            <h3>다양한 카테고리 관리</h3>
            <p>
              교통, 숙박, 음식, 관광 등 <br />
              다양한 카테고리로 지출을 관리하세요.
            </p>
            <img src="/images/main/category.png" alt="category" />
          </div>
          <div className={`${styles.box} ${styles.box_bottom_center}`}>
            <h3>효율적인 여행 계획 수립</h3>
            <p>
              인기 여행지와 나라별 하루 평균 지출액을 확인하여
              <br />
              여행 계획에 도움을 받을 수 있어요.
            </p>
            <img src="/images/main/checkPlan.png" alt="checkPlan" />
          </div>
          <div className={`${styles.box} ${styles.box_bottom_right}`}>
            <h3>직관적인 인터페이스</h3>
            <p>
              Travility만의 직관적 인터페이스로
              <br />
              실용적이고 편리하게 사용이 가능합니다.
            </p>
          </div>
        </div>
      </section>
      <section className={styles.section5}>
        <h1>한눈에 보는 나의 여행기</h1>
        <div className={styles.myReportDetail}>
          <h2>마이 리포트 기능을 이용해보세요</h2>
          <h3 className={styles.detail}>
            여행이 끝난 후에도 지출을 분석하여
            <br />
            다음 여행을 준비할 수 있어요.
          </h3>
        </div>
        <img src="/images/main/myReport.svg" alt="myReport" />
      </section>
      <section className={styles.section6}>
        <h1>
          내 돈 관리,
          <br />
          지출부터 일정까지
          <br />
          똑똑하게
        </h1>
        <img src="/images/main/calendar.svg" alt="calendar" />
        <div className={styles.calendarDetail}>
          <h2>캘린더 기능을 이용해보세요</h2>
          <h3>내 여행 기록과 일자별 소비 내역까지 한 번에 볼 수 있어요.</h3>
        </div>
      </section>
      <div className={styles.footerSectionContainer}>
        <div className="inner">
          <section className={styles.section7}>
            <h1>지금 바로 시작하세요!</h1>
          </section>
        </div>
        <img
          className={styles.bgFooterImg}
          src="/images/main/bgFooter.png"
          alt="bg-img"
        />
      </div>
    </div>
  );
};

export default AboutUsPage;
