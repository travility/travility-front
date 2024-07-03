import React, { useState, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, parseISO, isWithinInterval } from "date-fns";
import axios from "../util/axiosInterceptor";
import styles from "../styles/components/ScheduleCalendar.module.css";

const ScheduleCalendar = ({ onDateClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/accountBook/schedule');
        const fetchedEvents = response.data.map(event => ({
          title: event.title,
          start: parseISO(event.start),
          end: parseISO(event.end),
          className: styles.additionalEvent
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
        <button className={styles.navButton} onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>{"<"}</button>
        <div className={styles.header_years_month}>{format(currentMonth, "MMM yyyy")}</div>
        <button className={styles.navButton} onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>{">"}</button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const date = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const eventsForDay = events.filter(event => 
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
              : hasEvent
              ? styles.cellWithEvent
              : ""
            }`}
            key={day}
            onClick={() => onDateClick(cloneDay)}
          >
            <span className={styles.number}>{formattedDate}</span>
            {eventsForDay.map(event => (
              <div 
                key={event.title} 
                className={event.className}>
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
    <div className={styles.calendar}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default ScheduleCalendar;