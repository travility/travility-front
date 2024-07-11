import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAccountBooks } from "../../../api/accountbookApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import TripInfo from "../../../components/TripInfo";
import styles from "../../../styles/main/mainPage2/MainPage.module.css";

// 최근 내 가계부
const RecentAccountBooks = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [accountBooks, setAccountBooks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);

  useEffect(() => {
    const fetchAccountBooks = async () => {
      try {
        const data = await getAccountBooks(id);
        if (Array.isArray(data)) {
          setAccountBooks(data);
        } else {
          setError(new Error("Unexpected response format"));
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountBooks();
  }, [id]);

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
      prevIndex - 2 >= 0 ? prevIndex - 2 : 0
    );
  };

  const handleNextClick = () => {
    setVisibleStartIndex((prevIndex) =>
      prevIndex + 2 < accountBooks.length ? prevIndex + 2 : prevIndex
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
              <FontAwesomeIcon icon={faChevronUp} />
            </button>
          </div>
          <div className={styles.recent_accountBooks_list}>
            {accountBooks
              .slice(visibleStartIndex, visibleStartIndex + 2)
              .map((accountBook) => (
                <TripInfo
                  key={accountBook.id}
                  accountBook={accountBook}
                  onClick={handleRecentAccountBooksClick}
                />
              ))}
          </div>
          <div className={styles.recent_accountBooks_navigation_buttons}>
            <button
              onClick={handleNextClick}
              disabled={visibleStartIndex + 2 >= accountBooks.length}
            >
              <FontAwesomeIcon icon={faChevronDown} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentAccountBooks;
