import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAccountBooks } from "../../api/accountbookApi";
import { fetchCountryFlags } from "../../api/accountbookApi";
import styles from "../../styles/accountbook/AccountBookListPage.module.css";

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

  const formatDate = (dateString) => {
    return dateString.split('T')[0];
  };

  return (
    <div className={styles.accountBook_list_page}>
      <div className={styles.accountBook_list_grid_container}>
        {accountBooks.map((book) => (
          <div
            key={book.id}
            className={styles.accountBook_list_grid_item}
            style={{
              backgroundImage: `url(${
                book.imgName || "/images/default.png"
              })`,
            }}
            onClick={() => handleAccountBookClick(book)}
            alt={book.title}
          >
            <div className={styles.accountBook_list_item_detail}>
              <div className={styles.accountBook_list_title_and_flag}>
                <span className={styles.accountBook_list_flag}>
                  <img src={book.countryFlag} alt="국기" />
                </span>
                <span className={styles.accountBook_list_title}>
                  {book.title}
                </span>
              </div>
              <span className={styles.accountBook_list_dates}>
                {`${formatDate(book.startDate)} ~ ${formatDate(book.endDate)}`}
              </span>
              <span className={styles.accountBook_list_amount}>
                {calculateTotalAmountInKRW(book)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountBookListPage;
