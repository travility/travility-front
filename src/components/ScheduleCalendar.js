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
import ScheduleDetail from '../components/ScheduleDetail';
import {fetchDailyExpenses, fetchAllExpensesByAccountbookId, formatDate  } from '../api/scheduleApi'; 
import styles from '../styles/components/ScheduleCalendar.module.css';

const ScheduleCalendar = ({ onDateClick, events, hasEvent, accountBooks }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [popupInfo, setPopupInfo] = useState({ 
    show: false, 
    date: null, 
    accountbookId: null, 
    expenses: [],
    curUnit: '',
    countryName: '',
    imgName: '',
    totalAmount: 0
  });

  const handleDateClick = async (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    console.log('Date Clicked:', formattedDate);

    // 이벤트가 없는 경우 팝업을 표시하지 않음
    if (!hasEvent[formattedDate]) {
      console.log('이 날짜에 이벤트가 없습니다.');
      return;
    }

    const eventsForDate = events.filter(event => 
      isSameDay(event.start, date) || (event.start <= date && event.end >= date)
    );

    if (eventsForDate.length === 0) {
      console.log('이 날짜에 이벤트가 없습니다.');
      return;
    }

    const { accountbookId, countryName, imgName } = eventsForDate[0];

    console.log('Account Book ID:', accountbookId); 
    console.log('Country Name:', countryName);
    console.log('Image Name:', imgName); 

    try {
      const expenses = await fetchAllExpensesByAccountbookId(accountbookId);
      console.log(`특정 날짜별 모든 지출 정보 ${formattedDate}:`, expenses);

      const expensesForDate = expenses.filter(expense => 
        formatDate(expense.expenseDate) === formattedDate
      );

      const curUnit = expensesForDate.length > 0 ? expensesForDate[0].curUnit : '';
      const totalAmount = expensesForDate.reduce((sum, expense) => sum + expense.amount, 0);

      setPopupInfo({
        show: true,
        date: formattedDate,
        accountbookId: accountbookId,
        expenses: expensesForDate,
        countryName: countryName,
        imgName: imgName,
        curUnit: curUnit,
        totalAmount: totalAmount
      });
    } catch (error) {
      console.error('지출 항목을 가져오는 중 오류가 발생했습니다:', error);
    }
  };

  const handleClosePopup = () => {
    setPopupInfo({
      show: false,
      date: null,
      accountbookId: null, 
      expenses: [],
      countryName: '',
      imgName: '',
      curUnit: '',
      totalAmount: 0
    });
  };

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
            onClick={() => handleDateClick(cloneDay, eventsForDay[0]?.accountbookId, eventsForDay[0]?.countryName, eventsForDay[0]?.imgName)}
          >
            <span className={styles.number}>{formattedDate}</span>
            {eventsForDay.map((event) => (
              <div key={event.title} className={styles.event}>
                {event.title}
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
    <div className={styles.calendar_container}>
      <div className={styles.calendar}>
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>
      {popupInfo.show && (
        <div className={styles.schedule_detail_container}>
          <ScheduleDetail 
            countryName={popupInfo.countryName}
            date={popupInfo.date} 
            imgName={popupInfo.imgName}
            expenses={popupInfo.expenses}
            curUnit={popupInfo.curUnit}
            totalAmount={popupInfo.totalAmount}
            onClose={handleClosePopup}
            accountBooks={accountBooks}
            accountbookId={popupInfo.accountbookId}
          />
        </div>
      )}
    </div>
  );
};

export default ScheduleCalendar;