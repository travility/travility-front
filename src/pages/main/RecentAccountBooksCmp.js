import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAccountBooks } from "../../api/accountbookApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import TripInfo from "../common/TripInfoCmp";
import styles from "../../styles/main/MainPage.module.css";
import { handleProblemSubject } from "../../util/swalUtils";

// 최근 내 가계부
const RecentAccountBooks = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [accountBooks, setAccountBooks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(2); // 기본값은 두 개
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 690);

  useEffect(() => {
    const fetchAccountBooks = async () => {
      try {
        const data = await getAccountBooks("new");
        if (Array.isArray(data)) {
          setAccountBooks(data);
        } else {
          handleProblemSubject("가계부 조회");
          setError(new Error("Unexpected response format"));
        }
      } catch (error) {
        handleProblemSubject("가계부 조회");
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountBooks();
  }, [id]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 690);
      if (window.innerWidth <= 560) {
        setItemsPerPage(1);
      } else {
        setItemsPerPage(2);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // 초기 실행을 위해 호출

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleRecentAccountBooksClick = (book) => {
    navigate(`/accountbook/detail/${book.id}`);
  };

  const handlePrevClick = () => {
    setVisibleStartIndex((prevIndex) =>
      prevIndex - itemsPerPage >= 0 ? prevIndex - itemsPerPage : 0
    );
  };

  const handleNextClick = () => {
    setVisibleStartIndex((prevIndex) =>
      prevIndex + itemsPerPage < accountBooks.length
        ? prevIndex + itemsPerPage
        : prevIndex
    );
  };

  return (
    <div className={styles.recent_accountBooks_container}>
      <p className={styles.recent_accountBooks_header}>최근 내 가계부</p>
      {accountBooks.length === 0 ? (
        <div className={styles.recent_accountBooks_no_item_message}>
          아직 등록된 여행이 없어요 😅
        </div>
      ) : (
        <div className={styles.recent_accountBooks_contents}>
          <div className={styles.recent_accountBooks_navigation_buttons}>
            <button
              onClick={handlePrevClick}
              disabled={visibleStartIndex === 0}
            >
              <FontAwesomeIcon icon={isMobile ? faChevronLeft : faChevronUp} />
            </button>
          </div>
          <div className={styles.recent_accountBooks_list}>
            {accountBooks
              .slice(visibleStartIndex, visibleStartIndex + itemsPerPage)
              .map((accountBook) => (
                <TripInfo
                  key={accountBook.id}
                  accountBook={accountBook}
                  onClick={handleRecentAccountBooksClick}
                  isSettlement={false}
                />
              ))}
          </div>
          <div className={styles.recent_accountBooks_navigation_buttons}>
            <button
              onClick={handleNextClick}
              disabled={visibleStartIndex + itemsPerPage >= accountBooks.length}
            >
              <FontAwesomeIcon
                icon={isMobile ? faChevronRight : faChevronDown}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentAccountBooks;
