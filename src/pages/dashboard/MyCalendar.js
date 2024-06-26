import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import DefaultSidebar from "../../components/DefaultSidebar";
import styles from "../../styles/dashboard/MyCalendar.module.css";
import koLocale from '@fullcalendar/core/locales/ko';
import ScheduleDetail from '../../components/ScheduleDetail'; // ScheduleDetail import

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [popupInfo, setPopupInfo] = useState({ show: false, date: null, position: { top: 0, left: 0 } });
  const calendarRef = useRef(null);

  useEffect(() => {
    const travelSchedule = [
      { title: '여행 1', start: '2024-06-01', end: '2024-06-02', className: styles.additionalEvent },
      { title: '여행 2', start: '2024-06-03', end: '2024-06-05', className: styles.additionalEvent },
      { title: '여행 3', start: '2024-06-10', end: '2024-06-12', className: styles.additionalEvent },
      { title: '여행 4', start: '2024-06-14', end: '2024-06-16', className: styles.additionalEvent },
      { title: '여행 5', start: '2024-06-18', end: '2024-06-19', className: styles.additionalEvent },
      { title: '여행 6', start: '2024-06-20', end: '2024-06-30', className: styles.additionalEvent }
    ];

    setEvents(travelSchedule);
  }, []);

  const handleDateClick = (arg) => {
    const cell = arg.dayEl;
    if (cell) {
      const rect = cell.getBoundingClientRect();
      const position = {
        top: rect.top + window.scrollY - 200, // 컴포넌트 높이 조절
        left: rect.left + window.scrollX
      };
      setPopupInfo({ show: true, date: arg.dateStr, position });
    }
  };

  const handleClosePopup = () => {
    setPopupInfo({ show: false, date: null, position: { top: 0, left: 0 } });
  };

  return (
    <div className={styles.dashboard_container} onClick={handleClosePopup}>
      <DefaultSidebar />
      <div className={styles.content}>
        <div className={styles.calendar_container} onClick={(e) => e.stopPropagation()}>
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
