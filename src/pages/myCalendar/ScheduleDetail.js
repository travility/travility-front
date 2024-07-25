import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Scrollbar } from "react-scrollbars-custom";
import { formatNumberWithCommas } from "../../util/calcUtils";
import styles from "../../styles/myCalendar/MyCalendar.module.css";
import { SERVER_URL } from "../../config/apiConfig";

const categoryImages = {
  TRANSPORTATION: "transportation.png",
  ACCOMMODATION: "accommodation.png",
  FOOD: "food.png",
  TOURISM: "tourism.png",
  SHOPPING: "shopping.png",
  OTHERS: "others.png",
};

const ScheduleDetail = ({
  accountbookId,
  countryName,
  imgName,
  expenses,
  date,
  totalExpense,
  exchangeRates,
  onClose,
}) => {
  const [filter, setFilter] = useState("all");
  const [filteredTotalExpense, setFilteredTotalExpense] =
    useState(totalExpense);
  const navigate = useNavigate();

  useEffect(() => {
    updateFilteredTotalExpense();
  }, [filter, expenses]);

  const updateFilteredTotalExpense = () => {
    const newFilteredTotalExpense = expenses.reduce((sum, expense) => {
      const amountInKRW =
        expense.amount * (exchangeRates?.[expense.curUnit] || 1);
      if (filter === "all") return sum + amountInKRW;
      if (filter === "shared" && expense.isShared) return sum + amountInKRW;
      if (filter === "personal" && !expense.isShared) return sum + amountInKRW;
      return sum;
    }, 0);
    setFilteredTotalExpense(newFilteredTotalExpense);
  };

  const categorizedExpenses = expenses.reduce((acc, expense) => {
    const category = expense.category || "OTHERS";
    if (!acc[category]) acc[category] = [];
    acc[category].push(expense);
    return acc;
  }, {});

  const filteredExpenses = Object.keys(categorizedExpenses).reduce(
    (acc, category) => {
      const filtered = categorizedExpenses[category].filter((expense) => {
        if (filter === "all") return true;
        if (filter === "shared" && expense.isShared) return true;
        if (filter === "personal" && !expense.isShared) return true;
        return false;
      });

      if (filtered.length > 0) {
        acc[category] = filtered;
      }

      return acc;
    },
    {}
  );

  const handleGoToAccountBookDetail = () => {
    navigate(`/accountbook/detail/${accountbookId}`);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className={styles.schedule_detail_container}>
      <div
        className={styles.schedule_detail_content}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.schedule_detail_header_container}>
          <h5>
            <img src="/images/gpiIcon.png" className={styles.icon} />
            {countryName}
          </h5>
          <p>{date}</p>
        </div>
        <div
          className={styles.schedule_detail_modalImage}
          style={{
            backgroundImage: `url(${
              imgName
                ? `${SERVER_URL}/images/${imgName}`
                : "/images/dashboard/default_image.png"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className={styles.schedule_detail_filter_buttons_container}>
          <button
            className={filter === "all" ? styles.selectedButton : ""}
            onClick={() => {
              setFilter("all");
              setFilteredTotalExpense(totalExpense);
            }}
          >
            모두보기
          </button>
          <button
            className={filter === "shared" ? styles.selectedButton : ""}
            onClick={() => setFilter("shared")}
          >
            공동
          </button>
          <button
            className={filter === "personal" ? styles.selectedButton : ""}
            onClick={() => setFilter("personal")}
          >
            개인
          </button>
          <button
            onClick={handleGoToAccountBookDetail}
            className={styles.go_accountbook_detail_btn}
          >
            가계부 보기
          </button>
        </div>
        <div className={styles.accountbook_detail}>
          <h5>지출내역</h5>
          <Scrollbar
            style={{ height: "200px" }}
            className={styles.customScrollbar}
          >
            <div className={styles.expenseList}>
              {Object.keys(filteredExpenses).length === 0 ? (
                <p className={styles.noExpenses}>지출 내역이 없습니다.</p>
              ) : (
                Object.keys(filteredExpenses).map((category) => (
                  <div key={category}>
                    {filteredExpenses[category].map((expense, index) => {
                      return (
                        <div key={index} className={styles.expenseItem}>
                          <img
                            className={styles.categoryImg}
                            src={`/images/accountbook/category/${categoryImages[category]}`}
                            alt={expense.category}
                          />
                          <div className={styles.expense_info}>
                            <div className={styles.expense_title_container}>
                              <span className={styles.expense_title}>
                                {truncateText(expense.title, 4)}
                              </span>
                            </div>
                            <div className={styles.expense_ca_container}>
                              <span className={styles.expense_curunit}>
                                {expense.curUnit}
                              </span>
                              <span className={styles.expense_amount}>
                                {expense.amount.toLocaleString()}
                              </span>
                            </div>
                            {expense.imgName ? (
                              <img
                                className={styles.expenseImg}
                                src={`http://localhost:8080/images/${expense.imgName}`}
                                alt="지출 이미지"
                              />
                            ) : (
                              <img
                                className={styles.expenseImg}
                                src="/images/dashboard/default_image.png"
                                alt="기본 이미지"
                              />
                            )}
                            <span className={styles.type}>
                              {expense.isShared ? "공동경비" : "개인경비"}
                            </span>
                          </div>{" "}
                          {/* info끝 */}
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </Scrollbar>
          <div className={styles.total_cost_container}>
            <p>총 사용 비용</p>
            <p className={styles.total_cost_amount}>
              ₩ {formatNumberWithCommas(filteredTotalExpense.toFixed(0))}
            </p>
          </div>
        </div>
        <div className={styles.schedule_detail_Buttons_container}>
          <button className={styles.closeButton} onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetail;
