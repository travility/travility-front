import React, { useState } from "react";
import styles from "../styles/components/ScheduleDetail.module.css";
import { format } from 'date-fns';
import ExpenseList from '../pages/accountbook/detail/ExpenseList';

const ScheduleDetail = ({ date, onClose, totalAmount, expenses, countryName, imgName }) => {
  return (
    <div className={styles.schedule_detail_container}>
      <div className={styles.schedule_detail_content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.schedule_detail_header_container}>
          <h5>{countryName}</h5>
          <p>{date}</p>
        </div>
        <div 
          className={styles.schedule_detail_modalImage} 
          style={{
            backgroundImage: `url(http://localhost:8080/images/${imgName})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className={styles.modal_expenses_select}>
          <ExpenseList expenses={expenses} />
        </div>
        <div className={styles.schedule_detail_modalFooter}>
          <div className={styles.total_cost_container}>
            <p className={styles.total_cost_text}>총 사용 비용</p>
            <p className={styles.total_cost_amount}>₩{totalAmount.toLocaleString()}</p>
          </div>
          <div className={styles.schedule_detail_Buttons_container}>
            <button className={styles.closeButton} onClick={onClose}>닫기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetail;
