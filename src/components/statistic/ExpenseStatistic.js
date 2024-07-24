import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import Select from "react-select";
import { Tooltip } from "react-tooltip";
import {
  getExpenseStatisticsByDate,
  getPaymentMethodStatisticsByDate,
  getStatisticsByCategoryAndDates,
} from "../../api/expenseApi";
import "chart.js/auto";
import TotalAmountCategory from "./TotalAmountCategory";
import TotalResult from "../statistic/TotalResult";
import { useNavigate, useParams } from "react-router-dom";
import { formatDate } from "../../util/calcUtils";
import { Button } from "../../styles/StyledComponents";
import styles from "../../styles/statistic/ExpenseStatistic.module.css";
import { selectStyles3 } from "../../util/CustomStyles";
import { useTheme } from "../../styles/Theme";

// 카테고리 목록
const categories = [
  { en: "ACCOMMODATION", ko: "숙박" },
  { en: "TRANSPORTATION", ko: "교통" },
  { en: "SHOPPING", ko: "쇼핑" },
  { en: "FOOD", ko: "식비" },
  { en: "TOURISM", ko: "관광" },
  { en: "OTHERS", ko: "기타" },
  { en: "ALL", ko: "전체지출" },
];

const categoryMap = {
  ACCOMMODATION: "숙박",
  TRANSPORTATION: "교통",
  SHOPPING: "쇼핑",
  FOOD: "식비",
  TOURISM: "관광",
  OTHERS: "기타",
  ALL: "전체지출",
};

// 카테고리 색 배열
const colors = [
  "#23C288",
  "#7697F9",
  "#9B80E9",
  "#FEC144",
  "#B5CE2A",
  "#828C98",
  "#ff8bd2",
];

// 결제 방법 목록
const paymentMethods = [
  { en: "CASH", ko: "현금" },
  { en: "CARD", ko: "카드" },
];

// 결제방법 색 배열
const paymentColors = ["#FFBBE5", "#2c73d2"];

const ExpenseStatistic = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState([]);
  const [paymentMethodStatistics, setPaymentMethodStatistics] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [dates, setDates] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(["ALL"]);
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [],
  });

  const { theme } = useTheme();

  const getChartFontSize = () => {
    const width = window.innerWidth;
    if (width < 480) {
      return 8;
    } else if (width < 768) {
      return 10;
    } else {
      return 14;
    }
  };

  const getLineChartLineWidth = () => {
    const width = window.innerWidth;
    if (width < 480) {
      return 1;
    } else {
      return 2;
    }
  };

  const getChartOptions = (darkMode) => ({
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          lineWidth: 1,
          color: darkMode ? "#888888" : "#d1d1d1",
        },
        ticks: {
          color: darkMode ? "white" : "black",
          font: {
            size: getChartFontSize(),
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          lineWidth: 1,
          color: darkMode ? "#888888" : "#d1d1d1",
        },
        ticks: {
          color: darkMode ? "white" : "black",
          font: {
            size: getChartFontSize(),
          },
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
        labels: {
          color: darkMode ? "white" : "black",
          font: {
            size: getChartFontSize(),
          },
          boxWidth: 45,
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`,
          labelColor: (context) => ({
            borderColor: context.dataset.borderColor,
            backgroundColor: context.dataset.backgroundColor,
          }),
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getExpenseStatisticsByDate(id);
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
          console.error("Expected an array but got:", paymentData);
          setPaymentMethodStatistics([]);
        }
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const handleResize = () => {
      setLineChartOptions(getChartOptions(theme === "dark"));
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [theme]);

  const [lineChartOptions, setLineChartOptions] = useState(
    getChartOptions(theme === "dark")
  );

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
      console.error("Expected an array but got:", paymentData);
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

  // 라인차트 숙박 ~ 전체지출
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
              const backgroundColor = colors[colorIndex] + "80"; // 살짝 투명하게함 50%
              return {
                label: categoryMap[category], // 한글 라벨
                data: dates.map((date) => {
                  const entry = data.find((d) => d.date === date);
                  return entry ? entry.amount : 0;
                }),
                borderColor: colors[colorIndex],
                backgroundColor: backgroundColor,
                pointStyle: "circle", // 포인트 스타일 (꼭짓점)
                pointRadius: 5, // 포인트 크기
                pointHoverRadius: 10, // 호버 포인트 크기 설정
                pointBackgroundColor: backgroundColor,
                pointBorderColor: colors[colorIndex], // 포인트 테두리 색상
              };
            })
          );
          setLineChartData({ labels: dates.map(formatDate), datasets });
        } catch (error) {
          console.error("Failed to fetch line chart data:", error);
        }
      } else {
        setLineChartData({
          labels: dates.map(formatDate),
          datasets: [
            { label: "", data: [], borderColor: "rgba(0,0,0,0)", fill: false },
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
        label: "금액",
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
        label: "금액",
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

  const options = getChartOptions(theme === "dark");

  // 항목별 지출 차트 옵션
  const categoryChartOptions = getChartOptions(theme === "dark");

  // 결제 방법 차트 옵션
  const paymentMethodOptions = getChartOptions(theme === "dark");

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
          <div className={styles.expenseStatistic_date_container}>
            <div className={styles.chartsWrapper_title}>📆 일자별 지출</div>
            <Select
              options={dateOptions}
              onChange={handleDateChange}
              placeholder="날짜 선택"
              noOptionsMessage={() => "선택 가능한 날짜가 없습니다."}
              styles={selectStyles3}
            />
            <div className={styles.expenseStatistic_day_selectContainer}></div>
          </div>
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
    </div>
  );
};

export default ExpenseStatistic;
