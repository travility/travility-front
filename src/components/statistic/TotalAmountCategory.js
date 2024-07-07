import React, { useEffect, useState } from 'react';
import { getTotalCategoryStatistics } from "../../api/expenseApi";

const colors = [
  '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4'
];

const categories = [
  { en: 'TRANSPORTATION', ko: '교통' },
  { en: 'ACCOMMODATION', ko: '숙박' },
  { en: 'FOOD', ko: '식비' },
  { en: 'TOURISM', ko: '관광' },
  { en: 'SHOPPING', ko: '쇼핑' },
  { en: 'OTHERS', ko: '기타' }
];

const TotalAmountCategory = ({ accountBookId }) => {
  const [statistics, setStatistics] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTotalCategoryStatistics(accountBookId);
        setStatistics(data);
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      }
    };

    fetchData();
  }, [accountBookId]);

  return (
    <div style={{ border: '1px solid black', padding: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
      {categories.map((category, index) => {
        const stat = statistics.find(stat => stat.category === category.en);
        return (
          <div key={category.en} style={{ textAlign: 'center' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: colors[index % colors.length],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              margin: '0 auto'
            }}>
              {category.ko}
            </div>
            <div>{stat ? Math.floor(stat.amount) : 0}원</div>
          </div>
        );
      })}
    </div>
  );
};

export default TotalAmountCategory;
