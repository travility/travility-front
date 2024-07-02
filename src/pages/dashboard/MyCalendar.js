import React, { useState } from "react";
import ScheduleCalendar from "../../components/ScheduleCalendar";
import ScheduleDetail from '../../components/ScheduleDetail';
import styles from "../../styles/dashboard/MyCalendar.module.css";

const MyCalendar = () => {
  const [popupInfo, setPopupInfo] = useState({ show: false, date: null });

  const handleDateClick = (date) => {
    setPopupInfo({ 
      show: true, 
      date: date.toISOString().split("T")[0]
    });
  };

  const handleClosePopup = () => {
    setPopupInfo({ 
      show: false, 
      date: null
    });
  };

  return (
    <div className={styles.my_calendar_container}>
      <div className={styles.calendar_schedule_container}>
        <div className={styles.calendar_container}>
          <ScheduleCalendar onDateClick={handleDateClick} />
        </div>
        {popupInfo.show && (
          <div className={styles.schedule_detail_container}>
            <ScheduleDetail 
              date={popupInfo.date} 
              onClose={handleClosePopup} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCalendar;
