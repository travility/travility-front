import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../styles/accountbook/AccountBookListPage.module.css";
import { getAccountBooks } from "../../api/accountbookApi";

const AccountBookListPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [accountBooks, setAccountBooks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleHomeClick = () => {
    navigate("/main");
  };

  const handleAccountBookClick = (book) => {
    navigate(`/accountbook/detail/${book.id}`);
  };

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
      return "KRW 0";
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

  return (
    <div className={styles.accountBook_list_page}>
      <div className={styles.accountBook_list_header}>
        <div className={styles.accountBook_list_header_container}>
          <p className={styles.accountBook_list_header_total}>전체 가계부</p>
          <div className={styles.accountBook_list_header_total_line}></div>
        </div>
        <button
          onClick={handleHomeClick}
          className={styles.accountBook_list_home_button}
        >
          홈으로 돌아가기
        </button>
      </div>

      <div className={styles.accountBook_list_grid_container}>
        {accountBooks.map((book) => (
          <div
            key={book.id}
            className={styles.accountBook_list_grid_item}
            style={{
              backgroundImage: `url(${
                book.imgName || "/public/images/default.png"
              })`,
            }}
            onClick={() => handleAccountBookClick(book)}
            alt={book.title}
          >
            <div className={styles.accountBook_list_info}>
              <span className={styles.accountBook_list_title}>
                {book.title}
              </span>
              <span className={styles.accountBook_list_dates}>
                {`${book.startDate} ~ ${book.endDate}`}
              </span>
            </div>
            <span className={styles.accountBook_list_amount}>
              {calculateTotalAmountInKRW(book)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountBookListPage;
