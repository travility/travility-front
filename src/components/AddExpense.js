import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import {
  ModalOverlay,
  Modal,
  ModalHeader,
  CloseButton,
  Button,
  Input,
  ErrorMessage,
} from '../styles/StyledComponents';
import { useTheme } from '../styles/Theme';
import { handleNoImage } from '../util/swalUtils';
import styles from '../styles/components/AddExpense.module.css';
import { selectStyles } from '../util/CustomStyles';

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

// 중복 통화 제거
const AddExpense = ({ isOpen, onClose, onSubmit, accountBook }) => {
  const uniqueCurrencies = Array.from(
    new Set(accountBook.budgets.map((budget) => budget.curUnit))
  ).map((curUnit) => ({
    label: curUnit,
    value: curUnit,
  }));

  const [newExpense, setNewExpense] = useState({
    expense: {
      title: '',
      category: 'OTHERS',
      isShared: false,
      paymentMethod: 'CASH',
      curUnit: uniqueCurrencies[0]?.value || '',
      amount: '',
      expenseDate: '',
      expenseTime: '',
      memo: '',
    },
    newImg: null,
    previewImg: null,
    isDefaultImage: true,
  });

  const [errors, setErrors] = useState({
    title: '',
    expenseDate: '',
    expenseTime: '',
    amount: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newErrors = {};

    if (name === 'expenseDate') {
      if (new Date(value) < new Date(accountBook.startDate)) {
        //선택 날짜가 시작 날짜 이전일 때,
        newErrors.expenseDate = '준비 비용입니다.';
      } else if (new Date(value) > new Date(accountBook.endDate)) {
        //선택 날짜가 종료 날짜 이후일 때,
        newErrors.expenseDate = '사후 비용입니다.';
      } else {
        newErrors.expenseDate = '';
      }
    }
    setErrors((prevError) => ({
      ...prevError,
      ...newErrors,
    }));

    setNewExpense((prev) => ({
      ...prev,
      expense: { ...prev.expense, [name]: value },
    }));
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

    setNewExpense((prev) => ({
      ...prev,
      previewImg: URL.createObjectURL(file),
      newImg: file,
      isDefaultImage: false,
    }));
  };

  const handleCategoryChange = (category) => {
    setNewExpense((prev) => ({
      ...prev,
      expense: { ...prev.expense, category },
    }));
  };

  const handlePaymentMethodChange = (paymentMethod) => {
    setNewExpense((prev) => ({
      ...prev,
      expense: { ...prev.expense, paymentMethod },
    }));
  };

  const { theme } = useTheme();

  const getCategoryImage = (category) => {
    const isSelected = newExpense.expense.category === category;
    const suffix =
      theme === 'dark' ? (isSelected ? '_wt' : '') : isSelected ? '_bk' : '';
    return `/images/account/category/${category.toLowerCase()}${suffix}.png`;
  };

  const getPaymentMethodImage = (method) => {
    const isSelected = newExpense.expense.paymentMethod === method;
    const suffix =
      theme === 'dark' ? (isSelected ? '_wt' : '') : isSelected ? '_bk' : '';
    return `/images/account/${method.toLowerCase()}${suffix}.png`;
  };

  const validateForm = () => {
    const { title, expenseDate, expenseTime, amount } = newExpense.expense;
    const newErrors = {};

    if (!title) newErrors.title = '항목명을 입력해 주세요.';
    if (!expenseDate) newErrors.expenseDate = '날짜를 선택해 주세요.';
    if (!expenseTime) newErrors.expenseTime = '시간을 선택해 주세요.';
    if (!amount) newErrors.amount = '금액을 입력해 주세요.';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const combinedDateTime = `${newExpense.expense.expenseDate}T${newExpense.expense.expenseTime}`;

    const { expenseTime, amount, ...expenseDataWithoutTime } =
      newExpense.expense;

    const expenseData = {
      ...expenseDataWithoutTime,
      amount: parseFloat(amount),
      expenseDate: combinedDateTime,
      accountBookId: accountBook.id,
    };

    const formData = new FormData();
    formData.append('expenseInfo', JSON.stringify(expenseData));
    if (newExpense.newImg) {
      formData.append('img', newExpense.newImg);
    }

    onSubmit(formData);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <ModalOverlay>
          <Modal>
            <ModalHeader>
              <h4>지출 등록</h4>
              <CloseButton onClick={onClose}>&times;</CloseButton>
            </ModalHeader>
            <div className={styles.modal_content}>
              <Input
                type="text"
                name="title"
                value={newExpense.expense.title}
                onChange={handleChange}
                placeholder="항목명을 입력해 주세요."
                className={styles.title_input}
              />
              <div className="error_container">
                {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
              </div>
              <div className={styles.category_container}>
                {categories.map((category) => (
                  <div
                    key={category.name}
                    className={styles.categoryItem}
                    onClick={() => handleCategoryChange(category.name)}
                  >
                    <img
                      src={getCategoryImage(category.name)}
                      alt={category.label}
                    />
                    <span>{category.label}</span>
                  </div>
                ))}
              </div>
              <div className={styles.date_group}>
                <div className={styles.date}>
                  <Input
                    type="date"
                    name="expenseDate"
                    value={newExpense.expense.expenseDate}
                    onChange={handleChange}
                    className={styles.dateInput}
                  />
                  <div className="error_container">
                    {errors.expenseDate && (
                      <ErrorMessage>{errors.expenseDate}</ErrorMessage>
                    )}
                  </div>
                </div>
                <div className={styles.time}>
                  <Input
                    type="time"
                    name="expenseTime"
                    value={newExpense.expense.expenseTime}
                    onChange={handleChange}
                    className={styles.timeInput}
                  />
                  <div className="error_container">
                    {errors.expenseTime && (
                      <ErrorMessage>{errors.expenseTime}</ErrorMessage>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.radio_group}>
                <div className={styles.budgetType}>
                  <label>
                    <input
                      type="radio"
                      name="isShared"
                      value={true}
                      checked={newExpense.expense.isShared === true}
                      onChange={() =>
                        setNewExpense((prev) => ({
                          ...prev,
                          expense: { ...prev.expense, isShared: true },
                        }))
                      }
                    />
                    공동경비
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="isShared"
                      value={false}
                      checked={newExpense.expense.isShared === false}
                      onChange={() =>
                        setNewExpense((prev) => ({
                          ...prev,
                          expense: { ...prev.expense, isShared: false },
                        }))
                      }
                    />
                    개인경비
                  </label>
                </div>
                <div className={styles.paymentMethods}>
                  {paymentMethod.map((method) => (
                    <img
                      key={method.name}
                      src={getPaymentMethodImage(method.name)}
                      alt={method.label}
                      onClick={() => handlePaymentMethodChange(method.name)}
                    />
                  ))}
                </div>
              </div>
              <div className={styles.addExpense_form}>
                <div className={styles.addExpense_formGroup}>
                  <div className={styles.curUnit_input}>
                    <label htmlFor="curUnit">화폐</label>
                    <Select
                      id="curUnit"
                      name="curUnit"
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
                      styles={selectStyles}
                      isSearchable={false}
                      noOptionsMessage={() => '선택 가능한 화폐가 없습니다'}
                    />
                  </div>
                </div>
                <div className={styles.addExpense_formGroup}>
                  <div className={styles.amount_input}>
                    <label htmlFor="amount">금액</label>
                    <Input
                      type="number"
                      name="amount"
                      id="amount"
                      value={newExpense.expense.amount}
                      onChange={handleChange}
                      placeholder="금액 입력"
                    />
                  </div>
                  <div className="error_container">
                    {errors.amount && (
                      <ErrorMessage>{errors.amount}</ErrorMessage>
                    )}
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
                  {newExpense.previewImg && (
                    <img
                      src={newExpense.previewImg}
                      alt="Preview"
                      className={styles.upload_image}
                    />
                  )}
                </div>
              </div>
              <textarea
                name="memo"
                value={newExpense.expense.memo}
                onChange={handleChange}
                placeholder="메모를 입력하세요"
                rows="4"
                className={styles.textArea}
              />
              <div className={styles.submit_button}>
                <Button onClick={handleSubmit}>등록</Button>
              </div>
            </div>
          </Modal>
        </ModalOverlay>
      )}
    </>
  );
};

export default AddExpense;
