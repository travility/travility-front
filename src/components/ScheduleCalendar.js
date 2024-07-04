import React, { useState, useEffect } from 'react';
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
  parseISO,
} from 'date-fns';
import axios from '../util/axiosInterceptor';
import styles from '../styles/components/ScheduleCalendar.module.css';

const ScheduleCalendar = ({ onDateClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);

  //사용자가 가진 모든 가계부의 (제목, 여행 시작일, 여행 종료일, 가계부 id)
  //가계부 id로 List<ExpenseDTO>(모든 지출)를 가져온다.
  //지출을 날짜별로 분류, 날짜별로 amount 합치기 (총합)
  //캘린더에 날짜별로 뿌리기
  //가계부 id로 각 날짜별 지출 총합
  //"2024-07-06" : 5000000
  //"2024-07-07" : 1000000
  //"2024-07-08" : 9000000
  //"2024-07-09" : 10000000

  //여행 날짜 누르면 디테일
  //날짜별 지출 목록, 총합

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/accountBook/schedule');
        console.log(response.data);
        const fetchedEvents = response.data.map((event) => ({
          title: event.title,
          start: parseISO(event.start),
          end: parseISO(event.end),
          accountbookId: event.accountbookId,
          className: styles.additionalEvent,
        }));
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching account books', error);
      }
    };

    fetchEvents();
  }, []);

  const renderHeader = () => {
    return (
      <div className={styles.header}>
        <button
          className={styles.navButton}
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          {'<'}
        </button>
        <div>{format(currentMonth, 'MMM yyyy')}</div>
        <button
          className={styles.navButton}
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
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
        const eventsForDay = events.filter((event) =>
          isSameDay(event.start, cloneDay)
        );
        const hasEvent = events.some(event => 
          isWithinInterval(cloneDay, { start: event.start, end: event.end })
        );

        days.push(
          <div
            className={`${styles.cell} ${
              !isSameMonth(day, monthStart)
                ? styles.disabled
                : isSameDay(day, new Date())
                ? styles.selected
                : ""
            }`}
            key={day}
            onClick={() => onDateClick(cloneDay)}
          >
            <span className={styles.number}>{formattedDate}</span>
            {eventsForDay.map((event) => (
              <div key={event.title} className={event.className}>
                {event.title}
                {event.accountbookId}
              </div>
            ))}
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
