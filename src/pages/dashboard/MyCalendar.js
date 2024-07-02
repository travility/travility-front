import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import styles from "../../styles/dashboard/MyCalendar.module.css";
import koLocale from '@fullcalendar/core/locales/ko';
import axios from "../../util/axiosInterceptor";
import ScheduleDetail from '../../components/ScheduleDetail';

const MyCalendar = () => {
  const calendarRef = useRef(null);
  const containerRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [popupInfo, setPopupInfo] = useState({ show: false, date: null, position: { top: 0, left: 0 } });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/accountBook/schedule');
        const fetchedEvents = response.data.map(event => ({
          title: event.title,
          start: event.start,
          end: event.end,
          className: styles.additionalEvent
        }));
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching account books', error);
      }
    };

    fetchEvents();
  }, []);

  const handleDateClick = (arg) => {
    const cell = arg.dayEl;
    if (cell && containerRef.current) {
      const rect = cell.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const popupWidth = 350;
      const popupHeight = 700;

      let topPosition = rect.top + window.scrollY - 200;
      let leftPosition = rect.left + window.scrollX;

      if (leftPosition + popupWidth > containerRect.right) {
        leftPosition = containerRect.right - popupWidth;
      }

      if (topPosition + popupHeight > containerRect.bottom) {
        topPosition = containerRect.bottom - popupHeight;
      }

      setPopupInfo({ show: true, date: arg.dateStr, position: { top: topPosition, left: leftPosition } });
    }
  };

  const handleClosePopup = () => {
    setPopupInfo({ show: false, date: null, position: { top: 0, left: 0 } });
  };

  return (
    <div className={styles.dashboard_container} onClick={handleClosePopup}>
      <div className={styles.content}>
        <div ref={containerRef} className={styles.calendar_container} onClick={(e) => e.stopPropagation()}>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={koLocale}
            headerToolbar={{
              left: 'title',
              center: '',
              right: 'today prev,next'
            }}
            events={events}
            dateClick={handleDateClick}
            eventContent={(eventInfo) => (
              <div className={eventInfo.event.classNames.join(" ")}>
                {eventInfo.isStart ? eventInfo.event.title : ''}
              </div>
            )}
          />
        </div>
        {popupInfo.show && (
          <ScheduleDetail 
            date={popupInfo.date} 
            onClose={handleClosePopup} 
            position={popupInfo.position} 
          />
        )}
      </div>
    </div>
  );
};

export default MyCalendar;
