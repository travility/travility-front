import React from 'react';
import { useState, useEffect } from 'react';
import { getMemberFromSession } from '../../api/memberApi';
import { deleteMember } from '../../api/memberApi';
import { useNavigate } from 'react-router-dom';
import DefaultSidebar from '../../components/DefaultSidebar';
import styles from '../../styles/dashboard/MyInfo.module.css';
import Swal from 'sweetalert2';



const MyInfo = () => {
  // const [memberInfo, setMemberInfo] = useState({});
  // const [loading, setLoading] = useState(true);
  // const navigate = useNavigate();

  // useEffect(() => {
  //   getMemberFromSession()
  //     .then((data) => {
  //       setMemberInfo(data);
  //       console.log(data);
  //       setLoading(false); // 데이터 로딩 완료
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       setLoading(false); // 에러 발생 시에도 로딩 상태 해제
  //     });
  // }, []); 
  

  // const handleDeleteMember = async () => {
    
  //   Swal.fire({
  //     icon: 'warning',
  //     text: '회원탈퇴 시 모든 정보가 삭제되며, 복구되지 않습니다. 정말 탈퇴하시겠습니까?',
  //     showCancelButton: true,
  //     confirmButtonText: '탈퇴하기',
  //     cancelButtonText: '취소',
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       try {
  //         // 사용자가 확인을 클릭한 경우 회원 탈퇴를 진행
  //         await deleteMember(memberInfo.id);
  //         // 회원 탈퇴 성공 메시지 표시
  //         Swal.fire({
  //           icon: 'success',
  //           title: '회원 탈퇴가 완료되었습니다.',
  //           text: '메인 페이지로 이동합니다.',
  //           confirmButtonText: '확인',
  //         }).then((res) => {
  //           if (res.isConfirmed) {
  //             navigate('/');
  //           }
  //         });
  //       } catch (error) {
  //         // 회원 탈퇴 실패 시 에러 메시지 표시
  //         console.error('회원 탈퇴 실패:', error);
  //         Swal.fire({
  //           icon: 'error',
  //           title: '회원 탈퇴 실패',
  //           text: '회원 탈퇴 중 문제가 발생했습니다. 다시 시도해주세요.',
  //           confirmButtonText: '확인',
  //         });
  //       }
  //     }
  //   });
  // };
  
  
  // {memberInfo.memberId}
  // {memberInfo.email}
  // {memberInfo.birth}
  //onClick={handleDeleteMember}

  return (
     <div className={styles.myinfo_page}>
        <DefaultSidebar />
        
      <div className={styles.myinfo_container}>
        <ul className={styles.myinfo_item}>
        <li>아이디</li>
        <li>아이디 정보</li>
        <li>이메일</li>
        <li>이메일 정보</li>
        <li>생년월일</li>
        <li>생년월일 정보</li>
        </ul>
        <button className={styles.deleteMember} >
            회원탈퇴
        </button>
      </div>
      
      </div>
    );
  };
  
  export default MyInfo;