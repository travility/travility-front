import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAccountBooks } from '../../../api/accountbookApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import styles from '../../../styles/main/mainPage2/MainPage.module.css';

//최근 내 가계부
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
          setError(new Error('Unexpected response format'));
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

  const calculateAverageExchangeRate = (budgets, currency) => {
    const relevantBudgets = budgets.filter((b) => b.curUnit === currency);
    const totalAmount = relevantBudgets.reduce(
      (sum, budget) => sum + budget.amount,
      0
    );
    const weightedSum = relevantBudgets.reduce(
      (sum, budget) => sum + budget.exchangeRate * budget.amount,
      0
    );
    return weightedSum / totalAmount;
  };

  const calculateTotalAmountInKRW = (book) => {
    if (
      !book ||
      !book.expenses ||
      !book.budgets ||
      !book.expenses.length ||
      !book.budgets.length
    ) {
      return 'KRW 0';
    }

    const averageExchangeRates = {};
    book.budgets.forEach((budget) => {
      if (!averageExchangeRates[budget.curUnit]) {
        averageExchangeRates[budget.curUnit] = calculateAverageExchangeRate(
          book.budgets,
          budget.curUnit
        );
      }
    });

    const totalAmount = book.expenses.reduce((total, expense) => {
      const exchangeRate = averageExchangeRates[expense.currency] || 1;
      return total + expense.amount * exchangeRate;
    }, 0);

    return `KRW ${totalAmount.toLocaleString()}`;
  };

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

  const formatDate = (dateString) => {
    return dateString.split('T')[0];
  };

  return (
    <>
      <div className={styles.recent_accountBooks_container}>
        <p className={styles.recent_accountBooks_header}>최근 내 가계부</p>
        {accountBooks.length === 0 ? (
          <div className={styles.recent_accountBooks_no_item_message}>
            아직 등록된 여행이 없어요 😅
          </div>
        ) : (
          <div className={styles.recent_accountBooks_wrapper}>
            <div className={styles.recent_accountBooks_navigation_buttons}>
              <button
                onClick={handlePrevClick}
                disabled={visibleStartIndex === 0}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
            </div>
            <div className={styles.recent_accountBooks_list}>
              {accountBooks
                .slice(visibleStartIndex, visibleStartIndex + 2)
                .map((accountBook) => (
                  <div
                    key={accountBook.id}
                    className={styles.recent_accountBooks_item}
                    style={{
                      backgroundImage: `url(
            http://localhost:8080/images/${accountBook.imgName}
          )`,
                    }}
                    onClick={() => handleRecentAccountBooksClick(accountBook)}
                    alt={accountBook.title}
                  >
                    <div className={styles.recent_accountBooks_item_details}>
                      <div
                        className={styles.recent_accountBooks_title_and_flag}
                      >
                        <span className={styles.recent_accountBook_flag}>
                          <img src={accountBook.countryFlag} alt="국기" />
                        </span>
                        <span className={styles.recent_accountBooks_item_title}>
                          {accountBook.title}
                        </span>
                      </div>
                      <span className={styles.recent_accountBooks_item_dates}>
                        {`${formatDate(accountBook.startDate)} ~ ${formatDate(
                          accountBook.endDate
                        )}`}
                      </span>
                      <span className={styles.recent_accountBooks_item_amount}>
                        {calculateTotalAmountInKRW(accountBook)}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
            <div className={styles.recent_accountBooks_navigation_buttons}>
              <button
                onClick={handleNextClick}
                disabled={visibleStartIndex + 2 >= accountBooks.length}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RecentAccountBooks;
