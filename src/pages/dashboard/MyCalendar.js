import React, { useState, useEffect } from 'react';
import ScheduleCalendar from '../../components/ScheduleCalendar';
import { fetchEvents } from '../../api/scheduleApi'; 
import { parseISO, addDays, format } from 'date-fns';
import styles from '../../styles/dashboard/MyCalendar.module.css';

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [hasEvent, setHasEvent] = useState({});
  const [accountBooks, setAccountBooks] = useState([]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsData = await fetchEvents();
        console.log('Fetched Events:', eventsData); 
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
        fetchedEvents.forEach(event => {
          let day = new Date(event.start);
          while (day <= new Date(event.end)) {
            const formattedDate = format(day, 'yyyy-MM-dd');
            eventMap[formattedDate] = true;
            day = addDays(day, 1);
          }
        });
        setHasEvent(eventMap);

        setAccountBooks(eventsData.map(event => ({
          id: event.accountbookId,
          imgName: event.imgName
        })));
      } catch (error) {
        console.error('가계부 데이터를 가져오는 중 오류가 발생했습니다:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.my_calendar_container}>
      <div className={styles.calendar_schedule_container}>
        <div className={styles.calendar_container}>
          <ScheduleCalendar 
            events={events} 
            hasEvent={hasEvent}
            accountBooks={accountBooks} 
          />
        </div>
      </div>
    </div>
  );
};

export default MyCalendar;
