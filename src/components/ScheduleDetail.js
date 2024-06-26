import React from 'react';
import styles from '../styles/components/ScheduleDetail.module.css';

const ScheduleDetail = ({ date, onClose, position }) => {
  return (
    <div
      className={styles.popupContainer}
      style={{ top: position.top, left: position.left }}
      onClick={onClose}
    >
      <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <button className={styles.closeButton} onClick={onClose}>X</button>
        </div>
        <div className={styles.modalHeader}>
          <h5>서울</h5>
          <p>{date}</p>
        </div>
        <div className={styles.modalImage}>
          <img src="path_to_your_image.png" alt="서울" />
        </div>
        <div className={styles.modalTabs}>
          <button className={styles.activeTab}>모두</button>
          <button>개인</button>
          <button>공용</button>
        </div>
        <div className={styles.modalExpenses}>
          <p>식비 28000원</p>
          <p>샤브샤브</p>
        </div>
        <div className={styles.modalFooter}>
          <p>총 사용 비용</p>
          <div className={styles.modalButtons}>
            <button className={styles.editButton}>편집하기</button>
            <button className={styles.deleteButton}>삭제하기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetail;
