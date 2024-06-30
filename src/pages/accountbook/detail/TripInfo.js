import React, { useEffect, useState } from 'react';
import styles from '../../../styles/accountbook/TripInfo.module.css';
import Destination from '../../../components/Destination';
import Swal from 'sweetalert2';

const TripInfo = ({ isOpen, onClose, onSubmit, accountBook }) => {
  const [countryName, setCountryName] = useState(accountBook.countryName);
  const [countryFlag, setCountryFlag] = useState(accountBook.countryFlag);
  const [title, setTitle] = useState(accountBook.title);
  const [numberOfPeople, setNumberOfPeople] = useState(
    accountBook.numberOfPeople
  );
  const [startDate, setStartDate] = useState(accountBook.startDate);
  const [endDate, setEndDate] = useState(accountBook.endDate);
  const [isDefaultImage, setIsDefaultImage] = useState(true);
  const [previewImg, setPreviewImg] = useState(null);
  const [newImg, setNewImg] = useState(null);

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    return date.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식으로 변환
  };

  const handleCountrySelect = (country) => {
    setCountryName(country.country_nm);
    setCountryFlag(country.download_url);
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleNumberOfPeople = (e) => {
    setNumberOfPeople(e.target.value);
  };

  const handleStartDate = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDate = (e) => {
    setEndDate(e.target.value);
  };

  const handleImageClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleNewImg = (e) => {
    if (e.target.files.length === 0) {
      //파일 선택 안했을 때
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

    setIsDefaultImage(false);
    setNewImg(file);

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImg(reader.result);
    };
    reader.readAsDataURL(file); //파일 데이터를 url로 바꿔서 reader.result에 저장
  };

  const handleUpdateTripInfo = (e) => {
    e.preventDefault();
    const newTripInfo = {
      countryName: countryName,
      countryFlag: countryFlag,
      title: title,
      numberOfPeople: numberOfPeople,
      startDate: startDate,
      endDate: endDate,
    };

    const formData = new FormData(); //문자열 or Blob 객체만 추가 가능
    formData.append('tripInfo', JSON.stringify(newTripInfo)); //json 문자열로 변환
    if (newImg) {
      formData.append('img', newImg);
    }

    onSubmit(formData);
  };

  return (
    <>
      {isOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <button className={styles.closeButton} onClick={onClose}>
                &times;
              </button>
              <div className={styles.modalHeader_title}>여행 정보</div>
            </div>
            <form onSubmit={handleUpdateTripInfo}>
              <div className={styles.modalContent}>
                <Destination
                  initialCountryName={countryName}
                  initialCountryFlag={countryFlag}
                  onCountrySelect={handleCountrySelect}
                />
                <input
                  type="text"
                  className={styles.title}
                  value={title}
                  onChange={handleTitle}
                  required
                ></input>
                <input
                  type="text"
                  className={styles.numberOfPeople}
                  value={numberOfPeople}
                  onChange={handleNumberOfPeople}
                  required
                ></input>

                <div className={styles.dates}>
                  <input
                    type="date"
                    className={styles.startDate}
                    value={formatDate(startDate)}
                    onChange={handleStartDate}
                    required
                  ></input>
                  <span className={styles.separator}>~</span>
                  <input
                    type="date"
                    className={styles.startDate}
                    value={formatDate(endDate)}
                    onChange={handleEndDate}
                    required
                  ></input>
                </div>
                <div className={styles.imageContainer}>
                  {isDefaultImage && (
                    <div className={styles.addPhotoContainer}>
                      <div className={styles.addPhoto_imageContainer}>
                        <img
                          className={styles.addPhoto_image}
                          src="/images/account/add_photo.png"
                          alt="사진 추가"
                        ></img>
                      </div>
                      <div className={styles.addPhoto_text}>
                        사진을 추가하세요
                      </div>
                    </div>
                  )}
                  <input
                    id="fileInput"
                    className={styles.fileInput}
                    type="file"
                    accept="image/*"
                    onChange={handleNewImg}
                  ></input>
                  <div
                    className={styles.imageWrapper}
                    onClick={handleImageClick}
                  >
                    <img
                      className={styles.image}
                      src={
                        previewImg ||
                        'http://localhost:8080/images/' + accountBook.imgName
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
        </div>
      )}
    </>
  );
};

export default TripInfo;
