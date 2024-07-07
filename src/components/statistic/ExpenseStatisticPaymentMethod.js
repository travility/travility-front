import React, { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { getPaymentMethodStatisticsByDate } from "../../api/expenseApi";
import styles from '../../styles/statistic/ExpenseStatistic.module.css';

const paymentMethods = [
  { en: 'CARD', ko: '카드', color: '#A39E93' },
  { en: 'CASH', ko: '현금', color: '#4c66f8' }
];

const ExpenseStatisticPaymentMethod = ({ accountBookId, selectedDate }) => {
  const [statistics, setStatistics] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPaymentMethodStatisticsByDate(accountBookId, selectedDate);
        setStatistics(data);
      } catch (error) {
        console.error("Failed to fetch payment method statistics:", error);
      }
    };

    if (selectedDate) {
      fetchData();
    }
  }, [accountBookId, selectedDate]);

  const data = paymentMethods.map((method) => {
    const stat = statistics.find(stat => stat.paymentMethod === method.en);
    return {
      method: method.ko,
      amount: stat ? stat.amount : 0,
      color: method.color
    };
  });

  return (
    <div className={styles.chart}>
      <ResponsiveBar
        data={data}
        keys={['amount']}
        indexBy="method"
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
          legend: 'Payment Method',
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
  );
};

export default ExpenseStatisticPaymentMethod;
