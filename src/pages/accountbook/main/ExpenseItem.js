import React from "react";
import styles from "../../../styles/accountbook/AccountBookMain.module.css";

const categoryImages = {
  TRANSPORTATION: "transportation.png",
  ACCOMMODATION: "accommodation.png",
  FOOD: "food.png",
  TOURISM: "tourism.png",
  SHOPPING: "shopping.png",
  OTHERS: "others.png",
};

const ExpenseItem = ({
  type,
  category,
  currency,
  amount,
  description,
  imgName,
}) => {
  const categoryImage = categoryImages[category] || "others.png";

  return (
    <div className={styles.expenseItem}>
      <span className={styles.type}>{type}</span>
      <img
        className={styles.categoryImg}
        src={`/images/account/category/${categoryImage}`}
        alt={category}
      />
      <span className={styles.currency}>{currency}</span>
      <span className={styles.amount}>{amount}</span>
      <span className={styles.description}>{description}</span>
      <img
        className={styles.expenseImg}
        src={`/images/account/${imgName}`}
        alt={description}
      />
    </div>
  );
};

export default ExpenseItem;
