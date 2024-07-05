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
import styles from '../styles/components/ScheduleCalendar.module.css';
import { fetchEvents, fetchDailyExpenses } from '../api/scheduleApi';

const ScheduleCalendar = ({ onDateClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [hasEvent, setHasEvent] = useState({}); //event day에 맞게 영역표시
  const [dailyExpenses, setDailyExpenses] = useState({});

  //사용자가 가진 모든 가계부의 (제목, 여행 시작일, 여행 종료일, 가계부 id)
  //가계부 id로 List<ExpenseDTO>(모든 지출)를 가져온다.
  //지출을 날짜별로 분류, 날짜별로 amount 합치기 (총합)
  
  //여행 날짜 누르면 디테일
  //날짜별 지출 목록, 총합

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const eventsData = await fetchEvents();
        console.log('Fetched events:', eventsData);
        const fetchedEvents = eventsData.map((event) => ({
          accountbookId: event.accountbookId,
          title: event.title,
          start: parseISO(event.start),
          end: parseISO(event.end),
          className: styles.additionalEvent,
        }));
        setEvents(fetchedEvents);

        const eventMap = {};
        fetchedEvents.forEach((event) => {
          let day = new Date(event.start);
          while (day <= new Date(event.end)) {
            const formattedDate = format(day, 'yyyy-MM-dd');
            eventMap[formattedDate] = true;
            day = addDays(day, 1);
          }
        });
        setHasEvent(eventMap);

        // 모든 accountbookId에 대해 expense 데이터를 가져오기
        const allExpenses = {};
        for (const event of fetchedEvents) {
          const accountbookId = event.accountbookId;
          const expensesData = await fetchDailyExpenses(accountbookId);
          console.log(`Fetched daily expenses for accountbookId ${accountbookId}:`, expensesData);

          Object.entries(expensesData).forEach(([date, amount]) => {
            if (!allExpenses[date]) {
              allExpenses[date] = 0;
            }
            allExpenses[date] += amount;
          });
        }

        console.log('Calculated daily expenses:', allExpenses);
        setDailyExpenses(allExpenses);
      } catch (error) {
        console.error('이벤트와 지출액 로딩 오류', error);
      }
    };

    loadEvents();
  }, []);


  //년월일
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

  //일~토
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

  // 셀 수정 영역
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
        const cellDate = format(day, 'yyyy-MM-dd');
        const totalAmount = dailyExpenses[cellDate] || 0;
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
            onClick={() => onDateClick(cloneDay)}
          >
            <span className={styles.number}>{formattedDate}</span>
            {eventsForDay.map((event) => (
              <div key={event.title} className={event.className}>
                {event.title}
              </div>
            ))}
            {totalAmount > 0 && (
              <div className={styles.totalAmount}>₩{totalAmount.toLocaleString()}</div>
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
