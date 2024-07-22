import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import Select from 'react-select';
import { Tooltip } from 'react-tooltip';
import {
  getExpenseStatisticsByDate,
  getPaymentMethodStatisticsByDate,
  getStatisticsByCategoryAndDates,
} from '../../api/expenseApi';
import 'chart.js/auto';
import TotalAmountCategory from './TotalAmountCategory';
import TotalResult from '../statistic/TotalResult';
import styles from '../../styles/statistic/ExpenseStatistic.module.css';
import { formatDate } from '../../util/calcUtils';
import { Button } from '../../styles/StyledComponents';
import { useNavigate, useParams } from 'react-router-dom';

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

const categoryMap = {
  ACCOMMODATION: '숙박',
  TRANSPORTATION: '교통',
  SHOPPING: '쇼핑',
  FOOD: '식비',
  TOURISM: '관광',
  OTHERS: '기타',
  ALL: '전체지출',
};

// 카테고리 색 배열
const colors = [
  '#23C288',
  '#7697F9',
  '#9B80E9',
  '#FEC144',
  '#B5CE2A',
  '#828C98',
];

// 결제 방법 목록
const paymentMethods = [
  { en: 'CASH', ko: '현금' },
  { en: 'CARD', ko: '카드' },
];

// 결제방법 색 배열
const paymentColors = ['#FFBBE5', '#2c73d2'];

const ExpenseStatistic = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState([]);
  const [paymentMethodStatistics, setPaymentMethodStatistics] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [dates, setDates] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(['ALL']);
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getExpenseStatisticsByDate(id);
        console.log(data);
        setStatistics(data);

        const uniqueDates = Array.from(new Set(data.map((item) => item.date)));
        setDates(uniqueDates);
        setSelectedDate(uniqueDates[0]);

        // 기본적으로 첫 번째 날짜 선택
        const paymentData = await getPaymentMethodStatisticsByDate(
          id,
          uniqueDates[0]
        );
        if (Array.isArray(paymentData)) {
          setPaymentMethodStatistics(paymentData);
        } else {
          console.error('Expected an array but got:', paymentData);
          setPaymentMethodStatistics([]);
        }
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      }
    };

    fetchData();
  }, [id]);

  const goBack = () => {
    navigate(-1);
  };

  // 날짜 선택 핸들러
  const handleDateChange = async (selectedOption) => {
    setSelectedDate(selectedOption.value);
    const paymentData = await getPaymentMethodStatisticsByDate(
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

  // 카테고리 선택 핸들러
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

  // 카테고리 선택하면 해당 데이터 가져올거에요
  useEffect(() => {
    const fetchLineChartData = async () => {
      if (selectedCategories.length > 0) {
        try {
          const datasets = await Promise.all(
            selectedCategories.map(async (category) => {
              const data = await getStatisticsByCategoryAndDates(id, category);
              const colorIndex = categories.findIndex(
                (cat) => cat.en === category
              );
              const backgroundColor = colors[colorIndex] + '80'; // 살짝 투명하게함 50%
              return {
                label: categoryMap[category], // 한글 라벨
                data: dates.map((date) => {
                  const entry = data.find((d) => d.date === date);
                  return entry ? entry.amount : 0;
                }),
                borderColor: colors[colorIndex],
                backgroundColor: backgroundColor,
                pointStyle: 'circle', // 포인트 스타일 (꼭짓점)
                pointRadius: 10, // 포인트 크기
                pointHoverRadius: 15, // 호버 포인트 크기 설정
                pointBackgroundColor: backgroundColor,
                pointBorderColor: colors[colorIndex], // 포인트 테두리 색상
              };
            })
          );
          setLineChartData({ labels: dates.map(formatDate), datasets });
        } catch (error) {
          console.error('Failed to fetch line chart data:', error);
        }
      } else {
        setLineChartData({
          labels: dates.map(formatDate),
          datasets: [
            { label: '', data: [], borderColor: 'rgba(0,0,0,0)', fill: false },
          ],
        });
      }
    };

    if (dates.length > 0) {
      fetchLineChartData();
    }
  }, [selectedCategories, dates]);

  // 선택된 날짜의 카테고리별 데이터 골라먹기
  const filteredData = statistics
    .filter((stat) => stat.date === selectedDate)
    .reduce((acc, stat) => {
      acc[stat.category] = stat.amount;
      return acc;
    }, {});

  // 카테고리별 데이터 설정
  const data = {
    labels: categories.map((category) => category.ko),
    datasets: [
      {
        label: '금액',
        data: categories.map((category) => filteredData[category.en] || 0),
        backgroundColor: colors,
      },
    ],
  };

  // 결제 방법별 데이터 설정
  const paymentMethodData = {
    labels: paymentMethods.map((method) => method.ko),
    datasets: [
      {
        label: '금액',
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

  // 차트 옵션
  const options = {
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          lineWidth: 1, // x축 모든 라인 굵게
          color: '#d1d1d1',
        },
        ticks: {
          color: '#000000', // 폰트 색상
          font: {
            size: 15, // 폰트 크기
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          lineWidth: 1, // y축의 모든 라인 굵게
          color: '#d1d1d1',
        },
        ticks: {
          color: '#000000', // 폰트 색상
          font: {
            size: 14, // 폰트 크기
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: 'black', // 범례 폰트 색상
          font: {
            size: 18, // 범례 폰트 크기
          },
          boxWidth: 45, // 범례 박스 너비
        },
      },
      tooltip: {
        mode: 'index', // 툴팁 모드 설정 : 마우스 아무데나 올려놔도 정보 뜸. 안하면 에임잡기 빡셈
        intersect: false, // 교차여부
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`, // 툴팁 한글 라벨
          labelColor: (context) => ({
            borderColor: context.dataset.borderColor,
            backgroundColor: context.dataset.backgroundColor,
          }),
        },
      },
    },
  };

  // 항목별 지출 차트 옵션
  const categoryChartOptions = {
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          // lineWidth: 1, // x축 모든 라인 굵게
          color: '#d1d1d1',
        },
        ticks: {
          color: '#000000', // 폰트 색상
          font: {
            size: 12, // 폰트 크기
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          lineWidth: 1, // y축의 모든 라인 굵게
          color: '#d1d1d1',
        },
        ticks: {
          color: '#000000', // 폰트 색상
          font: {
            size: 14, // 폰트 크기
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          generateLabels: (chart) => {
            const dataset = chart.data.datasets[0];
            return dataset.data.map((data, index) => ({
              text: `${chart.data.labels[index]}`,
              fillStyle: dataset.backgroundColor[index],
              hidden:
                dataset._meta &&
                dataset._meta[Object.keys(dataset._meta)[0]].data[index].hidden,
              index: index,
            }));
          },
          color: 'black', // 범례 폰트 색상
          font: {
            size: 18, // 범례 폰트 크기
          },
          boxWidth: 45, // 범례 박스 너비
        },

        onClick: (e, legendItem, legend) => {
          // 작동안됨
          const index = legendItem.index;
          const ci = legend.chart;
          const meta = ci.getDatasetMeta(0);

          meta.data[index].hidden = !meta.data[index].hidden;
          ci.update();
        },
      },
      datasets: [
        {
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
      tooltip: {
        mode: 'index', // 툴팁 모드 설정 : 마우스 아무데나 올려놔도 정보 뜸. 안하면 에임잡기 빡셈
        intersect: false, // 교차여부
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`, // 툴팁 한글 라벨
          labelColor: (context) => ({
            borderColor: context.dataset.borderColor,
            backgroundColor: context.dataset.backgroundColor,
          }),
        },
      },
    },
  };

  // 결제 방법 차트 옵션
  const paymentMethodOptions = {
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          lineWidth: 1, // x축 모든 라인 굵게
          color: '#d1d1d1',
        },
        ticks: {
          color: '#000000', // 폰트 색상
          font: {
            size: 15, // 폰트 크기
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          lineWidth: 1, // y축의 모든 라인 굵게
          color: '#d1d1d1',
        },
        ticks: {
          color: '#000000', // 폰트 색상
          font: {
            size: 14, // 폰트 크기
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          generateLabels: (chart) => {
            const dataset = chart.data.datasets[0];
            return dataset.data.map((data, index) => ({
              text: `${chart.data.labels[index]}`,
              fillStyle: dataset.backgroundColor[index],
              hidden: false,
              index: index,
            }));
          },
          color: 'black', // 범례 폰트 색상
          font: {
            size: 18, // 범례 폰트 크기
          },
          boxWidth: 45, // 범례 박스 너비
        },
      },
      tooltip: {
        mode: 'index', // 툴팁 모드 설정 : 마우스 아무데나 올려놔도 정보 뜸. 안하면 에임잡기 빡셈
        intersect: false, // 교차여부
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`, // 툴팁 한글 라벨
          labelColor: (context) => ({
            borderColor: context.dataset.borderColor,
            backgroundColor: context.dataset.backgroundColor,
          }),
        },
      },
    },
  };

  // 날짜 선택 옵션
  const dateOptions = dates.map((date) => ({
    value: date,
    label: formatDate(date),
  }));

  return (
    <div className={styles.expenseStatistic}>
      <div className={styles.expenseStatistic_header}>
        <div className={styles.expenseStatistic_buttonContainer}>
          <Button
            onClick={goBack}
            className={styles.expenseStatistic_backButton}
          >
            ←
          </Button>
        </div>
        <div className={styles.expenseStatistic_budgetContainer}>
          <TotalResult accountBookId={id} />
        </div>
      </div>
      <div className={styles.expenseStatistic_content}>
        {/* <h2 className={styles.expenseStatistic_totalAmountHeader}>총 지출 내역</h2> */}
        {/* <a
          className={styles.expenseStatistic_tooltipLink}
          data-tooltip-id="expense-info"
          data-tooltip-content="개인 지출 + (공유 지출 / 인원수)"
          data-tooltip-variant="info"
        >
          ?
        </a> */}

        <div className={styles.expenseStatistic_chartsWrapper}>
          <div className={styles.chartsWrapper_title}>일자별 지출</div>
          <div className={styles.expenseStatistic_selectContainer}>
            <Select
              options={dateOptions}
              onChange={handleDateChange}
              placeholder="날짜 선택"
              noOptionsMessage={() => '선택 가능한 날짜가 없습니다.'}
            />
          </div>
          <div className={styles.chartsWrapper_chart}>
            <div className={styles.expenseStatistic_chartContainer}>
              <div className={styles.expenseStatistic_chartTitle}>
                지출 항목
              </div>
              <Bar
                className={styles.categoryChart}
                data={data}
                options={categoryChartOptions}
              />
            </div>
            <div className={styles.expenseStatistic_chartContainer}>
              <div className={styles.expenseStatistic_chartTitle}>
                결제 방법
              </div>
              <Bar
                className={styles.paymentChart}
                data={paymentMethodData}
                options={paymentMethodOptions}
              />
            </div>
          </div>
        </div>
        <div className={styles.expenseStatistic_categorySelection}>
          <div className={styles.categorySelection_title}>지출 한눈에 보기</div>
          <div className={styles.expenseStatistic_total}>
            {/* <div className={styles.total_title}>항목별 지출</div> */}
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
              options={options}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseStatistic;
