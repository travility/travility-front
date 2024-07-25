import React, { useState } from "react";
import {
  Button,
  CloseButton,
  Input,
  Modal,
  ModalHeader,
  ModalOverlay,
} from "../../../styles/common/StyledComponents";
import styles from "../../../styles/accountbook/settlement/ExportAccountBook.module.css";
import { exportAccountBook } from "../../../api/accountbookApi";
import { handleProblemSubject } from "../../../util/swalUtils";

const ExportAccountBook = ({ isOpen, onClose, id, countryName, title }) => {
  const [krw, setKrw] = useState(false);

  const handleKRW = (e) => {
    setKrw(e.target.value);
  };

  //가계부 엑셀화
  const handleExport = async () => {
    try {
      const response = await exportAccountBook(id, krw);

      if (response instanceof Blob) {
        //응답 데이터가 blob인지 확인(바이너리 데이터 타입)
        const url = window.URL.createObjectURL(response); //바이너리 객체 가리키는 임시 url
        const filename = countryName + "_" + title + "_" + "여행 가계부.xlsx";
        downloadFile(url, filename);

        window.URL.revokeObjectURL(url); //url 객체 제거
      } else {
        // 만약 Blob이 아닌 다른 형태로 반환된 경우, 예외 처리
        console.error("Response data is not a Blob");
        handleProblemSubject("내보내기");
      }
    } catch (error) {
      console.log(error);
      handleProblemSubject("내보내기");
    }
  };

  //파일 다운로드
  const downloadFile = (url, filename) => {
    const a = document.createElement("a"); //다운로드 링크 a태그 생성
    a.href = url;
    a.download = filename;

    document.body.appendChild(a); //a태그 dom에 삽입해야 다운로드 가능
    a.click(); //호출
    a.remove(); //링크 제거
  };

  return (
    <>
      {isOpen && (
        <ModalOverlay>
          <Modal>
            <ModalHeader>
              <div className={styles.exportAccountBook_title}>내보내기</div>
              <CloseButton onClick={onClose}>&times;</CloseButton>
            </ModalHeader>
            <div className={styles.exportAccountBook_content}>
              <div className={styles.description}>
                <p className={styles.description_item}>
                  지출 목록을 어떻게 내보낼까요?
                </p>
                <p className={styles.description_item}>
                  모든 값은 가중 평균 환율을 통해 반올림하여 계산합니다.
                </p>
                <p className={styles.description_item}>
                  합계는 항상 원화로 계산합니다.
                </p>
              </div>
              <div className={styles.exportOption_container}>
                <div className={styles.exportOption}>
                  <label>그대로 내보내기</label>
                  <Input
                    type="radio"
                    name="export"
                    value={false}
                    className={styles.radio}
                    checked
                    onChange={handleKRW}
                  ></Input>
                </div>
                <div className={styles.exportOption}>
                  <label>원화로 내보내기</label>
                  <Input
                    type="radio"
                    name="export"
                    value={true}
                    className={styles.radio}
                    onChange={handleKRW}
                  ></Input>
                </div>
              </div>
            </div>
            <div className={styles.exportAccountBook_button}>
              <Button onClick={handleExport}>다운로드</Button>
            </div>
          </Modal>
        </ModalOverlay>
      )}
    </>
  );
};

export default ExportAccountBook;
