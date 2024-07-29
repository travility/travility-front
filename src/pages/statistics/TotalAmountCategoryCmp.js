import React, { useEffect, useState } from 'react';
import { getTotalCategoryStatistics } from '../../api/expenseApi';
import styles from '../../styles/statistics/TotalAmountCategory.module.css';
import { getExpenditureByCategory } from '../../api/statisticsApi';
import { formatNumberWithCommas } from '../../util/calcUtils';

// 총 지출내역 밑에 카테고리별 총지출 써져있는거
const categories = [
  { en: 'ACCOMMODATION', ko: '숙박' },
  { en: 'TRANSPORTATION', ko: '교통' },
  { en: 'SHOPPING', ko: '쇼핑' },
  { en: 'FOOD', ko: '식비' },
  { en: 'TOURISM', ko: '관광' },
  { en: 'OTHERS', ko: '기타' },
];

const categoryColors = ['textColor'];

const TotalAmountCategory = ({ accountBookId }) => {
  const [statistics, setStatistics] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTotalCategoryStatistics(accountBookId);
        const data2 = await getExpenditureByCategory(accountBookId);
        console.log(data);
        console.log(data2);
        // if (Array.isArray(data)) {
        //   setStatistics(data);
        // } else {
        //   console.error('데이터 포매팅 잘 안됨 :', data);
        // }
        setStatistics(data2);
      } catch (error) {
        console.error('통계를 불러오지 못함 :', error);
      }
    };

    fetchData();
  }, [accountBookId]);

  return (
    <div className={styles.categoryContainer}>
      {categories.map((category, index) => {
        // const stat = statistics.find((stat) => stat.category === category.en);
        // const amount = stat ? stat.amount : 0;
        const amount = statistics[category.en] || 0;
        return (
          <div
            key={category.en}
            className={styles.categoryBox}
            style={{ borderColor: categoryColors[0] }}
          >
            <span className={styles.categoryName}>{category.ko}</span>
            <span className={styles.categoryAmount}>
              {formatNumberWithCommas(amount.toFixed(0))}원
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default TotalAmountCategory;
