import React, { useState } from "react";
import styles from "../styles/components/AddExpense.module.css";

const AddExpense = ({ isOpen, onClose, onSubmit, accountBookId }) => {
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
    const expenseData = {
      ...otherFields,
      expenseDate: combinedDateTime,
      accountBookId,
    };
    onSubmit(expenseData);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div className={styles.modalHeader_title}>지출 등록</div>
              <button className={styles.closeButton} onClick={onClose}>
                &times;
              </button>
            </div>
            <div className={styles.modalContent}>
              <input
                type="text"
                name="title"
                value={expense.title}
                onChange={handleChange}
                placeholder="항목명을 입력해 주세요."
                className={styles.titleInput}
              />
              <div className={styles.categoryContainer}>
                {[
                  { name: "TRANSPORTATION", label: "교통" },
                  { name: "FOOD", label: "식비" },
                  { name: "TOURISM", label: "관광" },
                  { name: "ACCOMMODATION", label: "숙박" },
                  { name: "SHOPPING", label: "쇼핑" },
                  { name: "OTHERS", label: "기타" },
                ].map((category) => (
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
              />
              <div className={styles.submitButton}>
                <button onClick={handleSubmit}>등록</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddExpense;
