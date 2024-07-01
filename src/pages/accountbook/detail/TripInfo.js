import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../../styles/accountbook/TripInfo.module.css";
import { formatDate } from "../../../api/accountbookApi";
import Swal from "sweetalert2";
import SearchCountry from "../../../components/SearchCountry";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          "https://apis.data.go.kr/1262000/CountryFlagService2/getCountryFlagList2?serviceKey=z%2FJgcFj7mwylmN3DSWOtCJ3XE86974ujj%2F53Mfb1YbaHtY84TApx4CYY4ipu%2FLUt%2F7i7Us3aJ5FXWDFvGX3sJQ%3D%3D&numOfRows=220&returnType=JSON"
        );
        setCountries(response.data.data);
      } catch (error) {
        console.error("국가 국기 정보를 가져오는 중 오류 발생:", error.message);
      }
    };

    fetchCountries();
  }, []);

  const handleCountrySelect = (country) => {
    setCountryName(country.country_nm);
    setCountryFlag(country.download_url);
    setIsModalOpen(false);
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
    document.getElementById("fileInput").click();
  };

  const handleNewImg = (e) => {
    if (e.target.files.length === 0) {
      // 파일 선택 안 했을 때
      return;
    }

    const file = e.target.files[0];

    if (!file.type.startsWith("image/")) {
      Swal.fire({
        title: "이미지 파일 아님",
        text: "이미지 파일만 업로드 가능합니다",
        icon: "error",
        confirmButtonColor: "#2a52be",
      });
      return;
    }

    setIsDefaultImage(false);
    setNewImg(file);

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImg(reader.result);
    };
    reader.readAsDataURL(file); // 파일 데이터를 URL로 바꿔서 reader.result에 저장
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

    const formData = new FormData(); // 문자열 or Blob 객체만 추가 가능
    formData.append("tripInfo", JSON.stringify(newTripInfo)); // json 문자열로 변환
    if (newImg) {
      formData.append("img", newImg);
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
                    onClick={() => setIsModalOpen(true)}
                    className={styles.selectedCountryInput}
                  >
                    <img
                      src={countryFlag}
                      alt={countryName}
                      className={styles.flag}
                    />
                    <span>{countryName}</span>
                  </div>
                  <label>여행 타이틀</label>
                  <input
                    type="text"
                    className={styles.title}
                    value={title}
                    onChange={handleTitle}
                    required
                  />
                  <label>인원 수</label>
                  <input
                    type="text"
                    className={styles.numberOfPeople}
                    value={numberOfPeople}
                    onChange={handleNumberOfPeople}
                    required
                  />
                  <label>여행 일정</label>
                  <div className={styles.datesRow}>
                    <input
                      type="date"
                      className={styles.startDate}
                      value={formatDate(startDate)}
                      onChange={handleStartDate}
                      required
                    />
                    <span className={styles.separator}>~</span>
                    <input
                      type="date"
                      className={styles.endDate}
                      value={formatDate(endDate)}
                      onChange={handleEndDate}
                      required
                    />
                  </div>
                </div>
                <div className={styles.imageContainer}>
                  {isDefaultImage && (
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
                        previewImg ||
                        "http://localhost:8080/images/" + accountBook.imgName
                      }
                      alt="대표 이미지"
                    />
                  </div>
                </div>
                <button type="submit" className={styles.modifyButton}>
                  수정
                </button>
              </div>
            </form>
          </div>
          {isModalOpen && (
            <SearchCountry
              countries={countries}
              onSelectCountry={handleCountrySelect}
              closeModal={() => setIsModalOpen(false)}
            />
          )}
        </div>
      )}
    </>
  );
};

export default TripInfo;
