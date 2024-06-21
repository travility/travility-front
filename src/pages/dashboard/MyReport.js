import React, { useState, useEffect } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBus, faShoppingCart, faUtensils, faLandmark, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import DefaultSidebar from '../../components/DefaultSidebar';
import styles from '../../styles/dashboard/MyReport.module.css';
import { getExpenseStatistics } from '../../api/expenseApi';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// 도넛 그래프
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
  elements: {
    arc: {
      borderWidth: 2,
    },
  },
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

const getCategoryIcon = (category) => {
  switch (category) {
    case '숙박':
    case 'ACCOMMODATION':
      return faBed;
    case '교통':
    case 'TRANSPORTATION':
      return faBus;
    case '쇼핑':
    case 'SHOPPING':
      return faShoppingCart;
    case '식비':
    case 'FOOD':
      return faUtensils;
    case '관광':
    case 'TOURISM':
      return faLandmark;
    case '기타':
    case 'OTHERS':
      return faEllipsisH;
    default:
      return faEllipsisH;
  }
};

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
      return category; // 기본적으로 원래 카테고리 이름을 반환
  }
};

const MyReport = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [categoryData, setCategoryData] = useState({ labels: [], datasets: [{ data: [] }] }); // 도넛 그래프
  const [paymentData, setPaymentData] = useState({ labels: [], datasets: [{ data: [] }] });
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getExpenseStatistics();
        console.log('Fetched Data:', data);
        const categories = data.categories || [];
        const amounts = data.amounts || [];
        const paymentMethods = data.paymentMethods || [];
        const total = data.totalAmount || 0;

        // 카테고리별 지출이 0이어도 출력되게 하고싶음
        const allCategories = ['ACCOMMODATION', 'TRANSPORTATION', 'SHOPPING', 'FOOD', 'TOURISM', 'OTHERS'];
        const categoryAmounts = allCategories.map(category => {
          const index = categories.indexOf(category);
          return index !== -1 ? amounts[index] : 0;
        });

        setCategoryData({
          labels: allCategories.map(getCategoryName),
          datasets: [
            {
              label: 'KRW',
              data: categoryAmounts,
              backgroundColor: ['#4bc0c0', '#36a2eb', '#ffcd56', '#ff9f40', '#9966ff', '#c9cbcf'],
            },
          ],
        });

        setPaymentData({
          labels: paymentMethods.map(pm => pm.paymentMethod),
          datasets: [
            {
              label: 'KRW',
              data: paymentMethods.map(pm => pm.amount),
              backgroundColor: ['#e0e0e0', '#2c73d2'],
            },
          ],
        });

        setTotalAmount(total);

        const expenseList = allCategories.map((category, index) => ({
          icon: getCategoryIcon(category),
          name: getCategoryName(category),
          amount: categoryAmounts[index],
        }));
        setExpenses(expenseList);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <div className={styles.dashboard_container}>
      <DefaultSidebar />
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>지출 통계</h1>
        </div>
        <div className={styles.stats}>
          <div className={styles.chart_container}>
            <Doughnut data={categoryData} options={options} />
          </div>
          <div className={styles.summary}>
            <p>
              문태준님은 <span className={styles.highlight_category}>숙박</span>에 가장 많은 소비를 하고,{' '}
              <span className={styles.highlight_paymentMethod}>카드</span>로 가장 많이 결제하셨어요.
            </p>
            <div className={styles.bar_container}>
              <Bar data={paymentData} options={barOptions} />
            </div>
          </div>
        </div>
        <div className={styles.expenses}>
          {expenses.map((expense, index) => (
            <div key={index} className={styles.expense_item}>
              <FontAwesomeIcon icon={expense.icon} size="lg" />
              <p>{expense.name}</p>
              <p>KRW {expense.amount.toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className={styles.total_expenses}>
          <span>총 지출</span> <span className={styles.total_amount}>₩ {totalAmount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default MyReport;
