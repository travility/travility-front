import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import DefaultSidebar from "../../components/DefaultSidebar";
import styles from "../../styles/dashboard/MyCalendar2.module.css";
import { eachDayOfInterval, parseISO, format } from "date-fns";

const MyCalendar2 = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const data = {
      startDate: "2024-06-10",
      endDate: "2024-06-20",
      country: "Japan",
      expenses: [
        { expenseDate: "2024-06-12", amount: 10000000 },
        { expenseDate: "2024-06-15", amount: 50000000 },
        { expenseDate: "2024-06-18", amount: 20000000 },
      ],
    };

    const travelDays = eachDayOfInterval({
      start: parseISO(data.startDate),
      end: parseISO(data.endDate),
    }).map((date, index) => ({
      title: index === 0 ? data.country : "",
      start: format(date, "yyyy-MM-dd"),
      classNames: [styles.travelPeriod],
    }));

    const expenseEvents = data.expenses.map((expense) => ({
      title: `KRW ${expense.amount}`,
      start: expense.expenseDate,
      classNames: [styles.expenseLabel],
    }));

    setEvents([...travelDays, ...expenseEvents]);
  }, []);

  const renderEventContent = (eventInfo) => {
    if (
      eventInfo.event.classNames.includes(styles.countryLabel) ||
      eventInfo.event.title === "Japan"
    ) {
      return <div className={styles.countryLabel}>{eventInfo.event.title}</div>;
    }

    if (eventInfo.event.classNames.includes(styles.expenseLabel)) {
      return <div className={styles.expenseLabel}>{eventInfo.event.title}</div>;
    }

    return null;
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <DefaultSidebar />
      </div>
      <div className={styles.calendarContainer}>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventContent={renderEventContent}
          height="100%"
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
};

export default MyCalendar2;
