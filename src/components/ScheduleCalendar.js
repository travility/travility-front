import React, { useState } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
} from 'date-fns';
import styles from '../styles/components/ScheduleCalendar.module.css';

const ScheduleCalendar = ({ onDateClick, events, totalAmount, hasEvent }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className={styles.header}>
        <button className={styles.navButton} onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          {'<'}
        </button>
        <div>{format(currentMonth, 'MMM yyyy')}</div>
        <button className={styles.navButton} onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          {'>'}
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const date = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className={styles.day} key={i}>
          {date[i]}
        </div>
      );
    }
    return <div className={styles.days}>{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const dateFormat = 'd';
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const eventsForDay = events.filter((event) => isSameDay(event.start, cloneDay));
        const cellDate = format(day, 'yyyy-MM-dd');
        const dayTotalAmount = totalAmount[cellDate] || 0;
        days.push(
          <div
            className={`${styles.cell} ${
              !isSameMonth(day, monthStart)
                ? styles.disabled
                : isSameDay(day, new Date())
                ? styles.selected
                : hasEvent[cellDate]
                ? styles.cellWithEvent
                : ''
            }`}
            key={day}
            onClick={() => onDateClick(cloneDay, eventsForDay[0]?.accountbookId, eventsForDay[0]?.countryName, eventsForDay[0]?.imgName)}
          >
            <span className={styles.number}>{formattedDate}</span>
            {eventsForDay.map((event) => (
              <div key={event.title} className={event.className}>
                {event.title}
              </div>
            ))}
            {totalAmount > 0 && (
              <div className={styles.totalAmount}>
                ₩{totalAmount.toLocaleString()}
              </div>
            {dayTotalAmount > 0 && (
              <div className={styles.totalAmount}>₩{dayTotalAmount.toLocaleString()}</div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className={styles.row} key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className={styles.body}>{rows}</div>;
  };

  return (
    <div className={styles.calendar}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default ScheduleCalendar;
