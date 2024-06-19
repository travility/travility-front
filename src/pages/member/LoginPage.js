import styles from '../../styles/member/LoginPage.module.css';


const onNaverLogin = () => {
      window.location.href = "http://localhost:8080/oauth2/authorization/naver";
    };

const onGoogleLogin = () => {
      window.location.href = "http://localhost:8080/oauth2/authorization/google";
      };


const LoginPage = () => {
  
  
  
  
  
  
  
  
  
  
  
  return (
    <div>
          <h3> 로그인 </h3>
          <ul>
                <li>
                      아이디
                </li>
                <li>
                      <input></input>   
                </li>
                <li>
                      비밀번호
                </li>
                <li>
                      <input></input>   
                </li>
                <div>
                      <button className={styles.login_btn}>
                            로그인
                      </button>
                </div>
                <div>
                      SNS LOGIN
                </div>
                <div>
                <button className={styles.login_g} onClick={onGoogleLogin} >
                <img src="/images/member/google.png" alt="구글 로그인" />
                </button>
                <button className={styles.login_k} >
                <img src="/images/member/kakao.png" alt="카카오 로그인" />
                </button>
                <button className={styles.login_n} onClick={onNaverLogin} >
                <img src="/images/member/naver.png" alt="네이버 로그인" />
                </button>
                </div>
                <div>
                      <b6>계정이 없으신가요? </b6>
                      <b4> 회원가입</b4>    
                </div>

          </ul>

    </div>
    );


};

export default LoginPage;
