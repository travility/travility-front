import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMemberInfo, login } from "../../api/memberApi";
import { saveToken } from "../../util/tokenUtils";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Swal from "sweetalert2";
import { Button, Input, ErrorMessage } from "../../styles/StyledComponents";
import styles from "../../styles/member/LoginPage.module.css";

const onNaverLogin = () => {
  window.location.href = "http://localhost:8080/oauth2/authorization/naver";
};

const onGoogleLogin = () => {
  window.location.href = "http://localhost:8080/oauth2/authorization/google";
};

const onKakaoLogin = () => {
  window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
};

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [seePassword, setSeePassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  // 비밀번호 공개 여부 표시
  const seePasswordHandler = () => {
    setSeePassword(!seePassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!username) errors.username = "아이디를 입력하세요.";
    if (!password) errors.password = "비밀번호를 입력하세요.";

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const data = {
      username,
      password,
    };

    try {
      const response = await login(data);
      const token = response.headers.get("Authorization");
      saveToken(token);
      const memberInfo = await getMemberInfo();
      console.log(memberInfo);
      Swal.fire({
        title: "로그인 성공",
        icon: "success",
        confirmButtonColor: "var(--main-color)",
      }).then(() => {
        if (memberInfo.role === "ROLE_USER") {
          navigate("/main");
        } else {
          navigate("/admin/users");
        }
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "로그인 실패",
        text: "아이디와 비밀번호가 맞지 않습니다.",
        icon: "error",
        confirmButtonColor: "var(--main-color)",
      });
    }
  };

  return (
    <div className={styles.login_wrapper}>
      <div className={styles.login_container}>
        <div className={styles.login_header}>
          <h2>로그인</h2>
          <p>환영합니다! 로그인하여 서비스를 이용하세요.</p>
        </div>
        <div className={styles.login_form}>
          <form onSubmit={handleLogin}>
            <div className={styles.login_formGroup}>
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
            <div className={styles.login_formGroup}>
              <label htmlFor="password">비밀번호</label>
              <div className={styles.login_input_seepw_container}>
                <Input
                  type={seePassword ? "text" : "password"}
                  id="password"
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={handlePassword}
                  required
                />
                <button
                  type="button"
                  onClick={seePasswordHandler}
                  className={styles.toggle_pw_button}
                >
                  {seePassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                </button>
              </div>
              <div className="error_container">
                {formErrors.password && (
                  <ErrorMessage>{formErrors.password}</ErrorMessage>
                )}
              </div>
            </div>
            <div className={styles.login_button}>
              <Button type="submit">로그인</Button>
            </div>
          </form>
        </div>
        <p className={styles.login_social_txt}>SNS LOGIN</p>
        <div className={styles.login_social_buttons_container}>
          <button
            className={styles.login_social_button}
            onClick={onGoogleLogin}
          >
            <img src="/images/member/google.png" alt="구글 로그인" />
          </button>
          <button className={styles.login_social_button} onClick={onKakaoLogin}>
            <img src="/images/member/kakao.png" alt="카카오 로그인" />
          </button>
          <button className={styles.login_social_button} onClick={onNaverLogin}>
            <img src="/images/member/naver.png" alt="네이버 로그인" />
          </button>
        </div>
        <div className={styles.login_signup_container}>
          <span className={styles.login_signup_text}>계정이 없으신가요?</span>
          <button
            className={styles.login_signup_button}
            onClick={() => navigate("/signup")}
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
