import React, { useEffect, useState } from 'react';
import styles from '../styles/components/SearchCountry.module.css';
import { fetchCountryFlags } from '../api/accountbookApi';
import { Scrollbar } from 'react-scrollbars-custom';

const SearchCountry = ({ onSelectCountry, closeModal }) => {
  const [modalSearchCountry, setModalSearchCountry] = useState('');
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetchCountryFlags();
        setCountries(response.data);
      } catch (error) {
        console.error('국가 국기 정보를 가져오는 중 오류 발생:', error.message);
      }
    };

    fetchCountries();
  }, []);

  const filteredCountries = countries.filter((country) =>
    country.country_nm.includes(modalSearchCountry)
  );

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={closeModal}>
          &times;
        </button>
        <div className={styles.modalSearchContainer}>
          <input
            type="text"
            placeholder="나라 이름을 입력해주세요."
            value={modalSearchCountry}
            onChange={(e) => setModalSearchCountry(e.target.value)}
            className={styles.modalSearchInput}
          />
          <Scrollbar
            style={{ height: '200px' }}
            className={styles.customScrollbar}
          >
            <div className={styles.countryFlags}>
              {filteredCountries
                .filter((country) =>
                  country.country_nm.includes(modalSearchCountry)
                )
                .map((country) => (
                  <div
                    key={country.country_iso_alp2}
                    className={styles.dropdownItem}
                    onClick={() => onSelectCountry(country)}
                  >
                    <img
                      src={country.download_url}
                      alt={country.country_nm}
                      className={styles.flag}
                    />
                    <div>{country.country_nm}</div>
                  </div>
                ))}
            </div>
          </Scrollbar>
        </div>
      </div>
    </div>
  );
};

export default SearchCountry;
