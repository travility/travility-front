import React from 'react';
import DefaultSidebar from '../../components/DefaultSidebar';
import styles from '../../styles/dashboard/MyInfoPage.module.css';



const MyInfoPage = () => {
    return (
     <div className={styles.page}>
        <DefaultSidebar />
      <div className={styles.container}>
        <ul className={styles.myinfoul}>
        <li>아이디</li>
        <li>id.info</li>
        <li>이메일</li>
        <li>email.info</li>
        <li>생년월일</li>
        <li>birth.info</li>
        </ul>
        <div className={styles.deleteMember}>
            회원탈퇴
        </div>
      </div>
      </div>
    );
  };
  
  export default MyInfoPage;