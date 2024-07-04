import React, { useEffect, useState } from 'react';
import styles from '../styles/components/UpdateExpense.module.css';
import Swal from 'sweetalert2';
import { deleteExpense, updateExpense } from '../api/expenseApi';
import {
  handleSuccessSubject,
  handlefailureSubject,
} from '../util/logoutUtils';

const UpdateExpense = ({ isOpen, onClose, countryName, expense }) => {
  const [newExpense, setNewExpense] = useState({
    expense: {
      expenseDate: expense.expenseDate.split('T')[0],
      expenseTime: expense.expenseDate.split('T')[1],
      title: expense.title,
      category: expense.category,
      memo: expense.memo,
      isShared: expense.isShared,
      curUnit: expense.curUnit,
      amount: expense.amount,
    },
    newImg: null,
    previewImg: null,
    isDefaultImage: true,
  });
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    console.log(expense);
    console.log(newExpense.expense);
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense({
      ...newExpense,
      expense: {
        ...newExpense.expense,
        [name]: value,
      },
    });
  };

  //공유 경비 여부
  const handleSelectChange = (e) => {
    setNewExpense({
      ...newExpense,
      expense: {
        ...newExpense.expense,
        isShared: e.target.value,
      },
    });
  };

  const handleImageClick = () => {
    if (isEditable) {
      document.getElementById('fileInput').click();
    }
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

    setNewExpense({
      ...newExpense,
      previewImg: URL.createObjectURL(file),
      newImg: file,
      isDefaultImage: false,
    });
  };

  //수정
  const handleUpdateExpense = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('expenseInfo', JSON.stringify(newExpense.expense));
    if (newExpense.newImg) {
      formData.append('img', newExpense.newImg);
    }

    updateExpense(formData)
      .then(() => {
        handleSuccessSubject('지출', '수정');
      })
      .catch((error) => {
        console.log(error);
        handlefailureSubject('지출', '수정');
      });
  };

  //삭제
  const handleDeleteExpense = (e) => {
    e.preventDefault();
    deleteExpense()
      .then(() => {
        handleSuccessSubject('지출', '삭제');
      })
      .catch((error) => {
        console.log(error);
        handlefailureSubject('지출', '삭제');
      });
  };

  return (
    <>
      {isOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.closeButton} onClick={onClose}>
              &times;
            </button>
            <form onSubmit={handleUpdateExpense}>
              <div className={styles.modalContent}>
                <div>
                  <span>{countryName}</span>
                  <span>
                    <input
                      type="date"
                      name="expenseDate"
                      value={newExpense.expense.expenseDate}
                      readOnly={!isEditable}
                      onChange={handleInputChange}
                    ></input>
                    <input
                      type="time"
                      name="expenseTime"
                      value={newExpense.expense.expenseTime}
                      readOnly={!isEditable}
                      onChange={handleInputChange}
                    ></input>
                  </span>
                </div>
                <div>
                  <span>{newExpense.expense.category}</span>
                  <input
                    type="title"
                    name="title"
                    value={newExpense.expense.title}
                    readOnly={!isEditable}
                    onChange={handleInputChange}
                  ></input>
                </div>
                <div className={styles.imageContainer}>
                  {newExpense.isDefaultImage && (
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
                        newExpense.previewImg ||
                        `http://localhost:8080/images/${expense.imgName}`
                      }
                      alt="대표이미지"
                    />
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    name="memo"
                    value={newExpense.expense.memo}
                    readOnly={!isEditable}
                    onChange={handleInputChange}
                  ></input>
                </div>
                <div>
                  <span>
                    <select
                      value={newExpense.expense.isShared}
                      disabled={!isEditable}
                      onChange={handleSelectChange}
                    >
                      <option value="true">공동 경비</option>
                      <option value="false">개인 경비</option>
                    </select>
                  </span>
                  <span>
                    <input
                      type="text"
                      name="curUnit"
                      value={newExpense.expense.curUnit}
                    ></input>
                    <input
                      type="text"
                      value={newExpense.expense.amount}
                    ></input>
                  </span>
                </div>
                {isEditable ? (
                  <button
                    type="submit"
                    name="update"
                    className={styles.updateButton}
                  >
                    편집완료
                  </button>
                ) : (
                  <button
                    className={styles.updateButton}
                    onClick={() => setIsEditable(true)}
                  >
                    편집하기
                  </button>
                )}

                <button
                  name="delete"
                  className={styles.deleteButton}
                  onClick={handleDeleteExpense}
                >
                  삭제하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateExpense;
