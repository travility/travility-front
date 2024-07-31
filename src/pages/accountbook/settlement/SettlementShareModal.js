import React from 'react';
import {
  ModalOverlay,
  Modal,
  ModalHeader,
  CloseButton,
} from '../../../styles/common/StyledComponents';
import styles from '../../../styles/accountbook/settlement/SettlementShare.module.css';
import { useLocation } from 'react-router-dom';
import CopyToClipboard from 'react-copy-to-clipboard';

const SettlementShare = ({ isOpen, onClose, countryName }) => {
  const location = useLocation();
  const pathName = location.pathname.substring(1);

  //카카오톡으로 공유하기
  const handleKakaoShare = () => {
    if (window.Kakao) {
      const kakao = window.Kakao;

      kakao.Share.sendCustom({
        templateId: 109810,
        templateArgs: {
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
              <CopyToClipboard
                text={window.location.href}
                onCopy={() => alert('복사 완료')}
              >
                <div className={styles.share_option}>
                  <img
                    className={styles.share_icon}
                    src="/images/accountbook/settlement/link.png"
                    alt="링크로 공유하기"
                  />
                  링크로 공유하기
                </div>
              </CopyToClipboard>
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

export default SettlementShare;
