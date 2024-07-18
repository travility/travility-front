import React, { useState } from 'react';
import styles from '../../../styles/member/password/UpdatePasswordPage.module.css';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { updatePassword } from '../../../api/memberApi';
import {
  handleProblemSubject,
  handleSuccessLogout,
} from '../../../util/swalUtils';
import Swal from 'sweetalert2';
import { Button, ErrorMessage, Input } from '../../../styles/StyledComponents';

const UpdatePasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [seePassword, setSeePassword] = useState(false);
  const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

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
    setFormErrors((prevErros) => ({
      ...prevErros,
      password: isValid ? '' : '영소문자, 숫자, 특수문자 8자 이상 입력하세요',
    }));
  };

  //비밀번호 확인 에러 표시 여부
  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    setFormErrors((prevErros) => ({
      ...prevErros,
      confirmPassword:
        e.target.value === password ? '' : '비밀번호가 맞지 않습니다',
    }));
  };

  //비밀번호 변경
  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!password) errors.password = '비밀번호를 입력하세요.';
    if (!confirmPassword)
      errors.confirmPassword = '비밀번호를 다시 확인하세요.';

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

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
          handleProblemSubject('비밀번호 변경');
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
    <div className={styles.updatePassword_wrapper}>
      <div className={styles.updatePassword_container}>
        <div className={styles.updatePassword_header}>
          <h2>비밀번호 변경</h2>
          <p>변경할 비밀번호를 입력해주세요!</p>
        </div>
        <div className={styles.updatePassword_form}>
          <form onSubmit={handleUpdatePassword}>
            <div className={styles.updatePassword_formGroup}>
              <div className={styles.updatePassword_input_seepw_container}>
                <label htmlFor="password">변경 비밀번호</label>
                <Input
                  type={seePassword ? 'text' : 'password'}
                  id="password"
                  placeholder="영문자, 숫자, 특수문자를 포함한 8자 이상"
                  value={password}
                  onChange={handlePassword}
                  required
                ></Input>
                <button
                  type="button"
                  onClick={seePasswordHandler}
                  className={styles.toggle_pw_button}
                >
                  {seePassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                </button>
              </div>
              <div className={styles.error_container}>
                {formErrors.password && (
                  <ErrorMessage>{formErrors.password}</ErrorMessage>
                )}
              </div>
            </div>

            <div className={styles.updatePassword_formGroup}>
              <div
                className={styles.updatePassowrd_input_seeConfirmpw_container}
              >
                <label htmlFor="confirmPassword">변경 비밀번호 확인</label>
                <Input
                  type={seeConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  placeholder="비밀번호를 재입력해주세요"
                  value={confirmPassword}
                  onChange={handleConfirmPassword}
                  required
                ></Input>
                <button
                  type="button"
                  onClick={seeConfirmPasswordHandler}
                  className={styles.toggle_pw_button}
                >
                  {seeConfirmPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                </button>
              </div>
              <div className={styles.error_container}>
                {formErrors.confirmPassword && (
                  <ErrorMessage>{formErrors.confirmPassword}</ErrorMessage>
                )}
              </div>
            </div>
            <div className={styles.updatePassword_button}>
              <Button type="submit">비밀번호 변경</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;
