import React from "react";
import { useLocation } from "react-router-dom";
import {
  commaFormatDate,
  calculateTotalExpenseInKRW,
  formatNumberWithCommas,
} from "../../util/calcUtils";
import styles from "../../styles/common/TripInfo.module.css";
import { SERVER_URL } from "../../config/apiConfig";

const TripInfo = ({
  accountBook,
  onClick,
  isSettlement,
  isSelected,
  onSelect,
  isDeleteMode,
}) => {
  const location = useLocation();
  const isDetailPage = location.pathname.startsWith(`/accountbook/detail`);

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div
      key={accountBook.id}
      className={`${styles.tripInfo} ${isSelected ? styles.selected : ""}`}
      style={{
        backgroundImage: `url(${
          accountBook.imgName
            ? `${SERVER_URL}/images/${accountBook.imgName}`
            : "/images/dashboard/default_image.png"
        })`,
      }}
      onClick={() => onClick(accountBook)}
    >
      {isDeleteMode && (
        <div
          className={styles.select_overlay}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(event) => {
              event.stopPropagation();
              onSelect(accountBook);
            }}
          />
        </div>
      )}
      <div className={styles.accountBook_list_item_detail}>
        <div className={styles.accountBook_list_title_and_flag}>
          <span className={styles.accountBook_list_flag}>
            <img src={accountBook.countryFlag} alt="국기" />
          </span>
          <span
            className={styles.accountBook_list_title}
            title={isSettlement ? accountBook.countryName : accountBook.title}
          >
            {isSettlement
              ? accountBook.countryName
              : truncateText(accountBook.title, 8)}
          </span>
        </div>
        <span className={styles.accountBook_list_dates}>
          {`${commaFormatDate(accountBook.startDate)} ~ ${commaFormatDate(
            accountBook.endDate
          )}`}
        </span>
        {isDetailPage ? (
          <span className={styles.accountBook_list_edit}>
            <img src="/images/accountbook/add_box.png" alt="+" />
            {accountBook.imgName ? "수정하기" : "사진을 추가하세요."}
          </span>
        ) : (
          <span className={styles.accountBook_list_amount}>
            <label>KRW</label>
            {formatNumberWithCommas(
              calculateTotalExpenseInKRW(
                accountBook.expenses,
                accountBook.budgets
              )
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default TripInfo;
