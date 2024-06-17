import { useState } from 'react';
import { signup, checkUsername } from '../../api/memberApi';
import styles from '../../styles/member/SignupPage.module.css';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [confirmUsername, setConfirmUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birth, setBirth] = useState('');

  //에러관리
  const [errorUsername, setErrorUsername] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [errorConfirmPassword, setErrorConfirmPassword] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorBirth, setErrorBirth] = useState('');

  //아이디 유효성 확인
  const vaildateUsername = (username) => {
    const regex = /^[a-z0-9]{8,20}$/; //영소문자, 숫자 8~20자 이하
    return regex.test(username);
  };

  //아이디 에러 표시 여부
  const handleUsername = (e) => {
    setUsername(e.target.value);
    const isValid = vaildateUsername(e.target.value);
    if (!isValid) {
      //만족하지 않으면
      setErrorUsername('아이디는 영소문자, 숫자 8~20자로 입력하세요.');
    } else {
      setErrorUsername('');
    }
  };

  //아이디 중복 확인
  const duplicateUsername = (e) => {
    e.preventDefault(); //기본 폼 제출 동작 막기
    checkUsername(username)
      .then((data) => {
        if (data.duplicate) {
          //중복인 경우
          setConfirmUsername('중복 아이디입니다');
        } else {
          setConfirmUsername('사용 가능합니다');
        }
      })
      .catch((error) => console.log(error));
  };

  //비밀번호 유효성 검사
  const vaildatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-z0-9!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  //비밀번호 에러 표시 여부
  const handlePassword = (e) => {
    setPassword(e.target.value);
    const isValid = vaildatePassword(e.target.value);
    if (!isValid) {
      //만족하지 않으면
      setErrorPassword(
        '비밀번호는 영소문자, 숫자, 특수문자 8자 이상 입력하세요'
      );
    } else {
      setErrorPassword('');
    }
  };

  //비밀번호 확인 에러 표시 여부
  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value !== password) {
      setErrorConfirmPassword('비밀번호가 맞지 않습니다.');
    } else {
      setErrorConfirmPassword('');
    }
  };

  //이메일 유효성 검사
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  //이메일 에러 표시 여부
  const handleEmail = (e) => {
    setEmail(e.target.value);
    const isValid = validateEmail(e.target.value);
    if (!isValid) {
      setErrorEmail('이메일 형식이 올바르지 않습니다');
    } else {
      setErrorEmail('');
    }
  };

  //생일 유효성 검사
  const validateBirth = (birth) => {
    const currnetDate = new Date();
    const inputDate = new Date(birth);
    return inputDate <= currnetDate; //생년월일이 현재 날짜보다 이하여야 한다.
  };

  const handleBirth = (e) => {
    setBirth(e.target.value);
    const isValid = validateBirth(e.target.value);
    if (!isValid) {
      setErrorBirth('생일이 올바르지 않습니다');
    } else {
      setErrorBirth('');
    }
  };

  //회원 가입
  const handleSignup = () => {
    if (
      vaildateUsername(username) &&
      vaildatePassword(password) &&
      validateEmail(email) &&
      validateBirth(birth)
    ) {
      //유효성 검사를 모두 통과했을 경우
      const member = {
        username: username,
        password: password,
        email: email,
        birth: birth,
        createdDate: new Date(),
      };
      signup(member)
        .then(() => {
          console.log(member);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div className={styles.signup_container}>
      <div>
        <p>회원가입</p>
        <p>반가워요! 가입을 위해 몇 가지만 확인할게요</p>
      </div>
      <div>
        <form>
          <div>아이디</div>
          <input
            type="text"
            placeholder="영소문자, 숫자를 포함한 8~20자"
            value={username}
            onChange={handleUsername}
          ></input>
          <div>{errorUsername}</div>
          <button onClick={duplicateUsername}>중복 확인</button>
          <div>{confirmUsername}</div>
          <div>비밀번호</div>
          <input
            type="password"
            placeholder="영문자, 숫자, 특수문자를 포함한 8자 이상"
            value={password}
            onChange={handlePassword}
          ></input>
          <div>{errorPassword}</div>
          <div>비밀번호 확인</div>
          <input
            type="password"
            placeholder="비밀번호를 재입력해주세요"
            value={confirmPassword}
            onChange={handleConfirmPassword}
          ></input>
          <div>{errorConfirmPassword}</div>
          <div>이메일</div>
          <input
            type="email"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={handleEmail}
          ></input>
          <div>{errorEmail}</div>
          <div>생년월일</div>
          <input
            type="date"
            placeholder="yyyy-mm-dd"
            value={birth}
            onChange={handleBirth}
          ></input>
          <div>{errorBirth}</div>
        </form>
        <button type="submit" onClick={handleSignup}>
          회원가입
        </button>
      </div>
    </div>
  );
};

export default SignupPage;
