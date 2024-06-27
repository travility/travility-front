import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import DefaultSidebar from "../../components/DefaultSidebar";
import styles from "../../styles/dashboard/MyCalendar.module.css";
import koLocale from '@fullcalendar/core/locales/ko';
import ScheduleDetail from '../../components/ScheduleDetail';
import { getAccountBooks } from '../../api/scheduleApi';

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [popupInfo, setPopupInfo] = useState({ show: false, date: null, position: { top: 0, left: 0 } });
  const calendarRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchAccountBooks = async () => {
      try {
        const accountBooks = await getAccountBooks();
        const events = accountBooks.map(book => {
          const startDate = book.startDate ? book.startDate.split(' ')[0] : null;
          const endDate = book.endDate ? book.endDate.split(' ')[0] : null;
          return {
            title: book.title,
            start: startDate,
            end: endDate,
            className: styles.additionalEvent
          };
        }).filter(event => event.start && event.end); // 필터링하여 유효한 이벤트만 반환
        setEvents(events);
      } catch (error) {
        console.error("Error fetching account books", error);
      }
    };

    fetchAccountBooks();
  }, []);

  const handleDateClick = (arg) => {
    const cell = arg.dayEl;
    if (cell && containerRef.current) {
      const rect = cell.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const popupWidth = 350; // ScheduleDetail 컴포넌트의 가로 크기
      const popupHeight = 700; // ScheduleDetail 컴포넌트의 세로 크기

      let top = rect.top + window.scrollY - 200;
      let left = rect.left + window.scrollX;

      // 오른쪽 끝을 넘어가는 경우
      if (left + popupWidth > containerRect.right) {
        left = containerRect.right - popupWidth;
      }

      // 아래쪽 끝을 넘어가는 경우
      if (top + popupHeight > containerRect.bottom) {
        top = containerRect.bottom - popupHeight;
      }

      setPopupInfo({ show: true, date: arg.dateStr, position: { top, left } });
    }
  };

  const handleClosePopup = () => {
    setPopupInfo({ show: false, date: null, position: { top: 0, left: 0 } });
  };

  return (
    <div className={styles.dashboard_container} onClick={handleClosePopup}>
      <DefaultSidebar />
      <div className={styles.content}>
        <div ref={containerRef} className={styles.calendar_container} onClick={(e) => e.stopPropagation()}>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            locale={koLocale}
            headerToolbar={{
              left: 'title',
              center: '',
              right: 'today prev,next'
            }}
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
