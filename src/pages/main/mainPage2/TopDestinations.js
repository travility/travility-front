import React from "react";
import styles from "../../../styles/main/mainPage2/MainPage.module.css";

const topDestinations = ["일본", "스페인", "프랑스", "이탈리아", "태국"];

const TopDestinations = () => {
  return (
    <div className={styles.topDestinationsContainer}>
      <h3>실시간 인기 여행지 Top 5</h3>
      <ol>
        {topDestinations.map((destination, index) => (
          <li key={index}>{destination}</li>
        ))}
      </ol>
    </div>
  );
};

export default TopDestinations;
