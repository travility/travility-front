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
  setYear,
} from 'date-fns';
import ScheduleDetail from '../components/ScheduleDetail';
import {
  fetchDailyExpenses,
  fetchAllExpensesByAccountbookId,
  formatDate,
  fetchTotalExpenses,
} from '../api/scheduleApi';
import { formatNumberWithCommas } from '../util/calcUtils';
import styles from '../styles/components/ScheduleCalendar.module.css';

const ScheduleCalendar = ({
  onDateClick,
  events,
  hasEvent,
  accountBooks,
  dailyExpenses,
  totalExpenses,
  exchangeRates,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const currentYear = currentMonth.getFullYear();
  const [startYear, setStartYear] = useState(currentYear - 20); //현재 년도 -20 부터
  const [endYear, setEndYear] = useState(currentYear + 1); //현재 년도 +20 까지만 로딩함
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  ); //배열에 담아서 사용

  //연도 변경
  const handleYearChange = (event) => {
    const newYear = parseInt(event.target.value, 10);
    if (newYear <= startYear) {
      setStartYear(startYear - 20);
    } else if (newYear >= endYear) {
      setEndYear(endYear + 1);
    }
    setCurrentMonth(setYear(currentMonth, newYear));
  };

  //오늘로 가기 기능
  const goToToday = () => {
    setCurrentMonth(startOfMonth(new Date()));
  };

  //모달로 넘길 정보
  const [popupInfo, setPopupInfo] = useState({
    show: false,
    date: null,
    accountbookId: null,
    expenses: [],
    curUnit: '',
    countryName: '',
    imgName: '',
    totalExpense: 0,
    exchangeRates: {},
  });

  //날짜 클릭 시 동작
  const handleDateClick = async (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    console.log('Date Clicked:', formattedDate);

    // 이벤트가 없는 경우 팝업을 표시하지 않음
    if (!hasEvent[formattedDate]) {
      console.log('이 날짜에 이벤트가 없습니다.');
      return;
    }

    const eventsForDate = events.filter(
      (event) =>
        isSameDay(event.start, date) ||
        (event.start <= date && event.end >= date)
    );

    if (eventsForDate.length === 0) {
      console.log('이 날짜에 이벤트가 없습니다.');
      return;
    }

    const { accountbookId, countryName, imgName } = eventsForDate[0];
    const totalExpensesData = await fetchTotalExpenses(accountbookId);
    const { totalAmount, exchangeRates } = totalExpensesData;

    console.log('Account Book ID:', accountbookId);
    console.log('Country Name:', countryName);
    console.log('Image Name:', imgName);

    try {
      const expenses = await fetchAllExpensesByAccountbookId(accountbookId);
      console.log(`특정 날짜별 모든 지출 정보 ${formattedDate}:`, expenses);

      const expensesForDate = expenses.filter(
        (expense) => formatDate(expense.expenseDate) === formattedDate
      );

      const curUnit =
        expensesForDate.length > 0 ? expensesForDate[0].curUnit : '';
      const totalExpense = totalExpenses[accountbookId] || 0;

      setPopupInfo({
        show: true,
        date: formattedDate,
        accountbookId: accountbookId,
        expenses: expensesForDate,
        countryName: countryName,
        imgName: imgName,
        curUnit: curUnit,
        totalExpense: totalAmount,
        exchangeRates: exchangeRates,
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
      totalExpense: 0,
    });
  };

  //년 월
  const renderHeader = () => {
    return (
      <div className={styles.header}>
        <button
          className={styles.navButton}
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          {'<'}
        </button>
        <div className={styles.centerSection}>
          {format(currentMonth, 'MMM')}{' '}
          <select
            className={styles.yearSelect}
            value={currentYear}
            onChange={handleYearChange}
          >
            {years.map((year) => (
              <option key={year} value={year} className={styles.option}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button className={styles.todayButton} onClick={goToToday}>
            today
          </button>
          <button
            className={styles.navButton}
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            {'>'}
          </button>
        </div>
      </div>
    );
  };

  //요일
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

  //셀
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
        // 해당 날짜의 총 지출 금액 가져오기
        const totalExpense = dailyExpenses[cellDate] || 0;

        days.push(
          <div
            className={`${styles.cell} ${
              !isSameMonth(day, monthStart)
                ? styles.disabled
                : isSameDay(day, new Date()) && hasEvent[cellDate]
                ? `${styles.selected} ${styles.cellWithEvent}`
                : isSameDay(day, new Date())
                ? styles.selected
                : hasEvent[cellDate]
                ? styles.cellWithEvent
                : ''
            }`}
            key={day}
            onClick={() =>
              handleDateClick(
                cloneDay,
                eventsForDay[0]?.accountbookId,
                eventsForDay[0]?.countryName,
                eventsForDay[0]?.imgName
              )
            }
          >
            <span className={styles.number}>{formattedDate}</span>
            {eventsForDay.map((event) => (
              <div key={event.title} className={styles.event}>
                {event.title}
              </div>
            ))}
            {totalExpense !== 0 && (
              <div className={styles.cell_total_amount}>
                ₩{formatNumberWithCommas(totalExpense.toFixed(0))}
              </div>
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
    <div
      className={`${styles.calendar_container} ${
        popupInfo.show ? styles.show_popup : ''
      }`}
    >
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
            totalExpense={popupInfo.totalExpense}
            onClose={handleClosePopup}
            accountBooks={accountBooks}
            accountbookId={popupInfo.accountbookId}
            exchangeRates={popupInfo.exchangeRates}
          />
        </div>
      )}
    </div>
  );
};

export default ScheduleCalendar;
