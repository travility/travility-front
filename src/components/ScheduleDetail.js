import React, { useState } from 'react';
import styles from "../styles/components/ScheduleDetail.module.css";

const ScheduleDetail = ({ date, onClose }) => {

  const [activeTab, setActiveTab] = useState('all');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'all':
        return (
          <div className={styles.modal_expenses_select}>
            <p>식비 28000원</p>
            <p>샤브샤브</p>
          </div>
        );
      case 'personal':
        return (
          <div className={styles.modal_expenses_select}>
            <p>개인 사용 내역</p>
          </div>
        );
      case 'shared':
        return (
          <div className={styles.modal_expenses_select}>
            <p>공용 사용 내역</p>
          </div>
        );
      default:
        return null;
    }
  };



  return (
    <div className={styles.schedule_detail_container}>
      <div 
        className={styles.schedule_detail_content} 
        onClick={(e) => e.stopPropagation()}
      >
          <div 
          className={styles.schedule_detail_header_container}>
            <h5>서울</h5>
            <p>{date}</p>
          </div>
          <div className={styles.schedule_detail_modalBody}>
          <div className={styles.schedule_detail_modalImage}>
            <img src="/images/destinations/HongKong.jpg" alt="홍콩" />
          </div>
          <div className=
          {styles.modal_expenses_select_button_container}>
            <button onClick={() => setActiveTab('all')}>모두</button>
            <button onClick={() => setActiveTab('personal')}>개인</button>
            <button onClick={() => setActiveTab('shared')}>공용</button>
          </div>
          {renderTabContent()}
          <div className={styles.schedule_detail_modalFooter}>
            <p className={styles.totalCost}>총 사용 비용</p>
            <div className={styles.schedule_detail_Buttons_container}>
              <button className={styles.editButton}>편집하기</button>
              <button className={styles.deleteButton}>삭제하기</button>
              <button 
              className={styles.closeButton} 
              onClick={onClose}>닫기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ScheduleDetail;
