import React, { useState } from "react";
import styles from "../../../styles/member/password/ForgotPasswordPage.module.css";
import {
  ErrorMessage,
  Input,
  Button,
} from "../../../styles/common/StyledComponents";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../../api/memberApi";
import Swal from "sweetalert2";
import {
  handleProblemSubject,
  handleSuccessSubjectNotReload,
} from "../../../util/swalUtils";

const ForgotPasswordPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  //임시 비밀번호 발급
  const handleIssueTemporaryPassword = (e) => {
    e.preventDefault();

    const errors = {};
    if (!username) errors.username = "아이디를 입력하세요.";
    if (!email) errors.password = "비밀번호를 입력하세요.";

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const data = {
      username: username,
      email: email,
    };

    forgotPassword(data)
      .then(() => {
        handleSuccessSubjectNotReload(
          "임시 비밀번호",
          "발급",
          navigate,
          "/forgotPassword"
        );
      })
      .catch((error) => {
        console.log(error);
        const errorMessage = error.response.data;
        if (errorMessage === "Member not found") {
          //미가입 회원
          Swal.fire({
            title: "회원이 아닙니다.",
            text: "해당 아이디를 찾을 수 없습니다.",
            icon: "error",
            confirmButtonColor: "var(--main-color)",
          }).then(() => {
            navigate("/signup");
          });
        } else if (errorMessage === "Social login user") {
          //소셜 로그인 회원
          Swal.fire({
            title: "소셜 로그인 회원",
            text: "소셜 로그인 사용자는 비밀번호를 찾을 수 없습니다.",
            icon: "error",
            confirmButtonColor: "var(--main-color)",
          }).then(() => {
            navigate("/forgotPassword");
          });
        } else if (errorMessage === "Invalid email") {
          //유효하지 않은 이메일
          Swal.fire({
            title: "잘못된 이메일",
            text: "해당 이메일을 찾을 수 없습니다.",
            icon: "error",
            confirmButtonColor: "var(--main-color)",
          });
        } else {
          handleProblemSubject("메일 전송");
        }
      });
  };

  return (
    <div className={styles.forgotPassword_wrapper}>
      <div className={styles.forgotPassword_container}>
        <div className={styles.forgotPassword_header}>
          <h2>비밀번호 찾기</h2>
          <p>아이디와 이메일을 입력해주세요</p>
        </div>
        <div className={styles.forgotPassword_form}>
          <form onSubmit={handleIssueTemporaryPassword}>
            <div className={styles.forgotPassword_formGroup}>
              <label htmlFor="username">아이디</label>
              <Input
                type="text"
                id="username"
                placeholder="아이디를 입력하세요"
                value={username}
                onChange={handleUsername}
                required
              />
              <div className="error_container">
                {formErrors.username && (
                  <ErrorMessage>{formErrors.username}</ErrorMessage>
                )}
              </div>
            </div>
            <div className={styles.forgotPassword_formGroup}>
              <label htmlFor="email">이메일</label>
              <Input
                type="email"
                id="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={handleEmail}
                required
              />
              <div className="error_container">
                {formErrors.email && (
                  <ErrorMessage>{formErrors.email}</ErrorMessage>
                )}
              </div>
            </div>
            <div className={styles.forgotPassword_button}>
              <Button type="submit">임시 비밀번호 발급</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
