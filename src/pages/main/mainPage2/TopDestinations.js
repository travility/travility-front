import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import styles from "../../../styles/main/mainPage2/MainPage.module.css";
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

//인기 여행지 top5
const topDestinations = ["Japan", "Vietnam", "Taiwan", "USA", "Philippines"];


const TopDestinations = () => {

  const getImagePath = (destination) => {
    const jpgPath = `/images/destinations/${destination}.jpg`;
    const pngPath = `/images/destinations/${destination}.png`;

    return [jpgPath, pngPath];
  };
  

  return (
    <div className={styles.swiperContainer}>
      <div className={styles.topDestinationsTitle}>
        실시간 인기 여행지 <span className={styles.topDestinationsHighlight}>Top 5</span>
      </div>
      <Swiper
        spaceBetween={50}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        loop={true}
        modules={[Autoplay, Pagination, Navigation]}
        className={styles.mySwiper}
      >
        {topDestinations.map((destination, index) => {
          const [jpgPath, pngPath] = getImagePath(destination);
          return (
            <SwiperSlide 
              key={index} 
              className={styles.swiperSlide}
              style={{
                backgroundImage: `url(${jpgPath}), url(${pngPath})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              onError={(e) => e.target.style.backgroundImage = 'url(/images/default.png)'}
            >
              <div className={styles.slideText}>{destination}</div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default TopDestinations;
