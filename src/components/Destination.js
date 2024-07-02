import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/components/Destination.module.css';
import ModalContent from './SearchCountry';


const Destination = ({
  initialCountryName,
  initialCountryFlag,
  onCountrySelect,
}) => {
  const [searchCountry, setSearchCountry] = useState('');
  const [selectedCountry, setSelectedCountry] = useState({
    country_nm: initialCountryName,
    download_url: initialCountryFlag,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
    setIsModalOpen(false);
    onCountrySelect(country);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.destination}>
      <div className={styles.inputContainer}>
        <div className={styles.selectedCountryInput} onClick={openModal}>
          {selectedCountry.country_nm ? (
            <>
              <img
                src={selectedCountry.download_url}
                alt={selectedCountry.country_nm}
                className={styles.flag}
              />
              <span>{selectedCountry.country_nm}</span>
            </>
          ) : (
            <input
              type="text"
              placeholder="여행지 선택"
              value={searchCountry}
              readOnly
              className={styles.searchInput}
            />
          )}
        </div>
        <button className={styles.searchButton} onClick={openModal}>
          <img src="/images/main/mainPage/search_br.png" alt="Search" />
        </button>
      </div>

      {isModalOpen && (
        <ModalContent
          countries={countries}
          onSelectCountry={handleSelectCountry}
          closeModal={closeModal}
        />

      )}
    </div>
  );
};

export default Destination;
