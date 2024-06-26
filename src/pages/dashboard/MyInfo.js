import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
// import { getMemberFromSession, deleteMember } from '../../api/memberApi'; // 백엔드 API 호출 부분은 주석처리
import { useNavigate } from 'react-router-dom';
import DefaultSidebar from '../../components/DefaultSidebar';
import styles from '../../styles/dashboard/MyInfo.module.css';
import Swal from 'sweetalert2';
import { TokenStateContext } from '../../App';
import { deleteMember } from '../../api/memberApi';
import { handleSuccessLogout } from '../../util/logoutUtils';

const MyInfo = () => {
  const { memberInfo } = useContext(TokenStateContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (memberInfo) {
      setLoading(false);
    }
  }, [memberInfo]);

  const handleDeleteMember = async () => {
    const { value: text } = await Swal.fire({
      icon: 'warning',
      text: '회원탈퇴 시 모든 정보가 삭제되며, 복구되지 않습니다. 정말 탈퇴하시겠습니까?',
      inputLabel: '회원 탈퇴를 위해 "탈퇴합니다"를 입력해주세요',
      input: 'text',
      inputPlaceholder: '탈퇴합니다',
      showCancelButton: true,
      confirmButtonText: '탈퇴하기',
      confirmButtonColor: '#2a52be',
      cancelButtonText: '취소',
      preConfirm: (inputValue) => {
        if (inputValue !== '탈퇴합니다') {
          Swal.showValidationMessage('정확히 "탈퇴합니다"를 입력해주세요.');
        }
      },
    });

    if (text === '탈퇴합니다') {
      deleteMember()
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: '탈퇴 성공',
            text: '회원 탈퇴가 성공적으로 되었습니다',
            confirmButtonText: '확인',
            confirmButtonColor: '#2a52be',
          }).then((res) => {
            if (res.isConfirmed) {
              handleSuccessLogout(navigate);
            }
          });
        })
        .catch((error) => {
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: '탈퇴 실패',
            text: '회원 탈퇴 중 문제가 발생했습니다. 다시 시도해주세요.',
            confirmButtonText: '확인',
          });
        });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.myinfo_page}>
      <DefaultSidebar />
      <div className={styles.myinfo_container}>
        <ul className={styles.myinfo_item}>
          <li>아이디</li>
          <li>{memberInfo.username}</li>
          <li>이메일</li>
          <li>{memberInfo.email}</li>
          {/* <li>생년월일</li>
          <li>{}</li> */}
        </ul>
        <button className={styles.deleteMember} onClick={handleDeleteMember}>
          회원탈퇴
        </button>
      </div>
    </div>
  );
};

export default MyInfo;
