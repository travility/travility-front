import React, { useEffect, useState } from 'react';
import { fetchCountryFlags } from '../api/accountbookApi';

const CountryFlags = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const countryFlags = await fetchCountryFlags();
        console.log('패치된 국기:', countryFlags);
        if (Array.isArray(countryFlags)) {
          setData(countryFlags);
        } else {
          throw new Error('데이터가 배열 형태가 아닙니다.');
        }
      } catch (error) {
        console.error('국가 국기 정보를 가져오는 중 오류 발생:', error.message);
      }
    };

    fetchData();
  }, []);
  
  return (
    <div>
      {data.map((country, index) => (
        <div key={index}>
          <div>{country.country_nm}</div>
          <div>
            <img src={country.downloadUrl} alt="country_flag" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CountryFlags;
