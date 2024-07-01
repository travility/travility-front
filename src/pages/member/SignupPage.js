import { useState } from 'react';
import { signup, checkUsername } from '../../api/memberApi';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/member/SignupPage.module.css';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');

  //에러관리
  const [errorUsername, setErrorUsername] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [errorConfirmPassword, setErrorConfirmPassword] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorNickname, setErrorNickname] = useState('');
  const [isUsernameDuplicate, setIsUsernameDuplicate] = useState(null);

  const [seePassword, setSeePassword] = useState(false);
  const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);

  const navigate = useNavigate();

  //비밀번호 공개 여부 표시
  const seePasswordHandler = () => {
    setSeePassword(!seePassword);
  };

  const seeConfirmPasswordHandler = () => {
    setSeeConfirmPassword(!seeConfirmPassword);
  };

  //아이디 유효성 확인
  const vaildateUsername = (username) => {
    const regex = /^(?=.*[a-z])(?=.*[0-9])[a-z0-9]{8,20}$/; //영소문자, 숫자 8~20자 이하
    return regex.test(username);
  };

  //아이디 에러 표시 여부
  const handleUsername = (e) => {
    setUsername(e.target.value);
    const isValid = vaildateUsername(e.target.value);
    if (!isValid) {
      //만족하지 않으면
      setErrorUsername('영소문자, 숫자 8~20자로 입력하세요.');
    } else {
      setErrorUsername('');
    }
    setIsUsernameDuplicate(null);
  };

  //아이디 중복 확인
  const handleDuplicateUsername = (e) => {
    e.preventDefault();
    checkUsername(username)
      .then((data) => {
        if (data) {
          //중복인 경우
          setErrorUsername('중복 아이디입니다.');
          setIsUsernameDuplicate(true);
        } else {
          //중복이 아닌 경우
          setErrorUsername('사용 가능합니다.');
          setIsUsernameDuplicate(false);
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
      setErrorPassword('영소문자, 숫자, 특수문자 8자 이상 입력하세요');
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

  const validateNickname = (nickname) => {
    const regex = /^[가-힣a-zA-Z0-9]*[가-힣a-zA-Z0-9]{2,20}$/;
    return regex.test(nickname);
  };

  const handleNickname = (e) => {
    setNickname(e.target.value);
    const isValid = validateNickname(e.target.value);
    if (!isValid) {
      setErrorNickname('닉네임 형식이 올바르지 않습니다');
    } else {
      setErrorNickname('');
    }
  };

  //회원 가입
  const handleSignup = (e) => {
    e.preventDefault();

    if (isUsernameDuplicate == null) {
      Swal.fire({
        title: '회원가입 실패',
        text: '아이디 중복 검사 하세요',
        icon: 'error',
        confirmButtonColor: '#2a52be',
      });
    } else if (isUsernameDuplicate) {
      Swal.fire({
        title: '회원가입 실패',
        text: '중복된 아이디입니다.',
        icon: 'error',
        confirmButtonColor: '#2a52be',
      });
    } else if (
      !isUsernameDuplicate &&
      vaildateUsername(username) &&
      vaildatePassword(password) &&
      validateEmail(email) &&
      validateNickname(nickname)
    ) {
      //유효성 검사를 모두 통과했을 경우
      const member = {
        username: username,
        password: password,
        email: email,
        name: nickname,
      };
      signup(member)
        .then((data) => {
          console.log(data);
          console.log(member);
          Swal.fire({
            title: '회원가입 성공',
            text: '로그인 페이지로 이동합니다.',
            icon: 'success',
            confirmButtonColor: '#2a52be',
          }).then(() => {
            navigate('/login');
          });
        })
        .catch((error) => {
          console.log(error);
          Swal.fire({
            title: '회원가입 실패',
            text: '회원가입 중 문제가 발생했습니다.',
            icon: 'error',
            confirmButtonColor: '#2a52be',
          });
        });
    } else {
      Swal.fire({
        title: '회원가입 실패',
        text: '양식이 올바르지 않습니다.',
        icon: 'error',
        confirmButtonColor: '#2a52be',
      });
    }
  };

  return (
    <div className={styles.signup}>
      <div className={styles.signup_content}>
        <div className={styles.signup_container_header}>
          <p>회원가입</p>
          <p>반가워요! 가입을 위해 몇 가지만 확인할게요.</p>
        </div>
        <div className={styles.signup_form}>
          <form onSubmit={handleSignup}>
            <div className={styles.signup_title}>아이디</div>
            <div className={styles.signup_id_container}>
              <input
                type="text"
                placeholder="영소문자, 숫자를 포함한 8~20자"
                value={username}
                onChange={handleUsername}
                required
                className={styles.signup_input_id}
              ></input>
              <button
                onClick={handleDuplicateUsername}
                className={styles.signup_idcheck_button}
              >
                중복 확인
              </button>
            </div>
            <div className={styles.signup_error}>{errorUsername}</div>

            <div className={styles.signup_title}>비밀번호</div>
            <div className={styles.signup_input_seepw_container}>
              <input
                type={seePassword ? 'text' : 'password'}
                placeholder="영문자, 숫자, 특수문자를 포함한 8자 이상"
                value={password}
                onChange={handlePassword}
                className={styles.signup_input_pw}
                required
              ></input>
              <button
                type="button"
                onClick={seePasswordHandler}
                className={styles.toggle_pw_button}
              >
                {seePassword ? <AiFillEye /> : <AiFillEyeInvisible />}
              </button>
            </div>
            <div className={styles.signup_error}>{errorPassword}</div>

            <div className={styles.signup_title}>비밀번호 확인</div>
            <div className={styles.signup_input_seecheckpw_container}>
              <input
                type={seeConfirmPassword ? 'text' : 'password'}
                placeholder="비밀번호를 재입력해주세요"
                value={confirmPassword}
                onChange={handleConfirmPassword}
                required
                className={styles.signup_input_checkpw}
              ></input>
              <button
                type="button"
                onClick={seeConfirmPasswordHandler}
                className={styles.toggle_checkpw_button}
              >
                {seeConfirmPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
              </button>
            </div>
            <div className={styles.signup_error}>{errorConfirmPassword}</div>

            <div className={styles.signup_title}>이메일</div>
            <input
              type="email"
              placeholder="이메일을 입력해주세요"
              value={email}
              onChange={handleEmail}
              required
              className={styles.signup_input_email}
            ></input>
            <div className={styles.signup_error}>{errorEmail}</div>
            <div className={styles.signup_title}>닉네임</div>
            <input
              type="text"
              placeholder="닉네임을 입력해주세요"
              value={nickname}
              onChange={handleNickname}
              required
              className={styles.signup_input_nickname}
            ></input>
            <div className={styles.signup_error}>{errorNickname}</div>
            <div className={styles.signup_actions}>
              <input
                type="submit"
                value="회원가입"
                className={styles.signup_button}
              ></input>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
