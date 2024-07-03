import React, { useState } from 'react';
import styles from '../../../styles/accountbook/TripInfo.module.css';
import { formatDate } from '../../../api/accountbookApi';
import Swal from 'sweetalert2';
import SearchCountry from '../../../components/SearchCountry';

const TripInfo = ({ isOpen, onClose, onSubmit, accountBook }) => {
  const [newTripInfo, setNewTripInfo] = useState({
    tripInfo: {
      countryName: accountBook.countryName,
      countryFlag: accountBook.countryFlag,
      title: accountBook.title,
      numberOfPeople: accountBook.numberOfPeople,
      startDate: accountBook.startDate,
      endDate: accountBook.endDate,
    },
    newImg: null,
    previewImg: null,
    isModalOpen: false,
    isDefaultImage: true,
  });

  const handleTripInfoChange = (e) => {
    const { name, value } = e.target;
    setNewTripInfo({
      ...newTripInfo,
      tripInfo: { ...newTripInfo.tripInfo, [name]: value },
    });
  };

  const handleCountrySelect = (country) => {
    setNewTripInfo({
      ...newTripInfo,
      tripInfo: {
        ...newTripInfo.tripInfo,
        countryName: country.country_nm,
        countryFlag: country.download_url,
      },
      isModalOpen: false,
    });
  };

  const handleImageClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleNewImg = (e) => {
    if (e.target.files.length === 0) {
      // 파일 선택 안 했을 때
      return;
    }

    const file = e.target.files[0];

    if (!file.type.startsWith('image/')) {
      Swal.fire({
        title: '이미지 파일 아님',
        text: '이미지 파일만 업로드 가능합니다',
        icon: 'error',
        confirmButtonColor: '#2a52be',
      });
      return;
    }

    setNewTripInfo({
      ...newTripInfo,
      previewImg: URL.createObjectURL(file),
      newImg: file,
      isDefaultImage: false,
    });
  };

  const handleUpdateTripInfo = (e) => {
    e.preventDefault();

    const formData = new FormData(); // 문자열 or Blob 객체만 추가 가능
    formData.append('tripInfo', JSON.stringify(newTripInfo.tripInfo)); // json 문자열로 변환
    if (newTripInfo.newImg) {
      formData.append('img', newTripInfo.newImg);
    }

    onSubmit(formData);
  };

  return (
    <>
      {isOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div className={styles.modalHeader_title}>여행 정보</div>
              <button className={styles.closeButton} onClick={onClose}>
                &times;
              </button>
            </div>
            <form onSubmit={handleUpdateTripInfo}>
              <div className={styles.modalContent}>
                <div className={styles.inputGroup}>
                  <label>여행지</label>
                  <div
                    onClick={() =>
                      setNewTripInfo({ ...newTripInfo, isModalOpen: true })
                    }
                    className={styles.selectedCountryInput}
                  >
                    <img
                      src={newTripInfo.tripInfo.countryFlag}
                      alt={newTripInfo.tripInfo.countryName}
                      className={styles.flag}
                    />
                    <span>{newTripInfo.tripInfo.countryName}</span>
                  </div>
                  <label>여행 제목</label>
                  <input
                    type="text"
                    className={styles.title}
                    name="title"
                    value={newTripInfo.tripInfo.title}
                    onChange={handleTripInfoChange}
                    required
                  />
                  <label>인원 수</label>
                  <input
                    type="text"
                    className={styles.numberOfPeople}
                    name="numberOfPeople"
                    value={newTripInfo.tripInfo.numberOfPeople}
                    onChange={handleTripInfoChange}
                    required
                  />
                  <label>여행 일정</label>
                  <div className={styles.datesRow}>
                    <input
                      type="date"
                      className={styles.startDate}
                      name="startDate"
                      value={formatDate(newTripInfo.tripInfo.startDate)}
                      onChange={handleTripInfoChange}
                      required
                    />
                    <span className={styles.separator}>~</span>
                    <input
                      type="date"
                      className={styles.endDate}
                      name="endDate"
                      value={formatDate(newTripInfo.tripInfo.endDate)}
                      onChange={handleTripInfoChange}
                      required
                    />
                  </div>
                </div>
                <div className={styles.imageContainer}>
                  {newTripInfo.isDefaultImage && (
                    <div className={styles.addPhotoContainer}>
                      <div className={styles.addPhoto_imageContainer}>
                        <img
                          className={styles.addPhoto_image}
                          src="/images/account/add_photo.png"
                          alt="사진 추가"
                        />
                      </div>
                      <div className={styles.addPhoto_text}>
                        사진을 추가하세요
                      </div>
                    </div>
                  )}
                  <input
                    id="fileInput"
                    className={styles.hiddenInput}
                    type="file"
                    accept="image/*"
                    onChange={handleNewImg}
                  />
                  <div
                    className={styles.imageWrapper}
                    onClick={handleImageClick}
                  >
                    <img
                      className={styles.image}
                      src={
                        newTripInfo.previewImg ||
                        `http://localhost:8080/images/${accountBook.imgName}`
                      }
                      alt="대표이미지"
                    />
                  </div>
                </div>
                <button type="submit" className={styles.modifyButton}>
                  수정
                </button>
              </div>
            </form>
          </div>
          {newTripInfo.isModalOpen && (
            <SearchCountry
              onSelectCountry={handleCountrySelect}
              closeModal={() =>
                setNewTripInfo({ ...newTripInfo, isModalOpen: false })
              }
            />
          )}
        </div>
      )}
    </>
  );
};

export default TripInfo;
