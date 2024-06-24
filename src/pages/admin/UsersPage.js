import React, { useEffect, useState } from 'react';
import { getMemberList } from '../../api/adminApi';
import { handleAccessDenied } from '../../util/logoutUtils';
import { useNavigate } from 'react-router-dom';
import DefaultSidebar from '../../components/DefaultSidebar';
import styles from '../../styles/admin/UserPage.module.css';

const UsersPage = () => {
  const [memberList, setMemberList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getMemberList()
      .then((data) => {
        console.log(data);
        setMemberList(data);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.message === 'Access denied') {
          handleAccessDenied(navigate);
        }
      });
  }, [navigate]);

  return (
    <div className={styles.usersPage}>
      <DefaultSidebar />
      <div className={styles.content}>
        <div className={styles.header}>
          <img
            src="/images/admin/statistics.png"
            alt="statics"
            className={styles.image}
          ></img>
          <span className={styles.title}>사용자 관리</span>
        </div>
        <div className={styles.statistics}>
          <p>
            총 회원 수는 <span>?</span> 명입니다.
          </p>
          <p>
            오늘 신규 가입자 수는 <span>?</span> 명입니다.
          </p>
        </div>
        <div className={styles.memberList}>
          {memberList.map((member) => {
            return (
              <div key={member.username} className={styles.member}>
                <span>{member.username}</span>
                <span>{member.email}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
