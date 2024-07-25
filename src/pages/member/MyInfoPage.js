import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/member/MyInfo.module.css";
import Swal from "sweetalert2";
import { MemberInfoContext } from "../../App";
import { confirmPassword, deleteMember } from "../../api/memberApi";
import {
  handleProblemSubject,
  handleSuccessLogout,
} from "../../util/swalUtils";
import { Input } from "../../styles/common/StyledComponents";

const MyInfoPage = () => {
  const { memberInfo } = useContext(MemberInfoContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (memberInfo) {
      setLoading(false);
      console.log(memberInfo);
    }
  }, [memberInfo]);

  //회원 탈퇴
  const handleDeleteMember = async () => {
    const { value: text } = await Swal.fire({
      icon: "warning",
      text: "회원탈퇴 시 모든 정보가 삭제되며, 복구되지 않습니다. 정말 탈퇴하시겠습니까?",
      inputLabel: '회원 탈퇴를 위해 "탈퇴합니다"를 입력해주세요',
      input: "text",
      inputPlaceholder: "탈퇴합니다",
      showCancelButton: true,
      confirmButtonText: "탈퇴하기",
      confirmButtonColor: "#2a52be",
      cancelButtonText: "취소",
      preConfirm: (inputValue) => {
        if (inputValue !== "탈퇴합니다") {
          Swal.showValidationMessage('정확히 "탈퇴합니다"를 입력해주세요.');
        }
      },
    });

    if (text === "탈퇴합니다") {
      deleteMember()
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "탈퇴 성공",
            text: "회원 탈퇴가 성공적으로 되었습니다",
            confirmButtonText: "확인",
            confirmButtonColor: "#2a52be",
          }).then((res) => {
            if (res.isConfirmed) {
              handleSuccessLogout(navigate);
            }
          });
        })
        .catch((error) => {
          console.log(error);
          handleProblemSubject("회원 탈퇴");
        });
    }
  };

  //기존 비밀번호 확인
  const handleConfirmPassword = async () => {
    if (memberInfo.socialType === null) {
      const { value: password } = await Swal.fire({
        icon: "warning",
        title: "비밀번호 확인",
        text: "현재 비밀번호 입력하세요",
        input: "password",
        showCancelButton: true,
        confirmButtonText: "확인",
        confirmButtonColor: "#2a52be",
        cancelButtonText: "취소",
        preConfirm: (inputValue) => {
          if (!inputValue) {
            Swal.showValidationMessage("비밀번호를 입력하세요");
          }
        },
      });

      if (password) {
        try {
          const response = await confirmPassword(password);
          if (response === true) {
            navigate("/dashboard/myinfo/update-password");
          } else {
            Swal.fire({
              icon: "error",
              text: "비밀번호가 맞지 않습니다.",
            });
          }
        } catch (error) {
          console.log(error);
          handleProblemSubject("비밀번호 확인");
        }
      }
    } else {
      Swal.fire({
        title: "소셜 로그인 회원",
        text: "소셜 로그인 사용자는 비밀번호를 변경할 수 없습니다.",
        icon: "error",
        confirmButtonColor: "var(--main-color)",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="wrapper">
      <div className={styles.myinfo_container}>
        <div className={styles.myinfo_contents}>
          <div className={styles.myinfo_formGroup}>
            <label>닉네임</label>
            <Input
              type="text"
              value={memberInfo.name}
              placeholder={memberInfo.name}
              readOnly
            />
          </div>
          <div className={styles.myinfo_formGroup}>
            <label>아이디</label>
            <Input
              type="text"
              value={memberInfo.username}
              placeholder={memberInfo.name}
              readOnly
            />
          </div>
          <div className={styles.myinfo_formGroup}>
            <label>이메일</label>
            <Input
              type="text"
              value={memberInfo.email}
              placeholder={memberInfo.name}
              readOnly
            />
          </div>
        </div>
        <button
          className={styles.changePassword}
          onClick={handleConfirmPassword}
        >
          비밀번호 변경
        </button>
        <button className={styles.deleteMember} onClick={handleDeleteMember}>
          회원탈퇴
        </button>
      </div>
    </div>
  );
};

export default MyInfoPage;
