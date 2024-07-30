import React, { useState, useRef } from "react";
import styles from "../../../styles/accountbook/detail/UpdateTripInfo.module.css";
import { formatDate } from "../../../util/calcUtils";
import SearchCountry from "../../common/SearchCountryModal";
import {
  ModalOverlay,
  Modal,
  ModalHeader,
  CloseButton,
  Button,
  Input,
  DateInput,
  ErrorMessage,
} from "../../../styles/common/StyledComponents";
import {
  handleFailureSubject,
  handleNoImage,
  handleSuccessSubjectNotReload,
} from "../../../util/swalUtils";
import Swal from "sweetalert2";
import { deleteAccountBook } from "../../../api/accountbookApi";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "../../../config/apiConfig";

const UpdateTripInfo = ({
  isOpen,
  onClose,
  isSettlement,
  onSubmit,
  accountBook,
}) => {
  const [oirginalTripInfo] = useState({
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
  const [newTripInfo, setNewTripInfo] = useState({ ...oirginalTripInfo });
  const [titleError, setTitleError] = useState(""); // 글자수 에러 메세지
  const [inputCount, setInputCount] = useState(
    oirginalTripInfo.tripInfo.title.length
  ); // 글자수 변경 카운트
  const [isEditable, setIsEditable] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 }); //모달 위치 동적 계산
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const handleTripInfoChange = (e) => {
    const { name, value } = e.target;
    if (name === "title") {
      if (value.length <= 22) {
        setTitleError("");
      } else {
        setTitleError("제목은 공백 포함 22 글자까지 입력 가능합니다.");
      }
      setInputCount(value.length > 22 ? 22 : value.length);
    }

    console.log(value);
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
    document.getElementById("fileInput").click();
  };

  //이미지 수정
  const handleNewImg = (e) => {
    if (e.target.files.length === 0) {
      // 파일 선택 안 했을 때
      return;
    }

    const file = e.target.files[0];

    if (!file.type.startsWith("image/")) {
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

  //편집 가능 상태 여부
  const toggleEditable = (e) => {
    e.preventDefault();
    if (isEditable) {
      handleUpdateTripInfo(e);
    } else {
      setIsEditable(true);
    }
  };

  // 편집모드 취소
  const handleCancelEdit = (e) => {
    e.preventDefault();
    setNewTripInfo({ ...oirginalTripInfo }); //취소할 경우 원래 상태로 되돌아감
    setIsEditable(false);
  };

  //가계부 수정
  const handleUpdateTripInfo = (e) => {
    e.preventDefault();

    const formData = new FormData(); // 문자열 or Blob 객체만 추가 가능
    formData.append("tripInfo", JSON.stringify(newTripInfo.tripInfo)); // json 문자열로 변환
    if (newTripInfo.newImg) {
      formData.append("img", newTripInfo.newImg);
    }

    onSubmit(formData);
  };

  // 가계부 삭제
  const handleDeleteTripInfo = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "정말로 삭제하시겠습니까?",
      text: "가계부 내용이 전부 삭제됩니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--main-color)",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAccountBook(accountBook.id)
          .then(() => {
            handleSuccessSubjectNotReload(
              "가계부",
              "삭제",
              navigate,
              "/accountbook/list"
            );
          })
          .catch((error) => {
            console.log(error);
            handleFailureSubject("가계부", "삭제");
          });
      }
    });
  };

  //모달 위치 동적 계산 함수
  const handleOpenCountryModal = () => {
    if (isEditable) {
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
          leftPosition = inputRect.left + window.scrollX;
        } else {
          leftPosition = inputRect.left + window.scrollX;
        }

        setModalPosition({
          top: inputRect.bottom + window.scrollY,
          left: leftPosition,
        });
      }
      setNewTripInfo((prev) => ({ ...prev, isModalOpen: true }));
    }
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
                      name="title"
                      className={`${styles.tripInfo_title} ${
                        !isEditable ? styles.readOnlyInput : ""
                      }`}
                      value={newTripInfo.tripInfo.title}
                      readOnly={!isEditable}
                      onChange={handleTripInfoChange}
                      maxLength="22"
                      required
                    />
                  </div>
                  {isEditable && (
                    <div className="error_container">
                      {titleError && <ErrorMessage>{titleError}</ErrorMessage>}
                      <span className={styles.tripInfo_title_count}>
                        {inputCount}/22 자
                      </span>
                    </div>
                  )}
                  <div className={styles.tripInfo_formGroup}>
                    <label>인원 수</label>
                    <Input
                      type="text"
                      name="numberOfPeople"
                      className={`${styles.numberOfPeople} ${
                        !isEditable ? styles.readOnlyInput : ""
                      }`}
                      value={newTripInfo.tripInfo.numberOfPeople}
                      readOnly={!isEditable}
                      onChange={handleTripInfoChange}
                      required
                    />
                  </div>
                  <div className={styles.tripInfo_formGroup}>
                    <label>여행 일정</label>
                    <div className={styles.datesRow}>
                      <DateInput
                        name="startDate"
                        className={`${styles.startDate} ${
                          !isEditable ? styles.readOnlyInput : ""
                        }`}
                        value={formatDate(newTripInfo.tripInfo.startDate)}
                        readOnly={!isEditable}
                        onChange={handleTripInfoChange}
                        required
                      />
                      <span className={styles.separator}>~</span>
                      <DateInput
                        name="endDate"
                        className={`${styles.endDate} ${
                          !isEditable ? styles.readOnlyInput : ""
                        }`}
                        value={formatDate(newTripInfo.tripInfo.endDate)}
                        readOnly={!isEditable}
                        onChange={handleTripInfoChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.image_container}>
                  {!isSettlement && isEditable && (
                    <div
                      className={styles.addPhoto_container}
                      onClick={handleImageClick}
                    >
                      <img
                        className={styles.addPhoto_image}
                        src="/images/accountbook/add_photo.png"
                        alt="사진 추가"
                      />
                      업로드
                    </div>
                  )}
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
                          ? "/images/dashboard/default_image.png"
                          : `${SERVER_URL}/uploaded-images/${accountBook.imgName}`)
                      }
                      alt="대표이미지"
                    />
                  </div>
                </div>
                <div className={styles.buttonGroup}>
                  {!isSettlement && (
                    <>
                      <Button
                        className={styles.updateButton}
                        onClick={toggleEditable}
                      >
                        {isEditable ? "편집완료" : "편집하기"}
                      </Button>
                      <div className={styles.cancelAndDelete}>
                        {isEditable && (
                          <Button
                            className={styles.cancel_button}
                            onClick={handleCancelEdit}
                          >
                            취소
                          </Button>
                        )}
                        <Button
                          name="delete"
                          className={styles.delete_button}
                          onClick={handleDeleteTripInfo}
                        >
                          삭제
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </form>
          </Modal>
          {newTripInfo.isModalOpen && (
            <SearchCountry
              onSelectCountry={handleCountrySelect}
              closeModal={() =>
                setNewTripInfo((prev) => ({ ...prev, isModalOpen: false }))
              }
              modalPosition={modalPosition} // modalPosition을 전달
            />
          )}
        </ModalOverlay>
      )}
    </>
  );
};

export default UpdateTripInfo;
