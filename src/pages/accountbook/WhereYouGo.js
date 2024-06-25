//어디로 떠나시나요? 테스트
//CountryFlags 컴포넌트를 업데이트하여 한글 국가명과 매칭되는 국기를 불러오는 기능만 담당하게 하고
//WhereYouGo.js 에서 국가 선택 기능을 구현
//국기와 국가의 한글명을 overflow 스크롤로 보여주면 됨
//인풋태그 같이 생긴 영역('여행지 선택' 이라고 박스 안에 쓰여져 있음)에서 돋보기 아이콘 버튼을 누르면 api가 가진 국기과 한글 국가명이 나오고
//인풋태그에서 검색할 수도 있음
//모달로 띄우기!!
//그 중 하나를 user가 선택해서 db에 저장


import React, { useState } from 'react';
import CountryFlags from '../../components/CountryFlags';
import Modal from './Modal';
import styles from './WhereYouGo.module.css';

const WhereYouGo = () => {
    const [searchCountry, setSearchCountry] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalSearchCountry, setModalSearchCountry] = useState('');
  
    const handleSearch = (event) => {
      setSearchCountry(event.target.value);
    };
  
    const handleModalSearch = (event) => {
      setModalSearchCountry(event.target.value);
    };
  
    const handleSelectCountry = (country) => {
      setSelectedCountry(country);
      setIsModalOpen(false); 
      console.log('선택된 국가:', country);
    };
  
    const openModal = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };
  
    return (
      <div className={styles.whereYouGo}>
        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder="여행지 선택"
            value={searchCountry}
            onClick={openModal} 
            onChange={handleSearch}
            className={styles.searchInput}
          />
          <button className={styles.searchButton} onClick={openModal}>
            <i className="fas fa-search"></i>
          </button>
        </div>
  
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className={styles.modalSearchContainer}>
            <input
              type="text"
              placeholder="국가 검색"
              value={modalSearchCountry}
              onChange={handleModalSearch}
              className={styles.modalSearchInput}
            />
            <CountryFlags onSelectCountry={handleSelectCountry} searchCountry={modalSearchCountry} />
          </div>
        </Modal>
  
        {selectedCountry && (
          <div className={styles.selectedCountry}>
            <img src={selectedCountry.download_url} alt={selectedCountry.country_nm} className={styles.flag} />
            <span>{selectedCountry.country_nm}</span>
          </div>
        )}
      </div>
    );
  };
  
  export default WhereYouGo;
