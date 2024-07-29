import React, { useState, useEffect, useContext } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import styles from '../../styles/statistics/MyReport.module.css';
import { getExpenseStatistics } from '../../api/expenseApi';
import { formatNumberWithCommas } from '../../util/calcUtils';
import { useTheme } from '../../styles/common/Theme';
import { getMyReportData } from '../../api/statisticsApi';
import { MemberInfoContext } from '../../App';

let total = 0;

// 차트 구성요소 등록
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);
ChartJS.register(ChartDataLabels); // 차트에 항목 표시

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

const MyReportPage = () => {
  const { memberInfo } = useContext(MemberInfoContext);
  const [categoryData, setCategoryData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  }); // 도넛 차트 데이터
  const [paymentData, setPaymentData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  }); // 현금||카드
  const [categoryBarData, setCategoryBarData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  }); // 총 누적 지출
  const [loading, setLoading] = useState(true); // 로딩 중 여부
  const [error, setError] = useState(null); // 오류 상태
  //const [userName, setUserName] = useState(memberInfo.name); // 사용자 이름
  const [highestCategory, setHighestCategory] = useState(''); // 가장 높은 지출 카테고리
  const [highestPaymentMethod, setHighestPaymentMethod] = useState(''); // 가장 많이 사용한 결제 방법
  const [hasAccountBook, setHasAccountBook] = useState(true); // 가계부 존재 여부
  const [displayAmount, setDisplayAmount] = useState(0); // 총 지출 애니메이션
  const [isVisible, setIsVisible] = useState(false);

  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  // 카테고리 퍼센티지 차트 옵션
  const categoryPercentageOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true, // 범례 아이콘을 도트로 변경
          pointStyle: 'circle', // 도트 모양을 원으로 설정
          wrap: true, // 범례를 여러 줄로 설정
          color: darkMode ? 'white' : 'black',
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            const value = context.raw.toFixed(0);
            return `KRW: ${formatNumberWithCommas(value)}`;
          },
        },
      },
      datalabels: {
        formatter: (value, ctx) => {
          let sum = 0;
          let dataArr = ctx.chart.data.datasets[0].data; //차트에 있는 데이터 가져오기

          //전체 데이터 합
          dataArr.forEach((data) => {
            sum += data;
          });

          let percentage = ((value / sum) * 100).toFixed(0) + '%'; // 백분율 계산

          return percentage === '0%' ? '' : percentage;
        },
        color: '#fff',
        display: true, // 차트에 항목 표시
      },
    },
    elements: {
      arc: {
        borderWidth: 1,
      },
    },
  };

  // 결제 방법 차트 옵션
  const paymentMethodChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            const percentage = context.raw;
            const originalValue = ((percentage / 100) * total).toFixed(0);
            return `KRW: ${formatNumberWithCommas(originalValue)}`;
          },
        },
      },
      datalabels: {
        formatter: (value) => `${value.toFixed(0)}%`,
        color: 'white',
        anchor: 'end', // 항목 위치
        align: 'end',
        offset: -20,
        display: true, // 차트에 항목 표시
        font: {
          weight: '700', // 폰트 굵기 설정
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          color: darkMode ? 'white' : 'black',
        },
        border: {
          color: darkMode ? '#454545' : '#ECECEC',
        },
      },
      y: {
        beginAtZero: true,
        min: 0,
        max: 100,
        ticks: {
          callback: (value) => {
            if (value === 0 || value === 50 || value === 100) {
              return `${value}%`;
            }
          },
          color: darkMode ? 'white' : 'black',
        },
        grid: {
          display: false,
        },
        border: {
          color: darkMode ? '#454545' : '#ECECEC',
        },
      },
    },
  };

  // 카테고리별 누적 지출 차트 옵션
  const categoryChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            const value = context.raw.toFixed(0);
            return `KRW: ${formatNumberWithCommas(value)}`;
          },
        },
      },
      datalabels: {
        formatter: (value) => formatNumberWithCommas(value.toFixed(0)),
        color: '#fff',
        anchor: 'end',
        align: 'end',
        offset: -20, // 항목 값 위치 조정
        display: true,
        font: {
          weight: '500', // 폰트 굵기 설정
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          color: darkMode ? 'white' : 'black',
        },
        border: {
          color: darkMode ? '#454545' : '#ECECEC',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: darkMode ? 'white' : 'black',
        },
        border: {
          color: darkMode ? '#454545' : '#ECECEC',
        },
      },
    },
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // const userInfo = await getUserInfo(); // 사용자 정보 가져오기
        // setUserName(userInfo.name);
        const data = await getMyReportData();
        const categoryData = data.expenditureByCategory;
        //const data = await getExpenseStatistics(); // 지출 통계 데이터 가져오기
        //console.log(data);
        const categories = Object.keys(categoryData) || [];
        const amounts = Object.values(categoryData) || [];
        const paymentMethods = data.expenditureByPaymentMethod || [];
        total = data.totalExpenditure || 0;

        // 카테고리가 없으면 가계부가 없는 것
        // if (categories.length === 0) {
        //   setHasAccountBook(false); // 가계부 없을 때 상태 업데이트
        //   setLoading(false);
        //   return;
        // }

        if (total === 0) {
          setHasAccountBook(false);
          setLoading(false);
          return;
        }

        // 카테고리 목록
        const allCategories = [
          'ACCOMMODATION',
          'TRANSPORTATION',
          'SHOPPING',
          'FOOD',
          'TOURISM',
          'OTHERS',
        ];

        // 각 카테고리 지출 금액 계산
        const categoryAmounts = allCategories.map((category) => {
          const index = categories.indexOf(category);
          return index !== -1 ? amounts[index] : 0;
        });

        // 가장 높은 지출 카테고리 찾기
        const maxCategoryIndex = categoryAmounts.indexOf(
          Math.max(...categoryAmounts)
        );
        setHighestCategory(allCategories[maxCategoryIndex]);

        // 도넛 차트 설정
        setCategoryData({
          labels: allCategories.map(getCategoryName),
          datasets: [
            {
              label: 'KRW',
              data: categoryAmounts,
              backgroundColor: [
                '#23C288',
                '#7697F9',
                '#9B80E9',
                '#FEC144',
                '#B5CE2A',
                '#828C98',
              ],
            },
          ],
        });

        // 결제 방법별 지출 금액 계산
        // const paymentMethodAmounts = {
        //   CASH:
        //     paymentMethods.find((pm) => pm.paymentMethod === 'CASH')?.amount ||
        //     0,
        //   CARD:
        //     paymentMethods.find((pm) => pm.paymentMethod === 'CARD')?.amount ||
        //     0,
        // };

        const paymentMethodAmounts = {
          CASH: paymentMethods.CASH || 0,
          CARD: paymentMethods.CARD || 0,
        };

        //결제 방법별 지출 금액 백분율
        const PaymentMethodAmountsPercentage = {
          CASH: (paymentMethodAmounts.CASH / total) * 100,
          CARD: (paymentMethodAmounts.CARD / total) * 100,
        };

        // 가장 많이 사용한 결제 방법 찾기
        setHighestPaymentMethod(
          paymentMethodAmounts.CARD > paymentMethodAmounts.CASH
            ? '카드'
            : '현금'
        );

        // 결제 방법 차트 데이터
        setPaymentData({
          labels: ['현금', '카드'],
          datasets: [
            {
              data: [
                PaymentMethodAmountsPercentage.CASH,
                PaymentMethodAmountsPercentage.CARD,
              ],
              backgroundColor: ['#FFBBE5', '#2c73d2'],
            },
          ],
        });

        // 총 지출 애니메이션
        const duration = 1000; // 애니메이션 지속 시간 (ms)
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
              backgroundColor: [
                '#23C288',
                '#7697F9',
                '#9B80E9',
                '#FEC144',
                '#B5CE2A',
                '#828C98',
              ],
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

    //글씨 타이머
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 600);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // 로딩 중일 때
  if (loading) {
    return <div>통계 불러오는 중</div>;
  }

  // 오류 발생했을 때
  if (error) {
    return <div>통계 불러오기 오류 : {error.message}</div>;
  }

  return (
    <div className={styles.myReport}>
      <div className={styles.myReport_content}>
        {!hasAccountBook ? (
          <div className={styles.noAccountBook}>
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className={styles.noAccountBook_icon}
            />
            <div>
              지출 내역이 없어요
              <br />
              지출 내역을 작성하시면 통계화면을 볼 수 있어요
            </div>
          </div>
        ) : (
          <>
            <div className={styles.header}>
              <div className={styles.header_totalAmount}>
                <img
                  className={styles.totalAmount_icon}
                  src="/images/dashboard/exclamation_mark.png"
                  alt="느낌표"
                ></img>
                <span className={styles.totalAmount_title}>
                  총 누적 지출 :{' '}
                </span>
                <span className={styles.totalAmount_amount}>
                  ₩ {formatNumberWithCommas(displayAmount.toFixed(0))}
                </span>
              </div>
              <div className={styles.header_currencyLabel}>
                <img
                  className={styles.currencyLabel_icon}
                  src="/images/dashboard/payments.png"
                  alt="화폐"
                ></img>
                화폐단위 : <span className={styles.currencyUnit}>KRW</span>
              </div>
            </div>
            <div className={styles.charts}>
              <div className={styles.charts_summary}>
                <div className={styles.description}>
                  <span className={styles.description_userName}>
                    {memberInfo.name}
                  </span>
                  님은{' '}
                  <span
                    className={`${styles.description_highlightCategory} ${
                      isVisible ? styles.visible : styles.hidden
                    }`}
                  >
                    {getCategoryName(highestCategory)}
                  </span>
                  에 가장 많은 소비를 하고,{' '}
                  <span
                    className={`${styles.description_highlightPaymentMethod} ${
                      isVisible ? styles.visible : styles.hidden
                    }`}
                  >
                    {highestPaymentMethod}
                  </span>
                  {highestPaymentMethod === '현금' ? '으로' : '로'} 가장 많이
                  결제하셨어요!
                </div>
              </div>
              <div className={styles.charts_category_container}>
                <div className={styles.chartType}>
                  <div className={styles.chart_title}>
                    📝 카테고리별 퍼센티지(%)
                  </div>
                  <div className={styles.chart_container}>
                    <Doughnut
                      className={styles.doughnutChart}
                      data={categoryData}
                      options={categoryPercentageOptions}
                    />
                  </div>
                </div>
                <div className={styles.chartType}>
                  <div className={styles.chart_title}>💰 결제 방법별 지출</div>
                  <div className={styles.chart_container}>
                    <Bar
                      className={styles.barChart2}
                      data={paymentData}
                      options={paymentMethodChartOptions}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.chartType_bar_container}>
                <div className={styles.chartType}>
                  <div className={styles.chart_title}>🔎 총 누적 지출</div>
                  <div className={styles.chart_total_container}>
                    <Bar
                      className={styles.barChart}
                      data={categoryBarData}
                      options={categoryChartOptions}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyReportPage;
