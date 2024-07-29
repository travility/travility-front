import React, { useEffect, useState } from 'react';
import styles from '../../styles/statistics/TotalAmountCategory.module.css';
import { getTotalExpenditureByCategory } from '../../api/statisticsApi';
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
        const data = await getTotalExpenditureByCategory(accountBookId);
        setStatistics(data);
      } catch (error) {
        console.error('통계를 불러오지 못함 :', error);
      }
    };

    fetchData();
  }, [accountBookId]);

  return (
    <div className={styles.categoryContainer}>
      {categories.map((category, index) => {
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
