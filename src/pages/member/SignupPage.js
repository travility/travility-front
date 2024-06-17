import styles from './styles/SignupPage.module.css';

const SignupPage = () => {
  return (
    <div className={styles.signup_container}>
      <div>
        <p>회원가입</p>
        <p>반가워요! 가입을 위해 몇 가지만 확인할게요</p>
      </div>
      <div>
        <form>
          <div>아이디</div>
          <input type="text" placeholder="아이디를 입력해주세요"></input>
          <div>비밀번호</div>
          <input
            type="password"
            placeholder="영문자, 숫자, 특수문자를 포함한 8자 이상"
          ></input>
          <div>비밀번호 확인</div>
          <input
            type="password"
            placeholder="비밀번호를 재입력해주세요"
          ></input>
          <div>이메일</div>
          <input type="email" placeholder="이메일을 입력해주세요"></input>
          <div>생년월일</div>
          <input type="date" placeholder="yyyy-mm-dd"></input>
        </form>
        <button type="submit">회원가입</button>
      </div>
    </div>
  );
};

export default SignupPage;
