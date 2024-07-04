import React, { useState } from "react";
import styles from "../styles/components/AddExpense.module.css";
import Swal from "sweetalert2";
import {
  ModalOverlay,
  Modal,
  ModalHeader,
  CloseButton,
  Button,
} from "../styles/StyledComponents";

const categories = [
  { name: "TRANSPORTATION", label: "교통" },
  { name: "FOOD", label: "식비" },
  { name: "TOURISM", label: "관광" },
  { name: "ACCOMMODATION", label: "숙박" },
  { name: "SHOPPING", label: "쇼핑" },
  { name: "OTHERS", label: "기타" },
];

const paymentMethod = [
  { name: "CASH", label: "현금" },
  { name: "CARD", label: "카드" },
];

const AddExpense = ({ isOpen, onClose, onSubmit, accountBookId }) => {
  const [newExpense, setNewExpense] = useState({
    expense: {
      title: "",
      category: "OTHERS",
      isShared: false,
      paymentMethod: "CASH",
      curUnit: "",
      amount: "",
      expenseDate: "",
      expenseTime: "",
      memo: "",
    },
    newImg: null,
    previewImg: null,
    isDefaultImage: true,
  });

  //const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({
      ...prev,
      expense: { ...prev.expense, [name]: value },
    }));
  };

  const handleImageChange = (e) => {
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

  const getCategoryImage = (category) => {
    const isSelected = newExpense.expense.category === category;
    return `/images/account/category/${category.toLowerCase()}${
      isSelected ? "_bk" : ""
    }.png`;
  };

  const getPaymentMethodImage = (method) => {
    const isSelected = newExpense.expense.paymentMethod === method;
    return `/images/account/${method.toLowerCase()}${
      isSelected ? "_bk" : ""
    }.png`;
  };

  const handleSubmit = () => {
    const combinedDateTime = `${newExpense.expense.expenseDate}T${newExpense.expense.expenseTime}`; //날짜 + 시간
    const { expenseTime, amount, ...expenseDataWithoutTime } =
      newExpense.expense; //expenseTime만 추출하고 나머지는 expenseDataWithoutTime에 담기
    const expenseData = {
      ...expenseDataWithoutTime,
      amount: parseFloat(amount),
      expenseDate: combinedDateTime,
      accountBookId,
    };
    const formData = new FormData();
    formData.append("expenseInfo", JSON.stringify(expenseData));
    if (newExpense.newImg) {
      formData.append("img", newExpense.newImg);
    }
    console.log(formData.get("expenseInfo"));
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
            <div className={styles.modalContent}>
              <input
                type="text"
                name="title"
                value={newExpense.expense.title}
                onChange={handleChange}
                placeholder="항목명을 입력해 주세요."
                className={styles.titleInput}
              />
              <div className={styles.categoryContainer}>
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
              <div className={styles.dateTimeGroup}>
                <input
                  type="date"
                  name="expenseDate"
                  value={newExpense.expense.expenseDate}
                  onChange={handleChange}
                  className={styles.dateInput}
                />
                <input
                  type="time"
                  name="expenseTime"
                  value={newExpense.expense.expenseTime}
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

                  {/* <img
                    src={getPaymentMethodImage("CARD")}
                    alt="카드"
                    onClick={() => handlePaymentMethodChange("CARD")}
                  /> */}
                </div>
              </div>
              <div className={styles.addFormContainer}>
                <div className={styles.formGroupRow}>
                  <label htmlFor="curUnit">화폐</label>
                  <input
                    type="text"
                    name="curUnit"
                    id="curUnit"
                    value={newExpense.expense.curUnit}
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
                    value={newExpense.expense.amount}
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
                {newExpense.previewImg && (
                  <img
                    src={newExpense.previewImg}
                    alt="Preview"
                    className={styles.imagePreview}
                  />
                )}
              </div>
              <textarea
                name="memo"
                value={newExpense.expense.memo}
                onChange={handleChange}
                placeholder="메모를 입력하세요"
                rows="4"
                className={styles.textArea}
              />
              <div className={styles.submitButton}>
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
