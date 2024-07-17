import React, { useState, useEffect, useMemo } from "react";
import styles from "../../../styles/accountbook/AccountBookDetail.module.css";
import AddBudget from "../../../components/AddBudget";
import AddExpense from "../../../components/AddExpense";
import { addBudgets } from "../../../api/budgetApi";
import { addExpense } from "../../../api/expenseApi";
import { updateAccountBook } from "../../../api/accountbookApi";
import { formatDate } from "../../../util/calcUtils";
import UpdateTripInfo from "./UpdateTripInfo";
import {
  handleSuccessSubject,
  handlefailureSubject,
} from "../../../util/logoutUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../../styles/StyledComponents";
import TripInfo from "../../../components/TripInfo";

const AccountSidebar = ({
  accountBook,
  dates,
  onDateChange,
  onShowAll,
  onShowPreparation,
}) => {
  const [selectedOption, setSelectedOption] = useState("all");
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isTripInfoModalOpen, setIsTripInfoModalOpen] = useState(false);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 850);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 850);
      setItemsPerPage(
        window.innerWidth <= 850
          ? window.innerWidth <= 610
            ? window.innerWidth <= 560
              ? window.innerWidth <= 480
                ? 4
                : 5
              : 6
            : 7
          : 6
      );
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const memoizedDates = useMemo(
    () => ["all", "preparation", ...dates],
    [dates]
  );

  const handleDateChange = (date) => {
    const formattedDate = date.toLocaleDateString();
    setSelectedOption(formattedDate);
    onDateChange(formattedDate);
  };

  const handleShowAll = () => {
    setSelectedOption("all");
    onShowAll();
  };

  const handleShowPreparation = () => {
    setSelectedOption("preparation");
    onShowPreparation();
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

  const handleBudgetSubmit = async (budgets) => {
    try {
      const totalBudget = budgets.reduce(
        (sum, budget) =>
          sum + parseFloat(budget.amount) * parseFloat(budget.exchangeRate),
        0
      );

      const budgetsResponse = await addBudgets(accountBook.id, budgets);
      console.log("Budgets updated successfully:", budgetsResponse);
      handleSuccessSubject("예산", "수정");
    } catch (error) {
      console.error("Error updating budgets:", error);
      handleFailureSubject("예산", "수정");
    } finally {
      setIsBudgetModalOpen(false);
    }
  };

  const handleExpenseSubmit = async (expense) => {
    try {
      const expenseResponse = await addExpense(expense);
      console.log("Expense added successfully:", expenseResponse);
      handleSuccessSubject("지출", "추가");
    } catch (error) {
      console.error("Error:", error);
      handleFailureSubject("지출", "추가");
    } finally {
      setIsExpenseModalOpen(false);
    }
  };

  const handleAccountBookSubmit = async (tripInfo) => {
    try {
      const accountBookResponse = await updateAccountBook(
        accountBook.id,
        tripInfo
      );
      console.log("AccountBook updated successfully: ", accountBookResponse);
      handleSuccessSubject("가계부", "수정");
    } catch (error) {
      console.log("Error updating AccountBook: ", error);
      handleFailureSubject("가계부", "수정");
    } finally {
      setIsTripInfoModalOpen(false);
    }
  };

  return (
    <aside className={styles.sidebar}>
      <TripInfo
        accountBook={accountBook}
        onClick={() => setIsTripInfoModalOpen(true)}
      />
      <div className={styles.date_buttons_container}>
        <div className={styles.date_navigation_buttons}>
          <button onClick={handlePrevClick} disabled={visibleStartIndex === 0}>
            <FontAwesomeIcon
              icon={isMobileView ? faChevronLeft : faChevronUp}
            />
          </button>
        </div>
        <div className={styles.date_buttons}>
          {memoizedDates
            .slice(visibleStartIndex, visibleStartIndex + itemsPerPage)
            .map((date, index) => {
              if (date === "all") {
                return (
                  <Button
                    key="all"
                    onClick={handleShowAll}
                    className={selectedOption === "all" ? styles.selected : ""}
                  >
                    모두 보기
                  </Button>
                );
              }
              if (date === "preparation") {
                return (
                  <Button
                    key="preparation"
                    onClick={handleShowPreparation}
                    className={
                      selectedOption === "preparation" ? styles.selected : ""
                    }
                  >
                    준비
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
                      : ""
                  }
                >
                  Day {index + 1 + visibleStartIndex - 2}
                  <span
                    className={styles.tripDate}
                    data-day={formatDate(date.toISOString()).replace(
                      /\d{4}./,
                      ""
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
      <div className={styles.accountbook_icons}>
        <span>
          <Button>
            <img src="/images/account/statistic.png" alt="statistic" />
          </Button>
          <p>지출 통계</p>
        </span>
        <span>
          <Button onClick={() => setIsBudgetModalOpen(true)}>
            <img src="/images/account/local_atm.png" alt="budget" />
          </Button>
          <p>
            화폐/예산
            <br />
            추가
          </p>
        </span>
        <span>
          <Button onClick={() => setIsExpenseModalOpen(true)}>
            <img src="/images/account/write.png" alt="addExpense" />
          </Button>
          <p>
            지출내역
            <br />
            추가
          </p>
        </span>
      </div>
      {isBudgetModalOpen && (
        <AddBudget
          isOpen={isBudgetModalOpen}
          onClose={() => setIsBudgetModalOpen(false)}
          onSubmit={handleBudgetSubmit}
          accountBookId={accountBook.id}
          initialBudgets={accountBook.budgets}
        />
      )}
      {isExpenseModalOpen && (
        <AddExpense
          isOpen={isExpenseModalOpen}
          onClose={() => setIsExpenseModalOpen(false)}
          onSubmit={handleExpenseSubmit}
          accountBookId={accountBook.id}
          accountBook={accountBook}
        />
      )}
      {isTripInfoModalOpen && (
        <UpdateTripInfo
          isOpen={isTripInfoModalOpen}
          onClose={() => setIsTripInfoModalOpen(false)}
          onSubmit={handleAccountBookSubmit}
          accountBook={accountBook}
        />
      )}
    </aside>
  );
};

export default AccountSidebar;
