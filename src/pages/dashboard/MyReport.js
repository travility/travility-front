import React, { useState, useEffect } from 'react';
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
import styles from '../../styles/dashboard/MyReport.module.css';
import { getExpenseStatistics, getUserInfo } from '../../api/expenseApi';

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
      formatter: (value, ctx) => {
        let sum = 0;
        let dataArr = ctx.chart.data.datasets[0].data; //차트에 있는 데이터 가져오기

        //전체 데이터 합
        dataArr.forEach((data) => {
          sum += data;
        });

        let percentage = ((value / sum) * 100).toFixed(0) + '%'; // 백분율 계산

        if (percentage === '0%') return '';

        return percentage;
      },
      color: '#fff',
      display: true, // 차트에 항목 표시
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
      color: '#fff',
      anchor: 'end', // 항목 위치
      align: 'end',
      offset: -60,
      display: true, // 차트에 항목 표시
      font: {
        weight: '700', // 폰트 굵기 설정
      },
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
      color: '#fff',
      anchor: 'end',
      align: 'end',
      offset: -20, // ********** 항목 값 위치 조정
      display: true,
      font: {
        weight: '500', // 폰트 굵기 설정
      },
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
  const [categoryData, setCategoryData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  }); // 도넛 차트 데이터
  const [paymentData, setPaymentData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  }); // 가로 막대 차트 데이터
  const [categoryBarData, setCategoryBarData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  }); // 세로 막대 차트 데이터
  const [loading, setLoading] = useState(true); // 로딩 중 여부
  const [error, setError] = useState(null); // 오류 상태
  const [userName, setUserName] = useState(''); // 사용자 이름
  const [highestCategory, setHighestCategory] = useState(''); // 가장 높은 지출 카테고리
  const [highestPaymentMethod, setHighestPaymentMethod] = useState(''); // 가장 많이 사용한 결제 방법
  const [hasAccountBook, setHasAccountBook] = useState(true); // 가계부 존재 여부
  const [displayAmount, setDisplayAmount] = useState(0); // 총 지출 애니메이션
  const [isHovered, setIsHovered] = useState(false); // 마우스 오버 상태

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
        const paymentMethodAmounts = {
          CASH:
            paymentMethods.find((pm) => pm.paymentMethod === 'CASH')?.amount ||
            0,
          CARD:
            paymentMethods.find((pm) => pm.paymentMethod === 'CARD')?.amount ||
            0,
        };

        // 가장 많이 사용한 결제 방법 찾기
        setHighestPaymentMethod(
          paymentMethodAmounts.CARD > paymentMethodAmounts.CASH
            ? '카드'
            : '현금'
        );

        // 가로 막대 차트 설정
        setPaymentData({
          labels: ['현금', '카드'],
          datasets: [
            {
              label: 'KRW',
              data: [paymentMethodAmounts.CASH, paymentMethodAmounts.CARD],
              backgroundColor: ['#FFBBE5', '#2c73d2'],
            },
          ],
        });

        // 총 지출 금액 설정
        setTotalAmount(total);

        // 총 지출 애니메이션
        let startAmount = 0;
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
              작성하신 가계부가 없어요
              <br />
              가계부를 작성하시면 통계화면을 볼 수 있어요🐷
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
                <span className={styles.totalAmount_title}>총 지출 : </span>
                <span className={styles.totalAmount_amount}>
                  {displayAmount.toLocaleString()} ₩
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
                    {userName}
                  </span>
                  님은{' '}
                  <span className={styles.description_highlightCategory}>
                    {getCategoryName(highestCategory)}
                  </span>
                  에 가장 많은 소비를 하고,{' '}
                  <span className={styles.description_highlightPaymentMethod}>
                    {highestPaymentMethod}
                  </span>
                  {highestPaymentMethod === '현금' ? '으로' : '로'} 가장 많이
                  결제하셨어요!
                </div>
              </div>
              <div className={styles.charts_category}>
                <div className={styles.category_title}>지출 항목</div>
                <div className={styles.chartType}>
                  <div className={styles.chartType_doughnut}>
                    <Doughnut
                      className={styles.doughnutChart}
                      data={categoryData}
                      options={options}
                    />
                  </div>
                  <div className={styles.chartType_bar}>
                    <Bar
                      className={styles.barChart}
                      data={categoryBarData}
                      options={verticalBarOptions}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.charts_paymentMethod}>
                <div className={styles.paymentMethod_title}>결제 방법</div>
                <div className={styles.paymentMethod_chart}>
                  <Bar
                    className={styles.barChart2}
                    data={paymentData}
                    options={horizontalBarOptions}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyReport;
