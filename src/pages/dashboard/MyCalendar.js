import React, { useState, useEffect } from 'react';
import ScheduleCalendar from '../../components/ScheduleCalendar';
import ScheduleDetail from '../../components/ScheduleDetail';
import { fetchEvents, fetchDailyExpenses } from '../../api/scheduleApi'; 
import { parseISO, addDays, format } from 'date-fns';
import styles from '../../styles/dashboard/MyCalendar.module.css';

const MyCalendar = () => {
  const [popupInfo, setPopupInfo] = useState({ 
    show: false, 
    date: null, 
    accountbookId: null, 
    countryName: '', 
    imgName: '' 
  });
  
  const [events, setEvents] = useState([]);
  const [allExpenses, setAllExpenses] = useState({});
  const [hasEvent, setHasEvent] = useState({});
  const [expenses, setExpenses] = useState([]);

  // 날짜 클릭 시 호출되는 함수
  const handleDateClick = async (date, accountbookId, countryName, imgName) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const expensesArray = await fetchDailyExpenses(accountbookId);
    
    if (expensesArray.length === 0) {
      // expensesArray가 빈 배열인 경우 팝업을 표시하지 않음
      setPopupInfo({ show: false });
      return;
    }

    setPopupInfo({
      show: true,
      date: formattedDate,
      accountbookId: accountbookId,
      countryName: countryName,
      imgName: imgName
    });

    if (Array.isArray(expensesArray)) {
      setExpenses(expensesArray);
    } else {
      setExpenses([]);
      console.error('Expenses data is not an array:', expensesArray);
    }
  };

  const handleClosePopup = () => {
    setPopupInfo({
      show: false,
      date: null,
      accountbookId: null,
      countryName: '',
      imgName: ''
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsData = await fetchEvents();
        console.log('가계부 item 불러오기:', eventsData);
        const fetchedEvents = eventsData.map((event) => ({
          accountbookId: event.accountbookId,
          title: event.title,
          start: parseISO(event.start),
          end: parseISO(event.end),
          className: styles.additionalEvent,
          countryName: event.countryName,
          imgName: event.imgName
        }));
        setEvents(fetchedEvents);

        const eventMap = {};
        const expensesList = [];
        for (const event of fetchedEvents) {
          let day = new Date(event.start);
          while (day <= new Date(event.end)) {
            const formattedDate = format(day, 'yyyy-MM-dd');
            eventMap[formattedDate] = true;
            day = addDays(day, 1);
          }
          const expensesData = await fetchDailyExpenses(event.accountbookId);
          if (Array.isArray(expensesData)) {
            expensesList.push(...expensesData);
          } else {
            expensesList.push(...Object.entries(expensesData).map(([date, amount]) => ({ expenseDate: date, amount })));
          }
        }
        setHasEvent(eventMap);
        setExpenses(expensesList);

        const allExpenses = {};
        expensesList.forEach(({ expenseDate, amount }) => {
          const parsedDate = parseISO(expenseDate);
          if (!isNaN(parsedDate)) {  // 유효한 날짜인지 확인합니다.
            const formattedDate = format(parsedDate, 'yyyy-MM-dd');
            if (!allExpenses[formattedDate]) {
              allExpenses[formattedDate] = 0;
            }
            allExpenses[formattedDate] += amount;
          } else {
            console.error('Invalid date value:', expenseDate);
          }
        });
        setAllExpenses(allExpenses);
      } catch (error) {
        console.error('지출 불러오기 에러:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.my_calendar_container}>
      <div className={styles.calendar_schedule_container}>
        <div className={styles.calendar_container}>
          <ScheduleCalendar 
            onDateClick={handleDateClick} 
            events={events} 
            totalAmount={allExpenses}
            hasEvent={hasEvent}
          />
        </div>
        {popupInfo.show && (
          <div className={styles.schedule_detail_container}>
            <ScheduleDetail 
              countryName={popupInfo.countryName}
              date={popupInfo.date} 
              imgName={popupInfo.imgName}
              expenses={expenses.filter(expense => format(parseISO(expense.expenseDate), 'yyyy-MM-dd') === popupInfo.date)}
              totalAmount={allExpenses[popupInfo.date] || 0}
              onClose={handleClosePopup} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCalendar;
