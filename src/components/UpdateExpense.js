import React, { useEffect, useState } from "react";
import styles from "../styles/components/UpdateExpense.module.css";
import Swal from "sweetalert2";
import { deleteExpense, updateExpense } from "../api/expenseApi";
import {
  handleSuccessSubject,
  handlefailureSubject,
} from "../util/logoutUtils";
import {
  ModalOverlay,
  Modal,
  ModalHeader,
  CloseButton,
  Button,
  Input,
} from "../styles/StyledComponents";

const categories = [
  { name: "TRANSPORTATION", label: "교통" },
  { name: "FOOD", label: "식비" },
  { name: "TOURISM", label: "관광" },
  { name: "ACCOMMODATION", label: "숙박" },
  { name: "SHOPPING", label: "쇼핑" },
  { name: "OTHERS", label: "기타" },
];

const UpdateExpense = ({ isOpen, onClose, countryName, expense }) => {
  const [newExpense, setNewExpense] = useState({
    expense: {
      expenseDate: expense.expenseDate.split("T")[0],
      expenseTime: expense.expenseDate.split("T")[1],
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
  const [showCategories, setShowCategories] = useState(false);

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
      document.getElementById("fileInput").click();
    }
  };

  const handleNewImg = (e) => {
    if (e.target.files.length === 0) {
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

    setNewExpense({
      ...newExpense,
      previewImg: URL.createObjectURL(file),
      newImg: file,
      isDefaultImage: false,
    });
  };

  const handleUpdateExpense = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("expenseInfo", JSON.stringify(newExpense.expense));
    if (newExpense.newImg) {
      formData.append("img", newExpense.newImg);
    }

    updateExpense(formData)
      .then(() => {
        handleSuccessSubject("지출", "수정");
      })
      .catch((error) => {
        console.log(error);
        handlefailureSubject("지출", "수정");
      });
  };

  const handleDeleteExpense = (e) => {
    e.preventDefault();
    deleteExpense()
      .then(() => {
        handleSuccessSubject("지출", "삭제");
      })
      .catch((error) => {
        console.log(error);
        handlefailureSubject("지출", "삭제");
      });
  };

  const handleCategoryClick = () => {
    setShowCategories(!showCategories);
  };

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

  const getCategoryImage = (category) => {
    const isSelected = newExpense.expense.category === category;
    return `/images/account/category/${category.toLowerCase()}${
      isSelected ? "_bk" : ""
    }.png`;
  };

  return (
    <>
      {isOpen && (
        <ModalOverlay>
          <Modal>
            <form onSubmit={handleUpdateExpense}>
              <ModalHeader>
                <div className={styles.expenseTitle}>
                  <span onClick={handleCategoryClick}>
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
                    <select
                      value={newExpense.expense.isShared}
                      disabled={!isEditable}
                      onChange={handleSelectChange}
                    >
                      <option value="true">공동 경비</option>
                      <option value="false">개인 경비</option>
                    </select>
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
                {isEditable ? (
                  <Button
                    type="submit"
                    name="update"
                    className={styles.updateButton}
                  >
                    편집완료
                  </Button>
                ) : (
                  <Button
                    className={styles.updateButton}
                    onClick={() => setIsEditable(true)}
                  >
                    편집하기
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
            </form>
          </Modal>
        </ModalOverlay>
      )}
    </>
  );
};

export default UpdateExpense;
