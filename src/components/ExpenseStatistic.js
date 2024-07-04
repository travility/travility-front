import React, { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import Select from 'react-select';
import { getExpenseStatisticsByDate } from "../../src/api/expenseApi";

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
  const [selectedDate, setSelectedDate] = useState(null);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getExpenseStatisticsByDate(accountBookId);
        setStatistics(data);

        const uniqueDates = Array.from(new Set(data.map(item => item.date)));
        setDates(uniqueDates);
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      }
    };

    fetchData();
  }, [accountBookId]);

  const handleDateChange = (selectedOption) => {
    setSelectedDate(selectedOption ? selectedOption.value : null);
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

  const containerStyle = {
    height: '300px',
    width: '500px',
    margin: '0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  };

  const selectContainerStyle = {
    marginBottom: '20px',
    width: '100%'
  };

  return (
    <div>
      <div style={selectContainerStyle}>
        <Select
          options={options}
          onChange={handleDateChange}
          placeholder="날짜 선택" // 기본값을 "날짜 선택"으로 설정
        />
      </div>
      <div style={containerStyle}>
        <ResponsiveBar
          data={data}
          keys={['amount']}
          indexBy="category"
          margin={{ top: 20, right: 30, bottom: 50, left: 60 }} /* 여백 조정 */
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
          tooltip={({ id, value, data, color }) => (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '5px',
                borderRadius: '3px'
              }}
            >
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  backgroundColor: color,
                  marginRight: '5px'
                }}
              ></div>
              <strong>{data.category}</strong>: {value}
            </div>
          )}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      </div>
    </div>
  );
};

export default ExpenseStatistic;
