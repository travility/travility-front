import React, { useEffect, useState } from 'react';
import styles from '../styles/components/UpdateExpense.module.css';
import Swal from 'sweetalert2';
import { deleteExpense, updateExpense } from '../api/expenseApi';
import {
  handleSuccessSubject,
  handlefailureSubject,
} from '../util/logoutUtils';
import {
  ModalOverlay,
  Modal,
  ModalHeader,
  CloseButton,
  Button,
  Input,
} from '../styles/StyledComponents';

const categories = [
  { name: 'TRANSPORTATION', label: '교통' },
  { name: 'FOOD', label: '식비' },
  { name: 'TOURISM', label: '관광' },
  { name: 'ACCOMMODATION', label: '숙박' },
  { name: 'SHOPPING', label: '쇼핑' },
  { name: 'OTHERS', label: '기타' },
];

const paymentMethod = [
  { name: 'CASH', label: '현금' },
  { name: 'CARD', label: '카드' },
];

const UpdateExpense = ({ isOpen, onClose, expense }) => {
  const [newExpense, setNewExpense] = useState({
    expense: {
      expenseDate: expense.expenseDate.split('T')[0],
      expenseTime: expense.expenseDate.split('T')[1],
      title: expense.title,
      category: expense.category,
      memo: expense.memo,
      isShared: expense.isShared,
      paymentMethod: expense.paymentMethod,
      curUnit: expense.curUnit,
      amount: expense.amount,
    },
    newImg: null,
    previewImg: null,
    isDefaultImage: true,
  });
  const [isEditable, setIsEditable] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    console.log(isEditable);
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

  //이미지 클릭 시, input 파일 작동
  const handleImageClick = () => {
    if (isEditable) {
      document.getElementById('fileInput').click();
    }
  };

  //이미지
  const handleNewImg = (e) => {
    if (e.target.files.length === 0) {
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

  //지출 수정
  const handleUpdateExpense = (e) => {
    e.preventDefault();
    const combinedDateTime = `${newExpense.expense.expenseDate}T${newExpense.expense.expenseTime}`; //날짜 + 시간
    const { expenseTime, ...expenseDataWithoutTime } = newExpense.expense; ////expenseTime만 추출하고 나머지는 expenseDataWithoutTime에 담기
    const expenseData = {
      ...expenseDataWithoutTime,
      expenseDate: combinedDateTime,
    };
    const formData = new FormData();
    formData.append('expenseInfo', JSON.stringify(expenseData));
    if (newExpense.newImg) {
      //이미지가 있으면
      formData.append('img', newExpense.newImg);
    }

    console.log(formData.get('expenseInfo'));
    console.log(formData.get('img'));

    updateExpense(expense.id, formData) //id 줘야함
      .then(() => {
        handleSuccessSubject('지출', '수정');
      })
      .catch((error) => {
        console.log(error);
        handlefailureSubject('지출', '수정');
      });
  };

  //지출 삭제
  const handleDeleteExpense = (e) => {
    e.preventDefault();
    deleteExpense(expense.id)
      .then(() => {
        handleSuccessSubject('지출', '삭제');
      })
      .catch((error) => {
        console.log(error);
        handlefailureSubject('지출', '삭제');
      });
  };

  //카테고리 클릭 시, 카테고리 목록 보여주기
  const handleCategoryClick = () => {
    setShowCategories(!showCategories);
  };

  //카테고리
  const selectCategory = (category) => {
    setNewExpense({
      ...newExpense,
      expense: {
        ...newExpense.expense,
        category: category.name,
      },
    });
    setShowCategories(false);
  };

  //카테고리 선택 이미지 color 변경
  const getCategoryImage = (category) => {
    const isSelected = newExpense.expense.category === category;
    return `/images/account/category/${category.toLowerCase()}${
      isSelected ? '_bk' : ''
    }.png`;
  };

  //결제수단
  const handlePaymentMethodChange = (paymentMethod) => {
    setNewExpense({
      ...newExpense,
      expense: {
        ...newExpense.expense,
        paymentMethod: paymentMethod,
      },
    });
  };

  //결제수단 선택 이미지 color 변경
  const getPaymentMethodImage = (method) => {
    const isSelected = newExpense.expense.paymentMethod === method;
    return `/images/account/${method.toLowerCase()}${
      isSelected ? '_bk' : ''
    }.png`;
  };

  //공동경비 or 개인경비
  const handleSharedChange = (e) => {
    const isShared = e.target.name === 'isShared';
    setNewExpense({
      ...newExpense,
      expense: {
        ...newExpense.expense,
        isShared: isShared,
      },
    });
  };

  //편집 가능 상태 여부
  const toggleEditable = (e) => {
    e.preventDefault();
    if (isEditable) {
      handleUpdateExpense(e);
    } else {
      setIsEditable(true);
    }
  };

  return (
    <>
      {isOpen && (
        <ModalOverlay>
          <Modal>
            <form onSubmit={handleUpdateExpense}>
              <ModalHeader>
                <div className={styles.expenseTitle}>
                  <span onClick={isEditable ? handleCategoryClick : undefined}>
                    {newExpense.expense.category}
                  </span>
                  <Input
                    type="title"
                    name="title"
                    value={newExpense.expense.title}
                    readOnly={!isEditable}
                    onChange={handleInputChange}
                  ></Input>
                </div>
                <CloseButton onClick={onClose}>&times;</CloseButton>
              </ModalHeader>
              {showCategories && (
                <div className={styles.categoryContainer}>
                  {categories.map((category) => (
                    <div
                      key={category.name}
                      className={styles.categoryItem}
                      onClick={() => selectCategory(category)}
                    >
                      <img
                        src={getCategoryImage(category.name)}
                        alt={category.label}
                      />
                      <span>{category.label}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className={styles.modalContent}>
                <div>
                  <div className={styles.paymentMethods}>
                    {paymentMethod.map((method) => (
                      <img
                        key={method.name}
                        src={getPaymentMethodImage(method.name)}
                        alt={method.label}
                        onClick={
                          isEditable
                            ? () => handlePaymentMethodChange(method.name)
                            : undefined
                        }
                      />
                    ))}
                  </div>
                  <div className={styles.expenseDate}>
                    <Input
                      type="date"
                      name="expenseDate"
                      value={newExpense.expense.expenseDate}
                      readOnly={!isEditable}
                      onChange={handleInputChange}
                    ></Input>
                    <Input
                      type="time"
                      name="expenseTime"
                      value={newExpense.expense.expenseTime}
                      readOnly={!isEditable}
                      onChange={handleInputChange}
                    ></Input>
                  </div>
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
                  <Input
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
                <div className={styles.expenseMemo}>
                  <input
                    type="text"
                    name="memo"
                    value={newExpense.expense.memo}
                    readOnly={!isEditable}
                    onChange={handleInputChange}
                  ></input>
                </div>
                <div className={styles.expenseDetail}>
                  <span>
                    <Input
                      type="checkbox"
                      name="isShared"
                      checked={newExpense.expense.isShared}
                      disabled={!isEditable}
                      onChange={handleSharedChange}
                    />
                    <label>공동 경비</label>
                    <Input
                      type="checkbox"
                      name="isNotShared"
                      checked={!newExpense.expense.isShared}
                      disabled={!isEditable}
                      onChange={handleSharedChange}
                    />
                    <label>개인 경비</label>
                  </span>
                  <div className={styles.expenseAmount}>
                    <Input
                      type="text"
                      name="curUnit"
                      value={newExpense.expense.curUnit}
                      readOnly={!isEditable}
                      onChange={handleInputChange}
                    ></Input>
                    <Input
                      type="text"
                      name="amount"
                      value={newExpense.expense.amount}
                      readOnly={!isEditable}
                      onChange={handleInputChange}
                    ></Input>
                  </div>
                </div>
                <Button
                  className={styles.updateButton}
                  onClick={toggleEditable}
                >
                  {isEditable ? '편집완료' : '편집하기'}
                </Button>

                <Button
                  name="delete"
                  className={styles.deleteButton}
                  onClick={handleDeleteExpense}
                >
                  삭제
                </Button>
              </div>
            </form>
          </Modal>
        </ModalOverlay>
      )}
    </>
  );
};

export default UpdateExpense;
