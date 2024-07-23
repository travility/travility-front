import React, { useState, useEffect, useMemo } from 'react';
import styles from '../../../styles/accountbook/AccountBookDetail.module.css';
import { formatDate } from '../../../util/calcUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronUp,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../../styles/StyledComponents';

const AccountBookDate = ({
  dates,
  onDateChange,
  onShowAll,
  onShowPreparation,
  onShowAfter,
}) => {
  const [selectedOption, setSelectedOption] = useState('all');
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 750);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 750);
      setItemsPerPage(
        window.innerWidth <= 540 ? (window.innerWidth <= 450 ? 4 : 5) : 6
      );
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const memoizedDates = useMemo(
    () => ['all', 'preparation', 'after', ...dates],
    [dates]
  );

  const handleDateChange = (date) => {
    const formattedDate = date.toLocaleDateString();
    setSelectedOption(formattedDate);
    onDateChange(formattedDate);
  };

  const handleShowAll = () => {
    setSelectedOption('all');
    onShowAll();
  };

  const handleShowPreparation = () => {
    setSelectedOption('preparation');
    onShowPreparation();
  };

  const handleShowAfter = () => {
    setSelectedOption('after');
    onShowAfter();
  };

  const handlePrevClick = () => {
    setVisibleStartIndex((prevIndex) =>
      prevIndex - itemsPerPage >= 0 ? prevIndex - itemsPerPage : 0
    );
  };

  const handleNextClick = () => {
    setVisibleStartIndex((prevIndex) =>
      prevIndex + itemsPerPage < memoizedDates.length
        ? prevIndex + itemsPerPage
        : prevIndex
    );
  };

  return (
    <div className={styles.date_buttons_container}>
      <div className={styles.date_navigation_buttons}>
        <button onClick={handlePrevClick} disabled={visibleStartIndex === 0}>
          <FontAwesomeIcon icon={isMobileView ? faChevronLeft : faChevronUp} />
        </button>
      </div>
      <div className={styles.date_buttons}>
        {memoizedDates
          .slice(visibleStartIndex, visibleStartIndex + itemsPerPage)
          .map((date, index) => {
            if (date === 'all') {
              return (
                <Button
                  key="all"
                  onClick={handleShowAll}
                  className={selectedOption === 'all' ? styles.selected : ''}
                >
                  모두 보기
                </Button>
              );
            }
            if (date === 'preparation') {
              return (
                <Button
                  key="preparation"
                  onClick={handleShowPreparation}
                  className={
                    selectedOption === 'preparation' ? styles.selected : ''
                  }
                >
                  준비
                </Button>
              );
            }
            if (date === 'after') {
              return (
                <Button
                  key="after"
                  onClick={handleShowAfter}
                  className={selectedOption === 'after' ? styles.selected : ''}
                >
                  사후
                </Button>
              );
            }
            return (
              <Button
                key={index}
                onClick={() => handleDateChange(date)}
                className={
                  selectedOption === date.toLocaleDateString()
                    ? styles.selected
                    : ''
                }
              >
                Day {index + 1 + visibleStartIndex - 2}
                <span
                  className={styles.tripDate}
                  data-day={formatDate(date.toISOString()).replace(
                    /\d{4}./,
                    ''
                  )}
                >
                  {formatDate(date.toISOString())}
                </span>
              </Button>
            );
          })}
      </div>
      <div className={styles.date_navigation_buttons}>
        <button
          onClick={handleNextClick}
          disabled={visibleStartIndex + itemsPerPage >= memoizedDates.length}
        >
          <FontAwesomeIcon
            icon={isMobileView ? faChevronRight : faChevronDown}
          />
        </button>
      </div>
    </div>
  );
};

export default AccountBookDate;
