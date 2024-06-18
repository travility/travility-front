import React, { useState } from "react";
import styles from "../../../styles/accountbook/AccountBookMain.module.css";
import AddBudget from "../../../components/AddBudget";

const AccountSidebar = ({
  accountBook,
  dates,
  onDateChange,
  onShowAll,
  onShowPreparation,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const backgroundImage = accountBook.imgName
    ? `/images/account/${accountBook.imgName}`
    : "";

  const formatDate = (date) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Intl.DateTimeFormat("ko-KR", options)
      .format(date)
      .replace(/\./g, ".")
      .replace(/.$/, "");
  };

  const handleDateChange = (date) => {
    setSelectedOption(date);
    onDateChange(date.toLocaleDateString());
  };

  const handleShowAll = () => {
    setSelectedOption("all");
    onShowAll();
  };

  const handleShowPreparation = () => {
    setSelectedOption("preparation");
    onShowPreparation();
  };

  const handleBudgetSubmit = () => {
    // 서버 전송 post
  };

  return (
    <aside className={styles.sidebar}>
      <div
        className={styles.tripInfo}
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        }}
      >
        <h2>{accountBook.title}</h2>
        <p>
          {formatDate(dates[0])} - {formatDate(dates[dates.length - 1])}
        </p>
      </div>
      <div className={styles.dateButtons}>
        <button
          onClick={handleShowAll}
          className={selectedOption === "all" ? styles.selected : ""}
        >
          모두 보기
          <span className={styles.selectedIcon}>
            {selectedOption === "all" ? "<" : ">"}
          </span>
        </button>
        <button
          onClick={handleShowPreparation}
          className={selectedOption === "preparation" ? styles.selected : ""}
        >
          준비
          <span className={styles.selectedIcon}>
            {selectedOption === "preparation" ? "<" : ">"}
          </span>
        </button>
        {dates.map((date, index) => (
          <button
            key={index}
            onClick={() => handleDateChange(date)}
            className={
              selectedOption?.getTime?.() === date.getTime()
                ? styles.selected
                : ""
            }
          >
            Day {index + 1}
            <span className={styles.tripDate}>{formatDate(date)}</span>
            <span className={styles.selectedIcon}>
              {selectedOption?.getTime?.() === date.getTime() ? "<" : ">"}
            </span>
          </button>
        ))}
      </div>
      <div className={styles.icons}>
        <span>
          <button>
            <img src="/images/account/statistic.png" alt="statistic" />
          </button>
          <p>지출 통계</p>
        </span>
        <span>
          <button onClick={() => setIsModalOpen(true)}>
            <img src="/images/account/local_atm.png" alt="budget" />
          </button>
          <p>화폐/예산 추가</p>
        </span>
        <span>
          <button>
            <img src="/images/account/write.png" alt="addExpense" />
          </button>
          <p>지출 내역 추가</p>
        </span>
      </div>
      {isModalOpen && (
        <AddBudget
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleBudgetSubmit}
        />
      )}
    </aside>
  );
};

export default AccountSidebar;
