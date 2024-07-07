import React, { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import Select from 'react-select';
import { getExpenseStatisticsByDate } from "../../api/expenseApi";
import ExpenseStatisticPaymentMethod from './ExpenseStatisticPaymentMethod';
import styles from '../../styles/statistic/ExpenseStatistic.module.css';

const categories = [
  { en: 'TRANSPORTATION', ko: '교통' },
  { en: 'ACCOMMODATION', ko: '숙박' },
  { en: 'FOOD', ko: '식비' },
  { en: 'TOURISM', ko: '관광' },
  { en: 'SHOPPING', ko: '쇼핑' },
  { en: 'OTHERS', ko: '기타' }
];
const colors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4'];

const ExpenseStatistic = ({ accountBookId }) => {
  const [statistics, setStatistics] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [dates, setDates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getExpenseStatisticsByDate(accountBookId);
        setStatistics(data);

        const uniqueDates = Array.from(new Set(data.map(item => item.date)));
        setDates(uniqueDates);
        setSelectedDate(uniqueDates[0]); // 기본적으로 첫 번째 날짜 선택
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      }
    };

    fetchData();
  }, [accountBookId]);

  const handleDateChange = (selectedOption) => {
    setSelectedDate(selectedOption.value);
  };

  const filteredData = statistics
    .filter(stat => stat.date === selectedDate)
    .reduce((acc, stat) => {
      acc[stat.category] = stat.amount;
      return acc;
    }, {});

  const data = categories.map((category, index) => ({
    category: category.ko,
    amount: filteredData[category.en] || 0,
    color: colors[index % colors.length]
  }));

  const options = dates.map(date => ({ value: date, label: date }));

  return (
    <div className={styles.statisticsContainer}>
      <div className={styles.selectContainer}>
        <Select
          options={options}
          onChange={handleDateChange}
          defaultValue={{ value: selectedDate, label: selectedDate }}
          placeholder="날짜 선택"
        />
      </div>
      <div className={styles.chartsContainer}>
        <div className={styles.chart}>
          <ResponsiveBar
            data={data}
            keys={['amount']}
            indexBy="category"
            margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
            padding={0.3}
            layout="horizontal"
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={({ data }) => data.color}
            borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Amount',
              legendPosition: 'middle',
              legendOffset: 32,
              tickTextColor: '#333'
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Category',
              legendPosition: 'middle',
              legendOffset: -40,
              tickTextColor: '#333'
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            tooltip={({ id, value, color }) => (
              <div
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  padding: '5px',
                  borderRadius: '3px'
                }}
              >
                <strong style={{ color }}>{id}</strong>: {value}
              </div>
            )}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
          />
        </div>
        <ExpenseStatisticPaymentMethod accountBookId={accountBookId} selectedDate={selectedDate} />
      </div>
    </div>
  );
};

export default ExpenseStatistic;
