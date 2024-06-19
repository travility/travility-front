import React, { useState } from "react";
import styles from "../styles/components/AddExpense.module.css"; // AddExpense CSS를 가져와 사용합니다.

const AddExpense = ({ isOpen, onClose, onSubmit }) => {
  const [expense, setExpense] = useState({
    title: "",
    category: "OTHERS",
    isShared: false,
    paymentMethod: "CASH",
    curUnit: "",
    amount: "",
    expenseDate: "",
    expenseTime: "",
    imgName: "",
    memo: "",
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setExpense((prev) => ({ ...prev, imgName: file.name }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCategoryChange = (category) => {
    setExpense((prev) => ({ ...prev, category }));
  };

  const handlePaymentMethodChange = (paymentMethod) => {
    setExpense((prev) => ({ ...prev, paymentMethod }));
  };

  const getCategoryImage = (category) => {
    const isSelected = expense.category === category;
    return `/images/account/category/${category.toLowerCase()}${
      isSelected ? "_bk" : ""
    }.png`;
  };

  const getPaymentMethodImage = (method) => {
    const isSelected = expense.paymentMethod === method;
    return `/images/account/${method.toLowerCase()}${
      isSelected ? "_bk" : ""
    }.png`;
  };

  const handleSubmit = () => {
    const { expenseDate, expenseTime, ...otherFields } = expense;
    const combinedDateTime = new Date(`${expenseDate}T${expenseTime}`);
    const expenseData = { ...otherFields, expenseDate: combinedDateTime };
    onSubmit(expenseData);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={onClose}>
              &times;
            </button>
            <h2>지출 내역 추가</h2>
            <input
              type="text"
              name="title"
              value={expense.title}
              onChange={handleChange}
              placeholder="항목명을 입력해 주세요."
              className={styles.titleInput}
            />
            <div className={styles.categoryContainer}>
              <img
                src={getCategoryImage("TRANSPORTATION")}
                alt="교통"
                onClick={() => handleCategoryChange("TRANSPORTATION")}
              />
              <img
                src={getCategoryImage("FOOD")}
                alt="식비"
                onClick={() => handleCategoryChange("FOOD")}
              />
              <img
                src={getCategoryImage("TOURISM")}
                alt="관광"
                onClick={() => handleCategoryChange("TOURISM")}
              />
              <img
                src={getCategoryImage("ACCOMMODATION")}
                alt="숙박"
                onClick={() => handleCategoryChange("ACCOMMODATION")}
              />
              <img
                src={getCategoryImage("SHOPPING")}
                alt="쇼핑"
                onClick={() => handleCategoryChange("SHOPPING")}
              />
              <img
                src={getCategoryImage("OTHERS")}
                alt="기타"
                onClick={() => handleCategoryChange("OTHERS")}
              />
            </div>
            <div className={styles.dateTimeGroup}>
              <input
                type="date"
                name="expenseDate"
                value={expense.expenseDate}
                onChange={handleChange}
                className={styles.dateInput}
              />
              <input
                type="time"
                name="expenseTime"
                value={expense.expenseTime}
                onChange={handleChange}
                className={styles.timeInput}
              />
            </div>
            <div className={styles.radioGroup}>
              <div className={styles.budgetType}>
                <label>
                  <input
                    type="radio"
                    name="isShared"
                    value={true}
                    checked={expense.isShared === true}
                    onChange={() =>
                      setExpense((prev) => ({ ...prev, isShared: true }))
                    }
                  />
                  공동경비
                </label>
                <label>
                  <input
                    type="radio"
                    name="isShared"
                    value={false}
                    checked={expense.isShared === false}
                    onChange={() =>
                      setExpense((prev) => ({ ...prev, isShared: false }))
                    }
                  />
                  개인경비
                </label>
              </div>
              <div className={styles.paymentMethods}>
                <img
                  src={getPaymentMethodImage("CASH")}
                  alt="현금"
                  onClick={() => handlePaymentMethodChange("CASH")}
                />
                <img
                  src={getPaymentMethodImage("CARD")}
                  alt="카드"
                  onClick={() => handlePaymentMethodChange("CARD")}
                />
              </div>
            </div>
            <div className={styles.addFormContainer}>
              <div className={styles.formGroupRow}>
                <label htmlFor="curUnit">화폐</label>
                <input
                  type="text"
                  name="curUnit"
                  id="curUnit"
                  value={expense.curUnit}
                  onChange={handleChange}
                  placeholder="화폐 선택"
                />
              </div>
              <div className={styles.formGroupRow}>
                <label htmlFor="amount">금액</label>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  value={expense.amount}
                  onChange={handleChange}
                  placeholder="금액 입력"
                />
              </div>
            </div>
            <div className={styles.imageUpload}>
              <label htmlFor="imgUpload" className={styles.imgUploadLabel}>
                <img src="/images/account/add_box.png" alt="Add" />
                <p>사진을 추가하세요</p>
              </label>
              <input
                type="file"
                id="imgUpload"
                name="imgName"
                onChange={handleImageChange}
                className={styles.hiddenInput}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className={styles.imagePreview}
                />
              )}
            </div>
            <textarea
              name="memo"
              value={expense.memo}
              onChange={handleChange}
              placeholder="메모를 입력하세요"
              rows="4"
              className={styles.textArea}
              readOnly
            />
            <div className={styles.submitButton}>
              <button onClick={handleSubmit}>등록</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddExpense;
