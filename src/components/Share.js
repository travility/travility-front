import React from 'react';
import { ModalOverlay, Modal, ModalHeader } from '../styles/StyledComponents';
import { CloseButton } from 'react-bootstrap';
import styles from '../styles/components/Share.module.css';
import { useLocation } from 'react-router-dom';

const Share = ({ isOpen, onClose, imgName, countryName }) => {
  const location = useLocation();
  const pathName = location.pathname.substring(1);

  //링크 클립보드 복사
  const handleCopyClipBoard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('복사 완료');
    } catch (error) {
      console.log(error);
    }
  };

  //카카오톡으로 공유하기
  const handleKakaoShare = () => {
    if (window.Kakao) {
      const kakao = window.Kakao;

      kakao.Share.sendCustom({
        templateId: 109810,
        templateArgs: {
          //imgName: imgName,
          countryName: countryName,
          pathName: pathName,
        },
      });
    }
  };

  return (
    <>
      {isOpen && (
        <ModalOverlay>
          <Modal>
            <ModalHeader>
              <div className={styles.share_title}>공유하기</div>
              <CloseButton onClick={onClose}>&times;</CloseButton>
            </ModalHeader>
            <div className={styles.share_content}>
              <div
                className={styles.share_option}
                onClick={() => handleCopyClipBoard(`${window.location.href}`)}
              >
                <img
                  className={styles.share_icon}
                  src="/images/account/link.png"
                  alt="링크로 공유하기"
                />
                링크로 공유하기
              </div>
              <div className={styles.share_option} onClick={handleKakaoShare}>
                <img
                  className={styles.share_icon}
                  src="/images/member/kakao.png"
                  alt="카카오톡으로 공유하기"
                />
                카카오톡으로 공유하기
              </div>
            </div>
          </Modal>
        </ModalOverlay>
      )}
    </>
  );
};

export default Share;
