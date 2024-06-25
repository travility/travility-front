import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "react-modal";
import { eachDayOfInterval, parseISO, format } from "date-fns";
import DefaultSidebar from '../../components/DefaultSidebar';import styles from "../../styles/dashboard/MyCalendar2.module.css";

Modal.setAppElement("#root");

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const data = {
      startDate: "2024-06-10",
      endDate: "2024-06-20",
      country: "Japan",
      expenses: [
        { expenseDate: "2024-06-12", amount: 10000000 },
        { expenseDate: "2024-06-13", amount: 50000000 },
        { expenseDate: "2024-06-18", amount: 20000000 },
      ],
    };

    const travelDays = eachDayOfInterval({
      start: parseISO(data.startDate),
      end: parseISO(data.endDate),
    }).map((date, index) => ({
      title: index === 0 ? data.country : "",
      start: format(date, "yyyy-MM-dd"),
      className: styles.travelPeriod,
    }));

    const expenseEvents = data.expenses.map((expense) => ({
      title: `KRW ${expense.amount}`,
      start: expense.expenseDate,
      className: styles.expenseLabel,
    }));

    setEvents([...travelDays, ...expenseEvents]);
  }, []);

  const handleDateClick = (arg) => {
    const event = events.find((event) => event.start === arg.dateStr);
    if (event) {
      setSelectedEvent(event);
      setIsOpen(true);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className={styles.dashboard_container}>
      <DefaultSidebar />
      <div className={styles.content}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={handleDateClick}
        />
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className={styles.modalContent}
          overlayClassName={styles.modalOverlay}
        >
          <div className={styles.modalHeader}>
            <h2>{selectedEvent ? selectedEvent.title : ""}</h2>
            <button onClick={closeModal}>&times;</button>
          </div>
          <div className={styles.modalBody}>
            {selectedEvent && (
              <>
                <div>{selectedEvent.start}</div>
                <img src="/path/to/image.png" alt="서울" className={styles.modalImage} />
                <div className={styles.modalTabs}>
                  <button>모두</button>
                  <button>개인</button>
                  <button>공용</button>
                </div>
                <div className={styles.expenseDetail}>
                  <div>식비 28000원</div>
                  <div>샤브샤브</div>
                </div>
                <div className={styles.totalExpense}>총 사용 비용</div>
              </>
            )}
          </div>
          <div className={styles.modalFooter}>
            <button>편집하기</button>
            <button>삭제하기</button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default MyCalendar;
