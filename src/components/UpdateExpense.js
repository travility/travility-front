import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import styles from '../styles/components/UpdateExpense.module.css';
import { deleteExpense, updateExpense } from '../api/expenseApi';
import {
  handleSuccessSubject,
  handleFailureSubject,
  handleNoImage,
} from '../util/swalUtils';
import {
  ModalOverlay,
  Modal,
  ModalHeader,
  CloseButton,
  Button,
  Input,
} from '../styles/StyledComponents';
import { useTheme } from '../styles/Theme';

// 지출 카테고리
const categories = [
  {
    name: 'TRANSPORTATION',
    label: '교통',
    img: '/images/account/category/transportation.png',
  },
  { name: 'FOOD', label: '식비', img: '/images/account/category/food.png' },
  {
    name: 'TOURISM',
    label: '관광',
    img: '/images/account/category/tourism.png',
  },
  {
    name: 'ACCOMMODATION',
    label: '숙박',
    img: '/images/account/category/accommodation.png',
  },
  {
    name: 'SHOPPING',
    label: '쇼핑',
    img: '/images/account/category/shopping.png',
  },
  {
    name: 'OTHERS',
    label: '기타',
    img: '/images/account/category/others.png',
  },
];

// 결제 방식
const paymentMethod = [
  { name: 'CASH', label: '현금' },
  { name: 'CARD', label: '카드' },
];

// 지출 항목 업데이트
const UpdateExpense = ({ isOpen, onClose, expense, accountBook }) => {
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
  const { theme } = useTheme();

  useEffect(() => {
    console.log(isEditable);
    console.log(expense);
    console.log(newExpense.expense);
  }, [isEditable, expense, newExpense.expense]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setNewExpense((prevState) => ({
      ...prevState,
      expense: {
        ...prevState.expense,
        [name]: type === 'radio' ? value === 'true' : value,
      },
    }));
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
      handleNoImage();
      return;
    }

    setNewExpense({
      ...newExpense,
      previewImg: URL.createObjectURL(file),
      newImg: file,
      isDefaultImage: false,
    });
  };

  // 지출 수정
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
        handleFailureSubject('지출', '수정');
      });
  };

  // 지출 삭제
  const handleDeleteExpense = (e) => {
    e.preventDefault();
    deleteExpense(expense.id)
      .then(() => {
        handleSuccessSubject('지출', '삭제');
      })
      .catch((error) => {
        console.log(error);
        handleFailureSubject('지출', '삭제');
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

  // 다크모드, 선택여부에 따른 이미지 변경
  const getPaymentMethodImage = (method) => {
    const isSelected = newExpense.expense.paymentMethod === method;
    const suffix =
      theme === 'dark' ? (isSelected ? '_wt' : '') : isSelected ? '_bk' : '';
    return `/images/account/${method.toLowerCase()}${suffix}.png`;
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

  // React Select 커스텀
  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: 'var(--background-color)',
      border: '1px solid var(--line-color)',
      borderRadius: '0.3rem',
      width: '5rem',
      minHeight: '1rem',
      color: 'var(--text-color)',
      marginTop: '0.2rem',
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '0.33rem 0.5rem',
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: '0.33rem',
    }),
    option: (base) => ({
      ...base,
      display: 'flex',
      alignItems: 'center',
      background: 'var(--background-color)',
      color: 'var(--text-color)',
      fontSize: '0.6em',
      ':hover': {
        background: 'var(--main-color)',
        color: '#ffffff',
      },
    }),
    singleValue: (base) => ({
      ...base,
      display: 'flex',
      alignItems: 'center',
      color: 'var(--text-color)',
      fontSize: '0.7em',
      fontWeight: '700',
    }),
  };

  const formatOptionLabel = ({ label, img }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img src={img} alt="" style={{ width: '1rem', marginRight: '1rem' }} />
      {label}
    </div>
  );

  // 중복 통화 제거
  const uniqueCurrencies = Array.from(
    new Set(accountBook.budgets.map((budget) => budget.curUnit))
  ).map((curUnit) => ({
    label: curUnit,
    value: curUnit,
  }));

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
                      isSearchable={false}
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
              <div className={`${styles.modalContent}`}>
                <div
                  className={`${styles.expenseDate} ${
                    !isEditable ? 'readOnly' : ''
                  }`}
                >
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
                <div className={styles.image_container}>
                  {isEditable && (
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
                        newExpense.previewImg ||
                        `http://localhost:8080/images/${expense.imgName}`
                      }
                      alt="대표이미지"
                    />
                  </div>
                </div>
                <div className={styles.textArea}>
                  <textarea
                    name="memo"
                    value={newExpense.expense.memo}
                    readOnly={!isEditable}
                    onChange={handleInputChange}
                    rows="4"
                    className={`${!isEditable ? styles.readOnlyInput : ''}`}
                    style={{
                      resize: 'none',
                      overflowY: 'auto',
                      border: 'none',
                    }}
                  />
                </div>
                <div className={styles.expenseDetail}>
                  <div className={styles.expenseType}>
                    {isEditable ? (
                      <>
                        <div className={styles.isShared}>
                          <Input
                            type="radio"
                            name="isShared"
                            value={true}
                            checked={newExpense.expense.isShared === true}
                            onChange={handleInputChange}
                          />
                          공동 경비
                        </div>
                        <div className={styles.isShared}>
                          <Input
                            type="radio"
                            name="isShared"
                            value={false}
                            checked={newExpense.expense.isShared === false}
                            onChange={handleInputChange}
                          />
                          개인 경비
                        </div>
                      </>
                    ) : (
                      <div className={styles.selectedExpenseType}>
                        {newExpense.expense.isShared
                          ? '공동 경비'
                          : '개인 경비'}
                      </div>
                    )}
                  </div>
                  <div className={styles.paymentMethods}>
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
                  </div>
                  <div className={styles.expenseAmount}>
                    {isEditable ? (
                      <Select
                        value={{
                          label: newExpense.expense.curUnit,
                          value: newExpense.expense.curUnit,
                        }}
                        onChange={(selectedOption) =>
                          setNewExpense((prev) => ({
                            ...prev,
                            expense: {
                              ...prev.expense,
                              curUnit: selectedOption.value,
                            },
                          }))
                        }
                        options={uniqueCurrencies}
                        styles={customStyles}
                        isSearchable={false}
                        noOptionsMessage={() => '선택 가능한 화폐가 없습니다'}
                      />
                    ) : (
                      <Input
                        type="text"
                        name="curUnit"
                        value={newExpense.expense.curUnit}
                        readOnly={!isEditable}
                        onChange={handleInputChange}
                        className={`${!isEditable ? styles.readOnlyInput : ''}`}
                      />
                    )}
                    <Input
                      type="text"
                      name="amount"
                      value={newExpense.expense.amount}
                      readOnly={!isEditable}
                      onChange={handleInputChange}
                      className={`${!isEditable ? styles.readOnlyInput : ''}`}
                    />
                  </div>
                </div>
                <div className={styles.buttonGroup}>
                  <Button
                    className={styles.updateButton}
                    onClick={toggleEditable}
                  >
                    {isEditable ? '편집완료' : '편집하기'}
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
                      onClick={handleDeleteExpense}
                    >
                      삭제
                    </Button>
                  </div>
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
