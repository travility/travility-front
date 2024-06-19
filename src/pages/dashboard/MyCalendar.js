import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import DefaultSidebar from '../../components/DefaultSidebar';
import styles from '../../styles/dashboard/MyCalendar.module.css';

const MyCalendar = () => {
  const today = new Date();
  const [date, setDate] = useState(today);
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const journeyDay = ["2024-06-03", "2024-06-13"]; //여행날짜

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const handleTodayClick = () => {
    const today = new Date();
    setActiveStartDate(today);
    setDate(today);
  };


  return (
    <div className={styles.mycalendar_page}>
      <DefaultSidebar />
      <div className={styles.mycalendar_container}>
      <Calendar
        className={styles.react_calendar}
        value={date}
        onChange={handleDateChange}
        formatDay={(locale, date) => moment(date).format("D")}
        formatYear={(locale, date) => moment(date).format("YYYY")}
        formatMonthYear={(locale, date) => moment(date).format("YYYY. MM")}
        calendarType="gregory"
        showNeighboringMonth={false}
        next2Label={null}
        prev2Label={null}
        minDetail="year"
        activeStartDate={activeStartDate}
        onActiveStartDateChange={({ activeStartDate }) =>
          setActiveStartDate(activeStartDate)
        }

        tileContent={({ date, view }) => {
          const elements = [];
          if (
            view === "month" &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
          ) {
            elements.push(
              <div key={"today"} 
              className={styles.mycalendar_today}
              >
                오늘
              </div>
            );
          }
          if (journeyDay.find((x) => x === moment(date).format("YYYY-MM-DD"))) {
            elements.push(
              <div
                key={moment(date).format("YYYY-MM-DD")}
                className={styles.mycalendar_today_dot}
              />
            );
          }
          return <>{elements}</>;
        }}
      />
      <div className={styles.myclaendar_click_today} onClick={handleTodayClick}>
        오늘
      </div>
    </div>
    </div>
  );

};

export default MyCalendar;