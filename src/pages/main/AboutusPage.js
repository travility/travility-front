import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MemberInfoContext } from '../../App.js';
import { motion, useAnimation } from 'framer-motion';
import { useTheme } from '../../styles/Theme';
import styles from '../../styles/main/AboutusPage.module.css';
import Header from '../../components/header/Header.js';

const AboutUsPage = () => {
  const { memberInfo } = useContext(MemberInfoContext);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section5Ref = useRef(null);
  const controls = useAnimation();
  const [showCombined, setShowCombined] = useState(false);
  const [section2InView, setSection2InView] = useState(false);

  const handleButtonClick = () => {
    navigate(memberInfo ? '/main' : '/login');
  };

  const travelVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: { x: '0%', opacity: 1 },
    combined: { x: '0%', opacity: 0 },
  };

  const facilityVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: '0%', opacity: 1 },
    combined: { x: '0%', opacity: 0 },
  };

  const combinedVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0 },
    combined: { opacity: 1 },
  };

  useEffect(() => {
    const section1 = section1Ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            controls.start('visible');
            setTimeout(() => {
              controls.start('combined');
              setShowCombined(true);
            }, 800);
          }
        });
      },
      { threshold: 0.5 } // section의 50%가 뷰포트에 보이면 트리거
    );

    observer.observe(section1);

    return () => {
      observer.unobserve(section1);
    };
  }, [controls]);

  useEffect(() => {
    const section = section5Ref.current;
    const icons = section.querySelectorAll(`.${styles.icons} img`);
    let intervalId;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            icons.forEach((icon, index) => {
              setTimeout(() => {
                icon.classList.add(styles['icon-visible']);
              }, index * 500);
            });
            intervalId = setInterval(() => {
              icons.forEach((icon, index) => {
                setTimeout(() => {
                  icon.classList.add(styles['icon-visible']);
                }, index * 500);
              });
              setTimeout(() => {
                icons.forEach((icon) =>
                  icon.classList.remove(styles['icon-visible'])
                );
              }, icons.length * 500 + 500);
            }, icons.length * 500 + 700);
          } else {
            clearInterval(intervalId);
            icons.forEach((icon) =>
              icon.classList.remove(styles['icon-visible'])
            );
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(section);

    return () => {
      clearInterval(intervalId);
      observer.unobserve(section);
    };
  }, []);

  useEffect(() => {
    const section2 = section2Ref.current;
    const handleScroll = () => {
      if (section2InView) {
        const { top, height } = section2.getBoundingClientRect();
        const scrollProgress = Math.max(0, Math.min(1, 1 - (top / height) * 2));
        section2.style.setProperty('--scroll-progress', scrollProgress);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSection2InView(true);
            window.addEventListener('scroll', handleScroll);
          } else {
            setSection2InView(false);
            window.removeEventListener('scroll', handleScroll);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(section2);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.unobserve(section2);
    };
  }, [section2InView]);

  const getImageSrc = (imageName) => {
    return theme === 'dark'
      ? `/images/main/${imageName}_wt.png`
      : `/images/main/${imageName}.png`;
  };

  const goGithub = () => {
    window.open(
      'https://github.com/The-Forest-of-Labor-Development/travility-back_',
      '_blank'
    );
  };

  const goFigma = () => {
    window.open(
      'https://www.figma.com/design/tEJo1b5V0vTel2IvEKSxwx/Travility?m=auto&t=0RiTjBr3yqY8bVFd-6',
      '_blank'
    );
  };

  const handleCopyClipBoard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('복사 완료');
    } catch (error) {
      console.log(error);
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.5 } },
  };

  const headerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
    exit: { opacity: 0, transition: { duration: 1 } },
  };

  return (
    <div className={styles.aboutus_container}>
      <motion.section
        className={styles.header_section}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={headerVariants}
      >
        <Header className={styles.header} />
        <div className={styles.header_text}>
          <motion.h2 variants={headerVariants}>
            지출 관리를 더욱 편리하게, <br />
            당신의 여행을 더 완벽하게,
          </motion.h2>
          <button className={styles.login_button} onClick={handleButtonClick}>
            <p>{memberInfo ? 'Main' : 'Login'}</p>
          </button>
        </div>
      </motion.section>

      <motion.section
        ref={section1Ref}
        className={styles.section1}
        initial="hidden"
        animate={controls}
        variants={sectionVariants}
      >
        <div className={styles.travility_container}>
          <motion.h1
            className={`${styles.travel} ${styles.animate}`}
            initial="hidden"
            animate={controls}
            variants={travelVariants}
            transition={{ duration: 1.5 }}
          >
            Travel
          </motion.h1>
          <motion.h1
            className={`${styles.facility} ${styles.animate}`}
            initial="hidden"
            animate={controls}
            variants={facilityVariants}
            transition={{ duration: 1.5 }}
          >
            Facility
          </motion.h1>
          <motion.h1
            className={`${styles.combined} ${showCombined ? styles.show : ''}`}
            initial="hidden"
            animate={showCombined ? 'combined' : 'hidden'}
            variants={combinedVariants}
            transition={{ duration: 1.5 }}
          >
            Travility
          </motion.h1>
        </div>
        <h4>
          <span>'Travel'</span>과 <span>'Facility'</span>의 합성어로, <br />
          여행을 더욱 편리하게 만들어준다는 의미입니다.
        </h4>
      </motion.section>

      <motion.section
        ref={section2Ref}
        className={`${styles.section} ${styles.section2}`}
        initial="hidden"
        whileInView="visible"
        exit="exit"
        variants={sectionVariants}
      >
        <motion.div className={styles.section2_content}>
          <motion.div
            className={styles.scrollImageWrapper}
            variants={sectionVariants}
          >
            <motion.h2
              className={styles.section2_title}
              variants={sectionVariants}
            >
              <div>
                누구나
                <br />
                간편하고 쉽게,
              </div>
              여행 가계부를
              <br />
              작성할 수 있어요
            </motion.h2>
            <motion.img
              src="/images/main/together.jpg"
              alt="section2"
              className={styles.scrollImage}
              variants={sectionVariants}
              transition={{ delay: 0.5 }}
            />
          </motion.div>
        </motion.div>
      </motion.section>

      <motion.section
        className={`${styles.section} ${styles.section3}`}
        initial="hidden"
        whileInView="visible"
        exit="exit"
        variants={sectionVariants}
      >
        <div className={styles.textImageSection}>
          <motion.div variants={sectionVariants}>
            <h2>
              나만의 여행
              <br />
              가계부 만들기
            </h2>
            <p>
              여행 일정, 인원, 여행지, 예산, 여행 이름을 설정하여
              <br />
              간편하게 가계부를 등록하세요.
              <br />
              계획부터 완벽하게 시작할 수 있습니다.
            </p>
          </motion.div>
          <motion.div
            className={styles['image-container']}
            variants={sectionVariants}
            transition={{ delay: 0.5 }}
          >
            <img src="https://via.placeholder.com/800x400" alt="section3" />
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className={styles.section}
        initial="hidden"
        whileInView="visible"
        exit="exit"
        variants={sectionVariants}
      >
        <motion.h2 variants={headerVariants}>
          여행 비용 , <br /> 손쉽게 관리하고 마음껏 즐기세요!
        </motion.h2>
        <div className={styles.featureBox}>
          <motion.div variants={sectionVariants}>
            <img src="/images/main/checkPlan.png" alt="feature1" />
            <h4>카테고리별 지출 추가</h4>
            식비, 교통, 관광, 숙박 등 다양한 카테고리로 분류하여 지출을
            체계적으로 관리하세요.
          </motion.div>
          <motion.div variants={sectionVariants}>
            <img src="/images/main/checkPlan.png" alt="feature2" />
            <h4>예산 및 지출 관리</h4>
            <p>
              실시간으로 남은 예산과 누적 지출을 확인할 수 있습니다.
              <br />
              예산 관리의 스트레스를 줄이고, 여행의 즐거움을 집중하세요.
            </p>
          </motion.div>
          <motion.div variants={sectionVariants}>
            <img src="/images/main/checkPlan.png" alt="feature3" />
            <h4>사진과 메모로 남기는 여행의 순간</h4>
            <p>
              지출과 함께 사진과 메모를 남겨 여행의 기억을 담아보세요. 언제
              어디서나 추억을 꺼내볼 수 있습니다.
            </p>
          </motion.div>
          <motion.div variants={sectionVariants}>
            <img src="/images/main/checkPlan.png" alt="feature4" />
            <h4>공동경비와 개인경비 분리</h4>
            <p>
              경비를 공동경비와 개인경비로 나누어 관리하세요. '정산하기' 기능을
              통해 카카오톡으로 여행 정보와 지출 내역을 공유하고 정산 요청을
              보낼 수 있습니다.
            </p>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className={styles.Section5}
        ref={section5Ref}
        initial="hidden"
        whileInView="visible"
        exit="exit"
        variants={headerVariants}
      >
        <motion.h1 variants={headerVariants}>
          한눈에 보는 <span>나의 여행기</span>
        </motion.h1>
        <div className={styles.icons}>
          <img src="/images/main/travelIcon/camera.png" alt="icon1" />
          <img src="/images/main/travelIcon/ticket.png" alt="icon2" />
          <img src="/images/main/travelIcon/carier.png" alt="icon3" />
          <img src="/images/main/travelIcon/hat.png" alt="icon4" />
          <img src="/images/main/travelIcon/airplane.png" alt="icon5" />
          <img src="/images/main/travelIcon/passport.png" alt="icon6" />
        </div>
      </motion.section>

      <motion.section
        className={styles.section}
        initial="hidden"
        whileInView="visible"
        exit="exit"
        variants={sectionVariants}
      >
        <div className={styles.textImageSection}>
          <motion.div
            className={styles['image-container']}
            variants={sectionVariants}
          >
            <img src="https://via.placeholder.com/800x400" alt="section5" />
          </motion.div>
          <motion.div variants={sectionVariants} transition={{ delay: 0.5 }}>
            <h2>마이리포트로 보는 소비 패턴</h2>
            <p>
              카테고리별, 일자별, 결제방법별 지출 통계를 다양한 그래프로
              확인하세요.
              <br />
              소비 패턴을 분석하여 효율적인 지출 관리를 할 수 있습니다.
            </p>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className={styles.section}
        initial="hidden"
        whileInView="visible"
        exit="exit"
        variants={sectionVariants}
      >
        <div className={styles.textImageSection}>
          <motion.div variants={sectionVariants}>
            <h2>여행 일정과 소비 내역을 한눈에</h2>
            <p>
              캘린더 기능을 통해 여행 일정을 쉽게 확인하고,
              <br />
              일자별 소비 내역을 직관적으로 관리하세요.
            </p>
          </motion.div>
          <motion.div
            className={styles['image-container']}
            variants={sectionVariants}
            transition={{ delay: 0.5 }}
          >
            <img src="https://via.placeholder.com/800x400" alt="section6" />
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className={styles.footerSection}
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/images/main/bgFooter.png)`,
        }}
        initial="hidden"
        whileInView="visible"
        exit="exit"
        variants={headerVariants}
      >
        <div className={styles.footerText_background} />
        <div className={styles.footerText}>
          <motion.h2 variants={headerVariants} transition={{ delay: 0.5 }}>
            이 모든것, <span>TRAVILITY</span>와 함께
            <br />
            지금 시작해보세요.
          </motion.h2>
          <div className={styles.buttonGroup}>
            <motion.button whileHover={{ scale: 1.05 }} onClick={goGithub}>
              <img src={getImageSrc('github')} alt="github" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} onClick={goFigma}>
              <img src="/images/main/figma.png" alt="figma" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => handleCopyClipBoard(`${window.location.href}`)}
            >
              <img src={getImageSrc('link')} alt="link" />
            </motion.button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutUsPage;
