import React, { useState, useEffect } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // **********
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import styles from '../../styles/dashboard/MyReport.module.css';
import { getExpenseStatistics, getUserInfo } from '../../api/expenseApi';

// 차트 구성요소 등록
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);
ChartJS.register(ChartDataLabels); // **********

// 도넛 차트 옵션
const options = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      enabled: true,
    },
    datalabels: {
      formatter: (value) => value.toLocaleString(),
      color: '#fff',
      display: true,
    },
  },
  elements: {
    arc: {
      borderWidth: 2,
    },
  },
};

// 가로 막대 차트 옵션
const horizontalBarOptions = {
  indexAxis: 'y',
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
    },
    datalabels: {
      formatter: (value) => value.toLocaleString(),
      color: '#000',
      anchor: 'end',
      align: 'end',
      display: true,
    },
  },
  scales: {
    x: {
      beginAtZero: true,
    },
    y: {
      beginAtZero: true,
    },
  },
};

// 세로 막대 차트 옵션
const verticalBarOptions = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
    },
    datalabels: {
      formatter: (value) => value.toLocaleString(),
      color: '#000',
      anchor: 'end',
      align: 'end',
      offset: -10, // ********** 항목 값 위치 조정
      display: true,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

// 카테고리 이름 변환 (영어 -> 한국어)
const getCategoryName = (category) => {
  switch (category) {
    case 'ACCOMMODATION':
      return '숙박';
    case 'TRANSPORTATION':
      return '교통';
    case 'SHOPPING':
      return '쇼핑';
    case 'FOOD':
      return '식비';
    case 'TOURISM':
      return '관광';
    case 'OTHERS':
      return '기타';
    default:
      return category; // 기본적으로 원래 카테고리 이름 반환
  }
};

const MyReport = () => {
  const [totalAmount, setTotalAmount] = useState(0); // 총 지출 금액 상태
  const [categoryData, setCategoryData] = useState({ labels: [], datasets: [{ data: [] }] }); // 도넛 차트 데이터
  const [paymentData, setPaymentData] = useState({ labels: [], datasets: [{ data: [] }] }); // 가로 막대 차트 데이터
  const [categoryBarData, setCategoryBarData] = useState({ labels: [], datasets: [{ data: [] }] }); // 세로 막대 차트 데이터
  const [loading, setLoading] = useState(true); // 로딩 중 여부
  const [error, setError] = useState(null); // 오류 상태
  const [userName, setUserName] = useState(''); // 사용자 이름
  const [highestCategory, setHighestCategory] = useState(''); // 가장 높은 지출 카테고리
  const [highestPaymentMethod, setHighestPaymentMethod] = useState(''); // 가장 많이 사용한 결제 방법
  const [hasAccountBook, setHasAccountBook] = useState(true); // 가계부 존재 여부
  const [displayAmount, setDisplayAmount] = useState(0); // 총 지출 애니메이션

  useEffect(() => {
    async function fetchData() {
      try {
        const userInfo = await getUserInfo(); // 사용자 정보 가져오기
        setUserName(userInfo.name);

        const data = await getExpenseStatistics(); // 지출 통계 데이터 가져오기
        const categories = data.categories || [];
        const amounts = data.amounts || [];
        const paymentMethods = data.paymentMethods || [];
        const total = data.totalAmount || 0;

        // 카테고리가 없으면 가계부가 없는 것
        if (categories.length === 0) {
          setHasAccountBook(false); // 가계부 없을 때 상태 업데이트
          setLoading(false);
          return;
        }

        // 카테고리 목록
        const allCategories = ['ACCOMMODATION', 'TRANSPORTATION', 'SHOPPING', 'FOOD', 'TOURISM', 'OTHERS'];

        // 각 카테고리 지출 금액 계산
        const categoryAmounts = allCategories.map(category => {
          const index = categories.indexOf(category);
          return index !== -1 ? amounts[index] : 0;
        });

        // 가장 높은 지출 카테고리 찾기
        const maxCategoryIndex = categoryAmounts.indexOf(Math.max(...categoryAmounts));
        setHighestCategory(allCategories[maxCategoryIndex]);

        // 도넛 차트 설정
        setCategoryData({
          labels: allCategories.map(getCategoryName),
          datasets: [
            {
              label: 'KRW',
              data: categoryAmounts,
              backgroundColor: ['#4bc0c0', '#36a2eb', '#ffcd56', '#ff9f40', '#9966ff', '#c9cbcf'],
            },
          ],
        });

        // 결제 방법별 지출 금액 계산
        const paymentMethodAmounts = {
          CASH: paymentMethods.find(pm => pm.paymentMethod === 'CASH')?.amount || 0,
          CARD: paymentMethods.find(pm => pm.paymentMethod === 'CARD')?.amount || 0,
        };

        // 가장 많이 사용한 결제 방법 찾기
        setHighestPaymentMethod(paymentMethodAmounts.CARD > paymentMethodAmounts.CASH ? '카드' : '현금');

        // 가로 막대 차트 설정
        setPaymentData({
          labels: ['현금', '카드'],
          datasets: [
            {
              label: 'KRW',
              data: [paymentMethodAmounts.CASH, paymentMethodAmounts.CARD],
              backgroundColor: ['#e0e0e0', '#2c73d2'],
            },
          ],
        });

        // 총 지출 금액 설정
        setTotalAmount(total);

        // 총 지출 애니메이션
        let startAmount = 0;
        const duration = 2000; // 애니메이션 지속 시간 (ms)
        const frames = 60; // 초당 프레임 수
        const totalFrames = (duration / 1000) * frames; // 전체 프레임 수
        let currentFrame = 0;

        const animate = () => {
          const progress = currentFrame / totalFrames;
          const easeOutQuad = progress * (2 - progress);
          const amount = Math.floor(total * easeOutQuad);
          setDisplayAmount(amount);
          currentFrame++;
          if (currentFrame < totalFrames) {
            requestAnimationFrame(animate);
          } else {
            setDisplayAmount(total);
          }
        };

        requestAnimationFrame(animate);

        // 세로 막대 차트 설정
        setCategoryBarData({
          labels: allCategories.map(getCategoryName),
          datasets: [
            {
              label: 'KRW',
              data: categoryAmounts,
              backgroundColor: ['#4bc0c0', '#36a2eb', '#ffcd56', '#ff9f40', '#9966ff', '#c9cbcf'],
            },
          ],
        });

      } catch (error) {
        setError(error); // 오류 발생 시 상태 업데이트
      } finally {
        setLoading(false); // 로딩 종료
      }
    }

    fetchData();
  }, []);

  // 로딩 중일 때
  if (loading) {
    return <div>Loading...</div>;
  }

  // 오류 발생했을 때
  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <div className={styles.dashboard_container}>
      <div className={styles.content}>
        {!hasAccountBook ? (
          <div className={styles.no_account_book}>
            <FontAwesomeIcon icon={faExclamationTriangle} className={styles.no_account_book_icon} />
            <div>
              작성하신 가계부가 없어요<br />
              가계부를 작성하시면 통계화면을 볼 수 있어요
            </div>
          </div>
        ) : (
          <>
            <div className={styles.header}>
              <h1>지출 통계</h1>
            </div>
            <div className={styles.chart_section}>
              <div className={styles.chart_container}>
                <div className={styles.summary}>
                  <p>
                    {userName}님은 <span className={styles.highlight_category}>{getCategoryName(highestCategory)}</span>에 가장 많은 소비를 하고,{' '}<br />
                    <span className={styles.highlight_paymentMethod}>{highestPaymentMethod}</span>{highestPaymentMethod === '현금' ? '으로' : '로'} 가장 많이 결제하셨어요.
                  </p>
                </div>
                <Doughnut data={categoryData} options={options} />
              </div>
              <div className={styles.payment_summary_container}>
                <div className={styles.payment_summary}>
                  <Bar data={paymentData} options={horizontalBarOptions} />
                </div>
                <div className={styles.total_expenses}>
                  <span>총 지출</span> <span className={styles.total_amount}>₩ {displayAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className={styles.bar_container}>
              <Bar data={categoryBarData} options={verticalBarOptions} />
            </div>
            <div className={styles.currency_label}>화폐단위 : KRW</div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyReport;
