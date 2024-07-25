import React, { useState, useEffect } from "react";
import ScheduleCalendar from "./ScheduleCalendar";
import { fetchEvents, fetchTotalExpenses } from "../../api/scheduleApi";
import { parseISO, addDays, format } from "date-fns";
import styles from "../../styles/myCalendar/MyCalendar.module.css";

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [hasEvent, setHasEvent] = useState({});
  const [accountBooks, setAccountBooks] = useState([]);
  const [dailyExpenses, setDailyExpenses] = useState({});
  const [totalExpenses, setTotalExpenses] = useState({});
  const [exchangeRates, setExchangeRates] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsData = await fetchEvents();
        const fetchedEvents = eventsData.map((event) => ({
          accountbookId: event.accountbookId,
          title: event.title,
          start: parseISO(event.start),
          end: parseISO(event.end),
          className: styles.additionalEvent,
          countryName: event.countryName,
          imgName: event.imgName,
        }));
        setEvents(fetchedEvents);

        const eventMap = {};
        fetchedEvents.forEach((event) => {
          let day = new Date(event.start);
          while (day <= new Date(event.end)) {
            const formattedDate = format(day, "yyyy-MM-dd");
            eventMap[formattedDate] = true;
            day = addDays(day, 1);
          }
        });
        setHasEvent(eventMap);

        setAccountBooks(
          eventsData.map((event) => ({
            id: event.accountbookId,
            imgName: event.imgName,
          }))
        );

        const expensesData = {};
        const totalExpensesData = {};
        const allExchangeRates = {};

        const expensesPromises = eventsData.map((event) =>
          fetchTotalExpenses(event.accountbookId).then((totalExpenses) => {
            const { expenses, exchangeRates } = totalExpenses;

            // 환율 정보를 병합
            Object.assign(allExchangeRates, exchangeRates);

            // 일별 지출 금액 계산
            expenses.forEach((expense) => {
              const date = format(parseISO(expense.expenseDate), "yyyy-MM-dd");
              const amountInKRW =
                expense.amount * (exchangeRates[expense.curUnit] || 1);
              if (!expensesData[date]) {
                expensesData[date] = 0;
              }
              expensesData[date] += amountInKRW;
            });

            // 총 지출 금액 계산
            totalExpensesData[event.accountbookId] = expenses.reduce(
              (sum, expense) => {
                return (
                  sum + expense.amount * (exchangeRates[expense.curUnit] || 1)
                );
              },
              0
            );
          })
        );
        // 모든 프로미스가 완료될 때까지 기다림
        await Promise.all(expensesPromises);

        setDailyExpenses(expensesData);
        setTotalExpenses(totalExpensesData);
        setExchangeRates(allExchangeRates);
      } catch (error) {
        console.error(
          "가계부 데이터를 가져오는 중 오류가 발생했습니다:",
          error
        );
      }
    };

    fetchData();
  }, []); // 빈 배열을 의존성 배열로 전달하여 처음 마운트될 때만 실행되도록 함

  return (
    <div
      className={`${styles.my_calendar_container} ${
        showPopup ? styles.show_popup : ""
      }`}
    >
      <ScheduleCalendar
        events={events}
        hasEvent={hasEvent}
        accountBooks={accountBooks}
        dailyExpenses={dailyExpenses}
        totalExpenses={totalExpenses}
        exchangeRates={exchangeRates}
        onShowPopup={() => setShowPopup(true)} // 팝업 열기
        onClosePopup={() => setShowPopup(false)} // 팝업 닫기
      />
    </div>
  );
};

export default MyCalendar;
