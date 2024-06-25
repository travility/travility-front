import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './CountryFlags.module.css';

const CountryFlags = ({ onSelectCountry, searchCountry }) => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountryFlags = async () => {
      try {
        const response = await axios.get(
          'https://apis.data.go.kr/1262000/CountryFlagService2/getCountryFlagList2?serviceKey=z%2FJgcFj7mwylmN3DSWOtCJ3XE86974ujj%2F53Mfb1YbaHtY84TApx4CYY4ipu%2FLUt%2F7i7Us3aJ5FXWDFvGX3sJQ%3D%3D&numOfRows=220&returnType=JSON'
        );
        const countryData = response.data.data;
        setCountries(countryData);
      } catch (error) {
        console.error('국가 국기 정보를 가져오는 중 오류 발생:', error.message);
      }
    };

    fetchCountryFlags();
  }, []);

  const filteredCountries = countries.filter((country) =>
    country.country_nm.includes(searchCountry)
  );

  return (
    <div className={styles.countryFlags}>
      {filteredCountries.map((country) => (
        <div
          key={country.country_iso_alp2}
          className={styles.dropdownItem}
          onClick={() => onSelectCountry(country)}
        >
          <img src={country.download_url} alt={country.country_nm} className={styles.flag} />
          <div>{country.country_nm}</div>
        </div>
      ))}
    </div>
  );
};

export default CountryFlags;
