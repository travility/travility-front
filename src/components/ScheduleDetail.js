import React from 'react';
import { Card, Button, Tabs, Tab, Image } from 'react-bootstrap';
import styles from '../styles/components/ScheduleDetail.module.css';

const ScheduleDetail = ({ date, onClose, position }) => {
  return (
    <div
      className={styles.popupContainer}
      style={{ top: position.top, left: position.left }}
      onClick={onClose}
    >
      <Card className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
        <Card.Header className={styles.header}>
          <Button variant="light" className={styles.closeButton} onClick={onClose}>X</Button>
        </Card.Header>
        <Card.Body>
          <div className={styles.modalHeader}>
            <h5>서울</h5>
            <p>{date}</p>
          </div>
          <div className={styles.modalImage}>
            <Image src="path_to_your_image.png" alt="서울" fluid rounded />
          </div>
          <Tabs defaultActiveKey="all" className={styles.modalTabs}>
            <Tab eventKey="all" title="모두">
              <div className={styles.modalExpenses}>
                <p>식비 28000원</p>
                <p>샤브샤브</p>
              </div>
            </Tab>
            <Tab eventKey="personal" title="개인">
              {/* 개인 탭 내용 */}
            </Tab>
            <Tab eventKey="shared" title="공용">
              {/* 공용 탭 내용 */}
            </Tab>
          </Tabs>
          <div className={styles.modalFooter}>
            <p>총 사용 비용</p>
            <div className={styles.modalButtons}>
              <Button variant="secondary" className={styles.editButton}>편집하기</Button>
              <Button variant="secondary" className={styles.deleteButton}>삭제하기</Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ScheduleDetail;
