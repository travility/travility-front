import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import Select from 'react-select';
import { Tooltip } from 'react-tooltip';
import { getExpenseStatisticsByDate, getPaymentMethodStatisticsByDate, getStatisticsByCategoryAndDates } from "../../api/expenseApi";
import 'chart.js/auto';
import TotalAmountCategory from './TotalAmountCategory';
import TotalResult from '../statistic/TotalResult';
import styles from '../../styles/statistic/ExpenseStatistic.module.css';
import { formatDate } from '../../util/calcUtils'; // import the formatDate function

// 카테고리 목록
const categories = [
  { en: 'TRANSPORTATION', ko: '교통' },
  { en: 'ACCOMMODATION', ko: '숙박' },
  { en: 'FOOD', ko: '식비' },
  { en: 'TOURISM', ko: '관광' },
  { en: 'SHOPPING', ko: '쇼핑' },
  { en: 'OTHERS', ko: '기타' },
  { en: 'ALL', ko: '전체지출' }
];

const categoryMap = {
  'TRANSPORTATION': '교통',
  'ACCOMMODATION': '숙박',
  'FOOD': '식비',
  'TOURISM': '관광',
  'SHOPPING': '쇼핑',
  'OTHERS': '기타',
  'ALL': '전체지출'
};

// 카테고리 색 배열
const colors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#a9a9a9'];

// 결제 방법 목록
const paymentMethods = [
  { en: 'CARD', ko: '카드' },
  { en: 'CASH', ko: '현금' }
];

// 결제방법 색 배열
const paymentColors = ['#A39E93', '#4c66f8'];

const ExpenseStatistic = ({ accountBookId, onBack }) => {
  const [statistics, setStatistics] = useState([]);
  const [paymentMethodStatistics, setPaymentMethodStatistics] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [dates, setDates] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [lineChartData, setLineChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getExpenseStatisticsByDate(accountBookId);
        setStatistics(data);

        const uniqueDates = Array.from(new Set(data.map(item => item.date)));
        setDates(uniqueDates);
        setSelectedDate(uniqueDates[0]); 

        // 기본적으로 첫 번째 날짜 선택
        const paymentData = await getPaymentMethodStatisticsByDate(accountBookId, uniqueDates[0]);
        if (Array.isArray(paymentData)) {
          setPaymentMethodStatistics(paymentData);
        } else {
          console.error("Expected an array but got:", paymentData);
          setPaymentMethodStatistics([]);
        }
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      }
    };

    fetchData();
  }, [accountBookId]);

  // 날짜 선택 핸들러
  const handleDateChange = async (selectedOption) => {
    setSelectedDate(selectedOption.value);
    const paymentData = await getPaymentMethodStatisticsByDate(accountBookId, selectedOption.value);
    if (Array.isArray(paymentData)) {
      setPaymentMethodStatistics(paymentData);
    } else {
      console.error("Expected an array but got:", paymentData);
      setPaymentMethodStatistics([]);
    }
  };

  // 카테고리 선택 핸들러
  const handleCategoryChange = async (event) => {
    const value = event.target.value;
    setSelectedCategories(prevSelectedCategories => 
      prevSelectedCategories.includes(value) 
        ? prevSelectedCategories.filter(category => category !== value) 
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
          const datasets = await Promise.all(selectedCategories.map(async (category) => {
            const data = await getStatisticsByCategoryAndDates(accountBookId, category);
            const colorIndex = categories.findIndex(cat => cat.en === category);
            const backgroundColor = colors[colorIndex] + '80'; // 살짝 투명하게함 50%
            return {
              label: categoryMap[category], // 한글 라벨
              data: dates.map(date => {
                const entry = data.find(d => d.date === date);
                return entry ? entry.amount : 0;
              }),
              borderColor: colors[colorIndex],
              backgroundColor: backgroundColor,
              pointStyle: 'circle', // 포인트 스타일 (꼭짓점)
              pointRadius: 10, // 포인트 크기
              pointHoverRadius: 15, // 호버 포인트 크기 설정
              pointBackgroundColor: backgroundColor,
              pointBorderColor: colors[colorIndex] // 포인트 테두리 색상
            };
          }));
          setLineChartData({ labels: dates.map(formatDate), datasets });
        } catch (error) {
          console.error("Failed to fetch line chart data:", error);
        }
      } else {
        setLineChartData({ labels: dates.map(formatDate), datasets: [{ label: '', data: [], borderColor: 'rgba(0,0,0,0)', fill: false }] });
      }
    };

    if (dates.length > 0) {
      fetchLineChartData();
    }
  }, [selectedCategories, dates]);

  // 선택된 날짜의 카테고리별 데이터 골라먹기
  const filteredData = statistics
    .filter(stat => stat.date === selectedDate)
    .reduce((acc, stat) => {
      acc[stat.category] = stat.amount;
      return acc;
    }, {});

  // 카테고리별 데이터 설정
  const data = {
    labels: categories.map(category => category.ko),
    datasets: [{
      label: '금액',
      data: categories.map(category => filteredData[category.en] || 0),
      backgroundColor: colors,
    }]
  };

  // 결제 방법별 데이터 설정
  const paymentMethodData = {
    labels: paymentMethods.map(method => method.ko),
    datasets: [{
      label: '금액',
      data: paymentMethods.map(method => {
        const stat = paymentMethodStatistics.find(stat => stat.paymentMethod === method.en);
        return stat ? stat.amount : 0;
      }),
      backgroundColor: paymentColors,
    }]
  };

  // 차트 옵션 차트 옵션 차트 옵션 차트 옵션 차트 옵션 차트 옵션 차트 옵션 차트 옵션 차트 옵션 
  const options = {
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          lineWidth: 1, // x축 모든 라인 굵게
          color: "#5e5e5e"
        },
        ticks: {
          color: "#000000", // 폰트 색상
          font: {
            size: 15 // 폰트 크기
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          lineWidth: 1, // y축의 모든 라인 굵게
          color: "#5e5e5e"
        },
        ticks: {
          color: "#000000", // 폰트 색상
          font: {
            size: 14 // 폰트 크기
          }
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: "black", // 범례 폰트 색상
          font: {
            size: 18 // 범례 폰트 크기
          },
          boxWidth: 45 // 범례 박스 너비
        }
      },
      tooltip: {
        mode: 'index', // 툴팁 모드 설정 : 마우스 아무데나 올려놔도 정보 뜸. 안하면 에임잡기 빡셈
        intersect: false, // 교차여부
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`, // 툴팁 한글 라벨
          labelColor: (context) => ({
            borderColor: context.dataset.borderColor,
            backgroundColor: context.dataset.backgroundColor
          })
        }
      }
    }
  };

  // 결제 방법 차트 옵션
  const paymentMethodOptions = {
    ...options,
    categoryPercentage: 0.8,
    barPercentage: 0.7,
  };

  // 날짜 선택 옵션
  const dateOptions = dates.map(date => ({ value: date, label: formatDate(date) }));

  return (
    <div className={styles.statisticsContainer}>
      <div className={styles.headerContainer}>
        <button onClick={onBack} className={styles.backButton}>뒤로가기</button>
        
        <TotalResult accountBookId={accountBookId} />
        
      </div>
      <h2 className={styles.totalAmountHeader}>총 지출 내역</h2>
      <a
          className={styles.tooltipLink}
          data-tooltip-id="expense-info"
          data-tooltip-content="개인 지출 + (공유 지출 / 인원수)"
          data-tooltip-variant="info"
        >
          ?
        </a>
        <Tooltip id="expense-info" />
      <TotalAmountCategory accountBookId={accountBookId} />
      <div>
        <h3>카테고리 선택</h3>
        
        <div className={styles.radioGroup}>
          {categories.map(category => (
            <div key={category.en} className={styles.radioLabel}>
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
          <button onClick={handleClearSelection} className={styles.backButton}>체크해제</button>
        </div>
        
      </div>
      <div className={styles.lineChartContainer}>
        <div className={styles.lineChartWrapper}>
          <Line data={lineChartData} options={options} /> {/* Line = 라인차트 */}
        </div>
      </div>
      <div className={styles.selectContainer}>
        <Select
          options={dateOptions}
          onChange={handleDateChange}
          placeholder="날짜 선택"
          noOptionsMessage={() => "선택 가능한 날짜가 없습니다."}
        />
      </div>
      <div className={styles.chartsWrapper}>
        <div className={`${styles.chartContainer} ${styles.expenseChartContainer}`}>
          <h3 className={styles.chartTitle}>항목별 지출</h3>
          <Bar data={data} options={options}/>
        </div>
        <div className={`${styles.chartContainer} ${styles.paymentChartContainer}`}>
          <h3 className={styles.chartTitle}>결제 방법</h3>
          <Bar data={paymentMethodData} options={paymentMethodOptions} />
        </div>
      </div>
    </div>
  );
};

export default ExpenseStatistic;
