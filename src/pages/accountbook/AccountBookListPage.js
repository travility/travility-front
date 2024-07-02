import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAccountBooks,
  calculateTotalAmountInKRW,
  formatDate,
  deleteAccountBook,
} from "../../api/accountbookApi";
import styles from "../../styles/accountbook/AccountBookListPage.module.css";

const AccountBookListPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [accountBooks, setAccountBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccountBooks = async () => {
      try {
        const data = await getAccountBooks();
        console.log(data);
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

  const handleAccountBookClick = (accountBook) => {
    if (!isDeleteMode) {
      navigate(`/accountbook/detail/${accountBook.id}`);
    } else {
      handleSelectBook(accountBook);
    }
  };

  const handleDeleteBooks = async () => {
    try {
      await Promise.all(selectedBooks.map((id) => deleteAccountBook(id)));
      setAccountBooks((prevBooks) =>
        prevBooks.filter((book) => !selectedBooks.includes(book.id))
      );
      setIsDeleteMode(false);
      setSelectedBooks([]);
    } catch (error) {
      console.error("Failed to delete account books:", error);
    }
  };

  const handleSelectBook = (accountBook) => {
    setSelectedBooks((prevSelectedBooks) =>
      prevSelectedBooks.includes(accountBook.id)
        ? prevSelectedBooks.filter((id) => id !== accountBook.id)
        : [...prevSelectedBooks, accountBook.id]
    );
  };

  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
    setSelectedBooks([]);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={styles.accountBook_list_page}>
      <div className={styles.action_buttons}>
        <button className={styles.delete_button} onClick={toggleDeleteMode}>
          {isDeleteMode ? "취소" : "삭제"}
        </button>
        {isDeleteMode && (
          <button
            className={styles.confirm_delete_button}
            onClick={handleDeleteBooks}
            disabled={selectedBooks.length === 0}
          >
            선택 삭제
          </button>
        )}
      </div>
      <div className={styles.accountBook_list_grid_container}>
        {accountBooks.map((accountBook) => (
          <div
            key={accountBook.id}
            className={`${styles.accountBook_list_grid_item} ${
              selectedBooks.includes(accountBook.id) ? styles.selected : ""
            }`}
            style={{
              backgroundImage: `url(
            http://localhost:8080/images/${accountBook.imgName}
          )`,
            }}
            onClick={() => handleAccountBookClick(accountBook)}
          >
            {isDeleteMode && (
              <div
                className={styles.select_overlay}
                onClick={(event) => {
                  event.stopPropagation();
                  handleSelectBook(accountBook);
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedBooks.includes(accountBook.id)}
                  onChange={(event) => {
                    event.stopPropagation();
                    handleSelectBook(accountBook);
                  }}
                />
              </div>
            )}
            <div className={styles.accountBook_list_item_detail}>
              <div className={styles.accountBook_list_title_and_flag}>
                <span className={styles.accountBook_list_flag}>
                  <img src={accountBook.countryFlag} alt="국기" />
                </span>
                <span className={styles.accountBook_list_title}>
                  {accountBook.title}
                </span>
              </div>
              <span className={styles.accountBook_list_dates}>
                {`${formatDate(accountBook.startDate)} ~ ${formatDate(
                  accountBook.endDate
                )}`}
              </span>
              <span className={styles.accountBook_list_amount}>
                {calculateTotalAmountInKRW(accountBook)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountBookListPage;
