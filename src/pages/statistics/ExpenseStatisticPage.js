import React, { useEffect, useState, useCallback } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import Select from 'react-select';
import { Tooltip } from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import 'chart.js/auto';
import TotalAmountCategory from './TotalAmountCategoryCmp';
import TotalResult from './TotalResultCmp';
import { useNavigate, useParams } from 'react-router-dom';
import { formatDate, formatNumberWithCommas } from '../../util/calcUtils';
import { Button } from '../../styles/common/StyledComponents';
import styles from '../../styles/statistics/ExpenseStatistic.module.css';
import { selectStyles } from '../../util/CustomStyles';
import { useTheme } from '../../styles/common/Theme';
import {
  getDailyCategory,
  getDailyCategoryExpense,
  getDailyCategoryExpenseForLineChart,
  getDailyPaymentMethod,
  getDailyPaymentMethodExpense,
} from '../../api/statisticsApi';

// 카테고리 목록
const categories = [
  { en: 'ACCOMMODATION', ko: '숙박' },
  { en: 'TRANSPORTATION', ko: '교통' },
  { en: 'SHOPPING', ko: '쇼핑' },
  { en: 'FOOD', ko: '식비' },
  { en: 'TOURISM', ko: '관광' },
  { en: 'OTHERS', ko: '기타' },
  { en: 'ALL', ko: '전체지출' },
];

// 카테고리 한글화
const categoryMap = {
  ACCOMMODATION: '숙박',
  TRANSPORTATION: '교통',
  SHOPPING: '쇼핑',
  FOOD: '식비',
  TOURISM: '관광',
  OTHERS: '기타',
  ALL: '전체지출',
};

// 카테고리별 차트 색 배열
const colors = [
  '#23C288',
  '#7697F9',
  '#9B80E9',
  '#FEC144',
  '#B5CE2A',
  '#828C98',
  '#ff8bd2',
];

// 결제 방법 목록
const paymentMethods = [
  { en: 'CASH', ko: '현금' },
  { en: 'CARD', ko: '카드' },
];

// 결제방법별 차트 색 배열
const paymentColors = ['#FFBBE5', '#2c73d2'];

const ExpenseStatistic = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState([]); // 카테고리별 통계 데이터
  const [paymentMethodStatistics, setPaymentMethodStatistics] = useState([]); // 결제방법별 통계 데이터
  const [selectedDate, setSelectedDate] = useState(''); // 선택된 날짜(Select)
  const [dates, setDates] = useState([]); // 중복 제거한 날짜
  const [selectedCategories, setSelectedCategories] = useState(['ALL']); // 선택된 카테고리(라인차트)
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [hasExpense, setHasExpense] = useState(true);

  const { theme } = useTheme();

  // 차트 폰트
  const getChartFontSize = () => {
    const width = window.innerWidth;
    if (width < 480) {
      return 7;
    } else if (width < 768) {
      return 9;
    } else {
      return 12;
    }
  };

  // 라인차트 너비
  const getLineChartLineWidth = () => {
    const width = window.innerWidth;
    if (width < 480) {
      return 1;
    } else {
      return 2;
    }
  };

  // 차트 옵션
  const getChartOptions = useCallback(
    (darkMode) => ({
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            display: false,
            lineWidth: 1,
          },
          ticks: {
            color: darkMode ? 'white' : 'black',
            font: {
              size: getChartFontSize(),
            },
          },
          border: {
            color: darkMode ? '#454545' : '#ECECEC',
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            display: false,
            lineWidth: 1,
          },
          ticks: {
            color: darkMode ? 'white' : 'black',
            font: {
              size: getChartFontSize(),
            },
          },
          border: {
            color: darkMode ? '#454545' : '#ECECEC',
          },
        },
      },
      elements: {
        line: {
          borderWidth: getLineChartLineWidth(),
        },
      },
      plugins: {
        legend: {
          display: false,
          labels: {
            color: darkMode ? 'white' : 'black',
            font: {
              size: getChartFontSize(),
            },
            boxWidth: 45,
          },
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (context) =>
              `${context.dataset.label}: ${formatNumberWithCommas(
                context.raw.toFixed(0)
              )}`,
          },
        },
        datalabels: {
          formatter: (value) => formatNumberWithCommas(value.toFixed(0)),
          color: 'white',
          align: 'end',
          anchor: 'end', // 항목 위치
          display: true, // 차트에 항목 표시
          offset: -20,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    }),
    []
  );

  const getLineChartOptions = useCallback(
    (darkMode) => ({
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            display: false,
            lineWidth: 1,
          },
          ticks: {
            color: darkMode ? 'white' : 'black',
            font: {
              size: getChartFontSize(),
            },
          },
          border: {
            color: darkMode ? '#454545' : '#ECECEC',
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            display: false,
            lineWidth: 1,
          },
          ticks: {
            color: darkMode ? 'white' : 'black',
            font: {
              size: getChartFontSize(),
            },
          },
          border: {
            color: darkMode ? '#454545' : '#ECECEC',
          },
        },
      },
      elements: {
        line: {
          borderWidth: getLineChartLineWidth(),
        },
      },
      plugins: {
        legend: {
          display: false,
          labels: {
            color: darkMode ? 'white' : 'black',
            font: {
              size: getChartFontSize(),
            },
            boxWidth: 45,
          },
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (context) =>
              `${context.dataset.label}: ${formatNumberWithCommas(
                context.raw.toFixed(0)
              )}`,
          },
        },
        datalabels: {
          formatter: (value) => formatNumberWithCommas(value.toFixed(0)),
          color: darkMode ? 'white' : 'black',
          align: 'end',
          anchor: 'end', // 항목 위치
          display: true, // 차트에 항목 표시
          offset: -15,
          font: {
            size: getChartFontSize(),
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    }),
    []
  );

  // init 데이터
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data2 = await getDailyCategoryExpense(id);
        setStatistics(data2);

        if (data2.length === 0) {
          setHasExpense(false); // 지출 내역 없으면 나오는거
          return;
        }

        const uniqueDates = Array.from(
          new Set(data2.map((item) => formatDate(item.date)))
        ).sort((a, b) => new Date(a) - new Date(b));
        setDates(uniqueDates);
        setSelectedDate(uniqueDates[0]);

        const paymentData = await getDailyPaymentMethodExpense(
          id,
          uniqueDates[0]
        );

        if (Array.isArray(paymentData)) {
          setPaymentMethodStatistics(paymentData);
        } else {
          console.error('기댓값 array와 다른 결괏값 나옴 : ', paymentData);
          setPaymentMethodStatistics([]);
        }
      } catch (error) {
        console.error('통계 불러오기 실패 :', error);
      }
    };

    fetchData();
  }, [id]);

  // 화면 크기 변경 감지
  useEffect(() => {
    const handleResize = () => {
      setLineChartOptions(getLineChartOptions(theme === 'dark'));
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [theme, getLineChartOptions]);

  const [lineChartOptions, setLineChartOptions] = useState(
    getLineChartOptions(theme === 'dark')
  );

  // 뒤로가기
  const goBack = () => {
    navigate(-1);
  };

  // 날짜 선택 핸들러(Select)
  const handleDateChange = async (selectedOption) => {
    setSelectedDate(selectedOption.value);

    const paymentData = await getDailyPaymentMethodExpense(
      id,
      selectedOption.value
    );
    if (Array.isArray(paymentData)) {
      setPaymentMethodStatistics(paymentData);
    } else {
      console.error('Expected an array but got:', paymentData);
      setPaymentMethodStatistics([]);
    }
  };

  // 카테고리 선택 핸들러(라인차트 체크박스)
  const handleCategoryChange = async (event) => {
    const value = event.target.value;
    setSelectedCategories((prevSelectedCategories) =>
      prevSelectedCategories.includes(value)
        ? prevSelectedCategories.filter((category) => category !== value)
        : [...prevSelectedCategories, value]
    );
  };

  // 체크 해제 핸들러
  const handleClearSelection = () => {
    setSelectedCategories([]);
  };

  // 라인차트 숙박 ~ 전체지출
  useEffect(() => {
    const fetchLineChartData = async () => {
      if (selectedCategories.length > 0) {
        try {
          const datasets = await Promise.all(
            selectedCategories.map(async (category) => {
              const data = await getDailyCategoryExpenseForLineChart(
                id,
                category
              );
              console.log(`2Category: ${category}`, data);

              const colorIndex = categories.findIndex(
                (cat) => cat.en === category
              );
              const backgroundColor = colors[colorIndex] + '80'; // 투명도

              // 중복 날짜 제거
              const dateMap = data.reduce((acc, curr) => {
                const date = formatDate(curr.date);
                if (!acc[date]) {
                  acc[date] = 0;
                }
                acc[date] += curr.amount;
                return acc;
              }, {});

              return {
                label: categoryMap[category], // label 한글로 표시
                data: dates.map((date) => dateMap[date] || 0), // 값이 없으면 0으로
                borderColor: colors[colorIndex],
                backgroundColor: backgroundColor,
                pointStyle: 'circle', // 포인트 스타일 (꼭짓점)
                pointRadius: 5, // 포인트 크기
                pointHoverRadius: 10, // 호버 포인트 크기 설정
                pointBackgroundColor: backgroundColor,
                pointBorderColor: colors[colorIndex], // 포인트 테두리 색상
              };
            })
          );

          setLineChartData({
            labels: dates.map(formatDate),
            datasets: datasets,
          });
        } catch (error) {
          console.error('라인차트 fetch 실패 :', error);
        }
      } else {
        setLineChartData({
          labels: dates
            .map(formatDate)
            .sort((a, b) => new Date(a) - new Date(b)), // 날짜를 오름차순으로 정렬
          datasets: [
            { label: '', data: [], borderColor: 'rgba(0,0,0,0)', fill: false },
          ],
        });
      }
    };

    if (dates.length > 0) {
      fetchLineChartData();
    }
  }, [selectedCategories, dates, id]);

  // 선택된 날짜의 카테고리별 데이터 골라먹기(카테고리별 바 차트)
  const filteredData = statistics
    .filter((stat) => formatDate(stat.date) === selectedDate)
    .reduce((acc, stat) => {
      if (!acc[stat.category]) {
        acc[stat.category] = 0;
      }
      acc[stat.category] += stat.amount;
      return acc;
    }, {});

  // 카테고리별 데이터 설정
  const data = {
    labels: categories.map((category) => category.ko), // 카테고리 한글 레이블
    datasets: [
      {
        label: 'KRW', // 통화 단위
        data: categories.map((category) => filteredData[category.en] || 0), // 각 카테고리의 지출액
        backgroundColor: colors, // 바 차트의 색상 배열
      },
    ],
  };

  // 결제 방법별 데이터 설정
  const paymentMethodData = {
    labels: paymentMethods.map((method) => method.ko),
    datasets: [
      {
        label: 'KRW',
        data: paymentMethods.map((method) => {
          const stat = paymentMethodStatistics.find(
            (stat) => stat.paymentMethod === method.en
          );
          return stat ? stat.amount : 0;
        }),
        backgroundColor: paymentColors,
      },
    ],
  };

  // 항목별 지출 차트 옵션
  const categoryChartOptions = getChartOptions(theme === 'dark');

  // 결제 방법 차트 옵션
  const paymentMethodOptions = getChartOptions(theme === 'dark');

  // 날짜 선택 옵션
  const dateOptions = dates.map((date) => ({
    value: date,
    label: formatDate(date),
  }));

  const customSelectStyles = {
    ...selectStyles,
    control: (base) => ({
      ...base,
      backgroundColor: 'var(--background-color)',
      border: '1px solid var(--line-color)',
      borderRadius: '0.3rem',
      minHeight: '1rem',
      width: '10rem',
      color: 'var(--text-color)',
      cursor: 'pointer',
    }),
  };

  return (
    <div className={styles.expenseStatistic}>
      {!hasExpense ? ( // 지출 내역이 없는 경우 랜더링
        <div className={styles.noExpense}>
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className={styles.noExpense_icon}
          />
          <div>
            지출 내역이 없어요
            <br />
            지출 내역을 작성하시면 통계 화면을 볼 수 있어요
          </div>
        </div>
      ) : (
        <>
          <div className={styles.expenseStatistic_header}>
            <div className={styles.expenseStatistic_buttonContainer}>
              <Button
                onClick={goBack}
                className={styles.expenseStatistic_backButton}
              >
                ← 가계부 상세 보기
              </Button>
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
          <div className={styles.expenseStatistic_budgetContainer}>
            <TotalResult accountBookId={id} />
          </div>
          <div className={styles.expenseStatistic_content}>
            <div className={styles.expenseStatistic_chartsWrapper}>
              <div className={styles.chartsWrapper_title}>📆 일자별 지출</div>
              <Select
                options={dateOptions}
                onChange={handleDateChange}
                placeholder="날짜 선택"
                noOptionsMessage={() => '선택 가능한 날짜가 없습니다.'}
                styles={customSelectStyles}
              />
              <div className={styles.chartsWrapper_chart}>
                <div className={styles.expenseStatistic_chartContainer}>
                  <div className={styles.expenseStatistic_chartTitle}>
                    지출 항목
                  </div>
                  <div className={styles.barChartWrapper}>
                    <Bar
                      className={styles.categoryChart}
                      data={data}
                      options={categoryChartOptions}
                    />
                  </div>
                </div>
                <div className={styles.expenseStatistic_chartContainer}>
                  <div className={styles.expenseStatistic_chartTitle}>
                    결제 방법
                  </div>
                  <div className={styles.barChartWrapper}>
                    <Bar
                      className={styles.paymentChart}
                      data={paymentMethodData}
                      options={paymentMethodOptions}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.expenseStatistic_chartsWrapper}>
              <div className={styles.categorySelection_title}>
                🔎 지출 한눈에 보기
              </div>
              <div className={styles.expenseStatistic_categorySelection}>
                <div className={styles.expenseStatistic_total}>
                  <Tooltip id="expense-info" />
                  <TotalAmountCategory accountBookId={id} />
                </div>
                <div className={styles.categorySelection__checkboxGroup}>
                  {categories.map((category) => (
                    <div key={category.en} className={styles.labelContainer}>
                      <label>
                        <input
                          type="checkbox"
                          name="category"
                          value={category.en}
                          checked={selectedCategories.includes(category.en)}
                          onChange={handleCategoryChange}
                        />
                        {category.ko}
                      </label>
                    </div>
                  ))}
                  <Button
                    onClick={handleClearSelection}
                    className={styles.expenseStatistic_clearButton}
                  >
                    모두 해제
                  </Button>
                </div>
              </div>
              <div className={styles.expenseStatistic_lineChartContainer}>
                <div className={styles.expenseStatistic_lineChartWrapper}>
                  <Line
                    className={styles.lineChart}
                    data={lineChartData}
                    options={lineChartOptions}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExpenseStatistic;
