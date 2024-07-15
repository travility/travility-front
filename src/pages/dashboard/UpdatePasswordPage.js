import React, { useState } from 'react';
import styles from '../../styles/dashboard/UpdatePasswordPage.module.css';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { updatePassword } from '../../api/memberApi';
import {
  handleFailureSubject,
  handleSuccessLogout,
  handleSuccessSubject,
} from '../../util/logoutUtils';
import Swal from 'sweetalert2';

const UpdatePasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [seePassword, setSeePassword] = useState(false);
  const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);

  //에러관리
  const [errorPassword, setErrorPassword] = useState('');
  const [errorConfirmPassword, setErrorConfirmPassword] = useState('');

  //비밀번호 공개 여부 표시
  const seePasswordHandler = () => {
    setSeePassword(!seePassword);
  };

  const seeConfirmPasswordHandler = () => {
    setSeeConfirmPassword(!seeConfirmPassword);
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

  //비밀번호 변경
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (vaildatePassword(password)) {
      //비밀번호 유효성 검사가 올바르면
      try {
        const response = await updatePassword(password);
        console.log(response);
        Swal.fire({
          title: '비밀번호 변경 성공',
          text: '비밀번호를 성공적으로 변경하였습니다. 재로그인하세요.',
          icon: 'success',
          confirmButtonColor: '#2a52be',
        }).then(() => {
          handleSuccessLogout(); //변경 후, 로그아웃
        });
      } catch (error) {
        console.log(error);
        if (error.response.data === 'Current password matches') {
          //새 비밀번호가 기존 비밀번호와 일치하면
          Swal.fire({
            title: '비밀번호 변경 실패',
            text: '기존 비밀번호와 일치합니다.',
            icon: 'error',
            confirmButtonColor: '#2a52be',
          });
        } else {
          Swal.fire({
            title: '비밀번호 변경 실패',
            text: '비밀번호 변경 중 문제가 발생했습니다.',
            icon: 'error',
            confirmButtonColor: '#4568DC',
          });
        }
      }
    } else {
      Swal.fire({
        title: '비밀번호 변경 실패',
        text: '양식이 올바르지 않습니다.',
        icon: 'error',
        confirmButtonColor: '#4568DC',
      });
    }
  };

  return (
    <div className={styles.updatePassword}>
      <div className={styles.updatePassword_content}>
        <div className={styles.updatePassword_container_header}>
          <p>비밀번호 변경</p>
          <p>변경할 비밀번호를 입력해주세요!</p>
        </div>
        <div className={styles.updatePassword_form}>
          <form onSubmit={handleUpdatePassword}>
            <div className={styles.updatePassword_title}>변경 비밀번호</div>
            <div className={styles.updatePassword_input_seepw_container}>
              <input
                type={seePassword ? 'text' : 'password'}
                placeholder="영문자, 숫자, 특수문자를 포함한 8자 이상"
                value={password}
                onChange={handlePassword}
                className={styles.updatePassword_input_pw}
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
            <div className={styles.updatePassword_error}>{errorPassword}</div>

            <div className={styles.updatePassword_title}>
              변경 비밀번호 확인
            </div>
            <div className={styles.updatePassword_input_seecheckpw_container}>
              <input
                type={seeConfirmPassword ? 'text' : 'password'}
                placeholder="비밀번호를 재입력해주세요"
                value={confirmPassword}
                onChange={handleConfirmPassword}
                required
                className={styles.updatePassword_input_checkpw}
              ></input>
              <button
                type="button"
                onClick={seeConfirmPasswordHandler}
                className={styles.toggle_checkpw_button}
              >
                {seeConfirmPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
              </button>
            </div>
            <div className={styles.updatePassword_error}>
              {errorConfirmPassword}
            </div>
            <div className={styles.updatePassword_actions}>
              <input
                type="submit"
                value="비밀번호 변경"
                className={styles.updatePassword_button}
              ></input>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;
