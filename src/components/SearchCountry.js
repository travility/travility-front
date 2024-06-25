import React, { useState } from "react";
import styles from "../styles/components/SearchCountry.module.css";

const SearchCountry = ({ countries, onSelectCountry, closeModal }) => {
  const [modalSearchCountry, setModalSearchCountry] = useState("");

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
            placeholder="나라 이름을 입력해주세요"
            value={modalSearchCountry}
            onChange={(e) => setModalSearchCountry(e.target.value)}
            className={styles.modalSearchInput}
          />
          <div className={styles.countryFlags}>
            {filteredCountries.map((country) => (
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
        </div>
      </div>
    </div>
  );
};

export default SearchCountry;
