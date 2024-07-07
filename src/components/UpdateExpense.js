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
import Select from 'react-select';

const categories = [
  {
    name: 'TRANSPORTATION',
    label: '교통',
    img: '/images/account/category/transportation_bk.png',
  },
  { name: 'FOOD', label: '식비', img: '/images/account/category/food_bk.png' },
  {
    name: 'TOURISM',
    label: '관광',
    img: '/images/account/category/tourism_bk.png',
  },
  {
    name: 'ACCOMMODATION',
    label: '숙박',
    img: '/images/account/category/accommodation_bk.png',
  },
  {
    name: 'SHOPPING',
    label: '쇼핑',
    img: '/images/account/category/shopping_bk.png',
  },
  {
    name: 'OTHERS',
    label: '기타',
    img: '/images/account/category/others_bk.png',
  },
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

  useEffect(() => {
    console.log(isEditable);
    console.log(expense);
    console.log(newExpense.expense);
  }, [isEditable, expense, newExpense.expense]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewExpense({
      ...newExpense,
      expense: {
        ...newExpense.expense,
        [name]: type === 'checkbox' ? checked : value,
      },
    });
  };

  //이미지 클릭 시, input 파일 작동
  const handleImageClick = () => {
    if (isEditable) {
      document.getElementById('fileInput').click();
    }
  };

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
    const combinedDateTime = `${newExpense.expense.expenseDate}T${newExpense.expense.expenseTime}`;
    const { expenseTime, ...expenseDataWithoutTime } = newExpense.expense;
    const expenseData = {
      ...expenseDataWithoutTime,
      expenseDate: combinedDateTime,
    };
    const formData = new FormData();
    formData.append('expenseInfo', JSON.stringify(expenseData));
    if (newExpense.newImg) {
      formData.append('img', newExpense.newImg);
    }

    console.log(formData.get('expenseInfo'));
    console.log(formData.get('img'));

    updateExpense(expense.id, formData)
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

  const handlePaymentMethodChange = (paymentMethod) => {
    setNewExpense({
      ...newExpense,
      expense: {
        ...newExpense.expense,
        paymentMethod: paymentMethod,
      },
    });
  };

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

  // 편집모드 취소
  const handleCancelEdit = (e) => {
    e.preventDefault();
    setIsEditable(false);
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      display: 'flex',
    }),
    option: (base, { data }) => ({
      ...base,
      display: 'flex',
      alignItems: 'center',
    }),
    singleValue: (base, { data }) => ({
      ...base,
      display: 'flex',
      alignItems: 'center',
    }),
  };

  const formatOptionLabel = ({ label, img }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img src={img} alt="" style={{ width: '20px', marginRight: '10px' }} />
      {label}
    </div>
  );

  return (
    <>
      {isOpen && (
        <ModalOverlay>
          <Modal>
            <form onSubmit={handleUpdateExpense}>
              <ModalHeader>
                <div className={styles.expenseTitle}>
                  {isEditable ? (
                    <Select
                      value={categories.find(
                        (cat) => cat.name === newExpense.expense.category
                      )}
                      onChange={(selectedOption) =>
                        setNewExpense({
                          ...newExpense,
                          expense: {
                            ...newExpense.expense,
                            category: selectedOption.name,
                          },
                        })
                      }
                      options={categories}
                      isDisabled={!isEditable}
                      styles={customStyles}
                      formatOptionLabel={formatOptionLabel}
                    />
                  ) : (
                    <img
                      src={
                        categories.find(
                          (cat) => cat.name === newExpense.expense.category
                        ).img
                      }
                      alt={newExpense.expense.category}
                      className={styles.categoryImage}
                    />
                  )}
                  <Input
                    type="text"
                    name="title"
                    value={newExpense.expense.title}
                    readOnly={!isEditable}
                    onChange={handleInputChange}
                    className={`${styles.titleInput} ${
                      !isEditable ? styles.readOnlyInput : ''
                    }`}
                  ></Input>
                </div>
                <CloseButton onClick={onClose}>&times;</CloseButton>
              </ModalHeader>
              <div className={styles.modalContent}>
                <div>
                  <div className={styles.expenseDate}>
                    <Input
                      type="date"
                      name="expenseDate"
                      value={newExpense.expense.expenseDate}
                      readOnly={!isEditable}
                      onChange={handleInputChange}
                      className={`${!isEditable ? styles.readOnlyInput : ''}`}
                    ></Input>
                    <Input
                      type="time"
                      name="expenseTime"
                      value={newExpense.expense.expenseTime}
                      readOnly={!isEditable}
                      onChange={handleInputChange}
                      className={`${!isEditable ? styles.readOnlyInput : ''}`}
                    ></Input>
                  </div>
                </div>
                <div className={styles.image_container}>
                  {newExpense.isDefaultImage && (
                    <div className={styles.addPhoto_container}>
                      <div className={styles.addPhoto_image_container}>
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
                    className={styles.hidden_input}
                    type="file"
                    accept="image/*"
                    onChange={handleNewImg}
                  />
                  <div
                    className={styles.upload_image_wrapper}
                    onClick={handleImageClick}
                  >
                    <img
                      className={styles.upload_image}
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
                    className={`${!isEditable ? styles.readOnlyInput : ''}`}
                  ></input>
                </div>
                <div className={styles.expenseDetail}>
                  <span>
                    {isEditable ? (
                      <>
                        <Input
                          type="checkbox"
                          name="isShared"
                          value={true}
                          checked={newExpense.expense.isShared}
                          disabled={!isEditable}
                          onChange={handleInputChange}
                        />
                        <label>공동 경비</label>
                        <Input
                          type="checkbox"
                          name="isNotShared"
                          value={false}
                          checked={!newExpense.expense.isShared}
                          disabled={!isEditable}
                          onChange={handleInputChange}
                        />
                        <label>개인 경비</label>
                      </>
                    ) : (
                      <label>
                        {newExpense.expense.isShared
                          ? '공동 경비'
                          : '개인 경비'}
                      </label>
                    )}
                  </span>
                  <span className={styles.paymentMethods}>
                    {paymentMethod
                      .filter(
                        (method) =>
                          method.name === newExpense.expense.paymentMethod ||
                          isEditable
                      )
                      .map((method) => (
                        <img
                          key={method.name}
                          src={getPaymentMethodImage(method.name)}
                          alt={method.label}
                          onClick={
                            isEditable
                              ? () => handlePaymentMethodChange(method.name)
                              : undefined
                          }
                          className={styles.paymentMethodImage}
                        />
                      ))}
                  </span>
                  <div className={styles.expenseAmount}>
                    <Input
                      type="text"
                      name="curUnit"
                      value={newExpense.expense.curUnit}
                      readOnly={!isEditable}
                      onChange={handleInputChange}
                      className={`${!isEditable ? styles.readOnlyInput : ''}`}
                    ></Input>
                    <Input
                      type="text"
                      name="amount"
                      value={newExpense.expense.amount}
                      readOnly={!isEditable}
                      onChange={handleInputChange}
                      className={`${!isEditable ? styles.readOnlyInput : ''}`}
                    ></Input>
                  </div>
                </div>
                <div className={styles.buttonGroup}>
                  <Button
                    className={styles.updateButton}
                    onClick={toggleEditable}
                  >
                    {isEditable ? '편집완료' : '편집하기'}
                  </Button>
                  {isEditable && (
                    <Button
                      className={styles.cancelButton}
                      onClick={handleCancelEdit}
                    >
                      취소
                    </Button>
                  )}
                  <Button
                    name="delete"
                    className={styles.deleteButton}
                    onClick={handleDeleteExpense}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            </form>
          </Modal>
        </ModalOverlay>
      )}
    </>
  );
};

export default UpdateExpense;
