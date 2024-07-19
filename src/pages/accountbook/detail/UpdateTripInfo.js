import React, { useState, useRef } from 'react';
import styles from '../../../styles/accountbook/UpdateTripInfo.module.css';
import { formatDate } from '../../../util/calcUtils';
import SearchCountry from '../../../components/SearchCountry';
import {
  ModalOverlay,
  Modal,
  ModalHeader,
  CloseButton,
  Button,
  Input,
} from '../../../styles/StyledComponents';
import { handleNoImage } from '../../../util/swalUtils';

const UpdateTripInfo = ({ isOpen, onClose, onSubmit, accountBook }) => {
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

  //모달 위치 동적 계산
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const inputRef = useRef(null);

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
      handleNoImage();
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

  //모달 위치 동적 계산 함수
  const handleOpenCountryModal = () => {
    if (inputRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      let leftPosition = inputRect.left + window.scrollX;

      // 반응형 조정을 위한 예제 (화면 크기에 따라 위치 조정)
      if (viewportWidth <= 530) { 
        leftPosition = inputRect.left + window.scrollX; 
      } else if (viewportWidth >= 531 && viewportWidth <= 860) {
        leftPosition = inputRect.left + window.scrollX; 
      } else if (viewportWidth >= 861 && viewportWidth <= 1024) {
        leftPosition = inputRect.left + window.scrollX ; 
      }else { 
        leftPosition = inputRect.left + window.scrollX;
      }

      console.log('input 위치:', inputRect); 

      setModalPosition({
        top: inputRect.bottom + window.scrollY,
        left: leftPosition,
      });
    }
    setNewTripInfo((prev) => ({ ...prev, isModalOpen: true }));
  };


  return (
    <>
      {isOpen && (
        <ModalOverlay>
          <Modal>
            <ModalHeader>
              <h4>여행 정보</h4>
              <CloseButton onClick={onClose}>&times;</CloseButton>
            </ModalHeader>
            <form onSubmit={handleUpdateTripInfo}>
              <div className={styles.modal_content}>
                <div className={styles.tripInfo_form}>
                  <div className={styles.tripInfo_formGroup}>
                    <label>여행지</label>
                    <div
                      onClick={handleOpenCountryModal}
                      className={styles.selectedCountry}
                      ref={inputRef}
                    >
                      <img
                        src={newTripInfo.tripInfo.countryFlag}
                        alt={newTripInfo.tripInfo.countryName}
                        className={styles.flag}
                      />
                      <span>{newTripInfo.tripInfo.countryName}</span>
                    </div>
                  </div>
                  <div className={styles.tripInfo_formGroup}>
                    <label>여행 제목</label>
                    <Input
                      type="text"
                      className={styles.tripInfo_title}
                      name="title"
                      value={newTripInfo.tripInfo.title}
                      onChange={handleTripInfoChange}
                      required
                    />
                  </div>
                  <div className={styles.tripInfo_formGroup}>
                    <label>인원 수</label>
                    <Input
                      type="text"
                      className={styles.numberOfPeople}
                      name="numberOfPeople"
                      value={newTripInfo.tripInfo.numberOfPeople}
                      onChange={handleTripInfoChange}
                      required
                    />
                  </div>
                  <div className={styles.tripInfo_formGroup}>
                    <label>여행 일정</label>
                    <div className={styles.datesRow}>
                      <Input
                        type="date"
                        className={styles.startDate}
                        name="startDate"
                        value={formatDate(newTripInfo.tripInfo.startDate)}
                        onChange={handleTripInfoChange}
                        required
                      />
                      <span className={styles.separator}>~</span>
                      <Input
                        type="date"
                        className={styles.endDate}
                        name="endDate"
                        value={formatDate(newTripInfo.tripInfo.endDate)}
                        onChange={handleTripInfoChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.image_container}>
                  <div
                    className={styles.addPhoto_container}
                    onClick={handleImageClick}
                  >
                    <img
                      className={styles.addPhoto_image}
                      src="/images/account/add_photo.png"
                      alt="사진 추가"
                    />
                    업로드
                  </div>
                  <input
                    id="fileInput"
                    className={styles.hidden_input}
                    type="file"
                    accept="image/*"
                    onChange={handleNewImg}
                  />
                  <div className={styles.upload_image_wrapper}>
                    <img
                      className={styles.upload_image}
                      src={
                        newTripInfo.previewImg ||
                        (accountBook.imgName === null
                          ? '/images/dashboard/default_image.png'
                          : `http://localhost:8080/images/${accountBook.imgName}`)
                      }
                      alt="대표이미지"
                    />
                  </div>
                </div>
                <Button className={styles.modify_button} type="submit">
                  수정
                </Button>
              </div>
            </form>
          </Modal>
          {newTripInfo.isModalOpen && (
            <SearchCountry
            onSelectCountry={handleCountrySelect}
            closeModal={() => setNewTripInfo((prev) => ({ ...prev, isModalOpen: false }))}
            modalPosition={modalPosition} // modalPosition을 전달
            />
          )}
        </ModalOverlay>
      )}
    </>
  );
};

export default UpdateTripInfo;
