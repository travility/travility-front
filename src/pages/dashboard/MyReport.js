import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import DefaultSidebar from '../../components/DefaultSidebar';
import styles from '../../styles/dashboard/MyReport.module.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const data = {
  labels: ['숙박', '교통', '쇼핑', '식비', '관광', '기타'],
  datasets: [
    {
      label: 'KRW',
      data: [300000, 200000, 180000, 90000, 70000, 190000], // ['숙박', '교통', '쇼핑', '식비', '관광', '기타'] 순으로
      backgroundColor: ['#4bc0c0', '#36a2eb', '#ffcd56', '#ff9f40', '#9966ff', '#c9cbcf'],
    },
  ],
};

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
  },
};

const barData = {
  labels: ['현금', '카드'],
  datasets: [
    {
      label: 'KRW',
      data: [1000000, 2000000], // 현금, 카드 결제금액
      backgroundColor: ['#e0e0e0', '#2c73d2'],
    },
  ],
};

const barOptions = {
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

const MyReport = () => {
  return (
    <div className={styles.dashboard_container}>
      <DefaultSidebar />
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>지출 통계</h1>
        </div>
        <div className={styles.stats}>
          <div className={styles.chart_container}>
            <Doughnut data={data} options={options} />
          </div>
          <div className={styles.summary}>
            <p>
              문태준님은 <span className={styles.highlight_category}>숙박</span>에 가장 많은 소비를 하고,{' '}<br />
              <span className={styles.highlight_paymentMethod}>카드</span>를 더 많이 이용했어요.
            </p>
            <div className={styles.bar_container}>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>
        <div className={styles.expenses}>
          <div className={styles.expense_item}>
            <p>숙박</p>
            <p>USD 12,000</p>
            <p>KRW 320,000</p>
          </div>
          <div className={styles.expense_item}>
            <p>교통</p>
            <p>USD 0</p>
            <p>KRW 180,000</p>
          </div>
          <div className={styles.expense_item}>
            <p>쇼핑</p>
            <p>USD 12,000</p>
            <p>KRW 320,000</p>
          </div>
          <div className={styles.expense_item}>
            <p>식비</p>
            <p>USD 12,000</p>
            <p>KRW 320,000</p>
          </div>
          <div className={styles.expense_item}>
            <p>관광</p>
            <p>USD 0</p>
            <p>KRW 320,000</p>
          </div>
          <div className={styles.expense_item}>
            <p>기타</p>
            <p>USD 12,000</p>
            <p>KRW 320,000</p>
          </div>
        </div>
        <div className={styles.total_expenses}>
          <p>총 지출</p>
          <p className={styles.total_amount}>₩ 3,188,800</p>
        </div>
      </div>
    </div>
  );
};

export default MyReport;
