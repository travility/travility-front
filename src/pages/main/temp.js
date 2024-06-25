import React, { useState, useEffect } from 'react';
import { test } from '../../api/memberApi';
import styles from '../../styles/main/Temp.module.css';

const Temp = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    test().then((response) => {
      console.log(response);
      console.log(response.data);
      setData(response.data);
    });
  }, []); // 빈 배열을 의존성 배열로 전달

  return (
    <div>
      <div className={styles.temp_container}>
        {data.map((country, index) => (
          <div key={index}>
            <div>{country.country_nm}</div>
            <div>
              <img src={country.download_url} alt="country_flag" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Temp;
