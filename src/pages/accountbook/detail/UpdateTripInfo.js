import React, { useState } from 'react';
import styles from '../../../styles/accountbook/UpdateTripInfo.module.css';
import { formatDate } from '../../../util/calcUtils';
import Swal from 'sweetalert2';
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
                      onClick={() =>
                        setNewTripInfo({ ...newTripInfo, isModalOpen: true })
                      }
                      className={styles.selectedCountry}
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
                        `http://localhost:8080/images/${accountBook.imgName}`
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
              closeModal={() =>
                setNewTripInfo({ ...newTripInfo, isModalOpen: false })
              }
            />
          )}
        </ModalOverlay>
      )}
    </>
  );
};

export default UpdateTripInfo;
