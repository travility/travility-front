import React, { useEffect, useState } from 'react';
import {
  getMemberList,
  getNewMembersCountToday,
  getTotalMembersCount,
} from '../../api/adminApi';
import { handleAccessDenied } from '../../util/logoutUtils';
import { useNavigate } from 'react-router-dom';
import DefaultSidebar from '../../components/DefaultSidebar';
import styles from '../../styles/admin/UserPage.module.css';

const UsersPage = () => {
  const [memberList, setMemberList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [todayCount, settodayCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    getTotalMembersCount()
      .then((data) => {
        console.log(data);
        setTotalCount(data);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.message === 'Access denied') {
          handleAccessDenied(navigate);
        }
      });

    getNewMembersCountToday()
      .then((data) => {
        console.log(data);
        settodayCount(data);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.message === 'Access denied') {
          handleAccessDenied(navigate);
        }
      });

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
            className={styles.img_header}
          ></img>
          <span className={styles.title}>사용자 관리</span>
        </div>
        <div className={styles.statistics}>
          <p>
            총 회원 수는 <span>{totalCount}</span> 명입니다.
          </p>
          <p>
            오늘 신규 가입자 수는 <span>{todayCount}</span> 명입니다.
          </p>
        </div>
        <div className={styles.memberList_container}>
          <table className={styles.memberList}>
            <thead>
              <tr>
                <th>No</th>
                <th>아이디</th>
                <th>이메일</th>
                <th>소셜</th>
                <th>가입일</th>
              </tr>
            </thead>
            <tbody>
              {memberList.map((member, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{member.username}</td>
                  <td>{member.email}</td>
                  <td>
                    {member.socialType ? (
                      member.socialType === 'naver' ? (
                        <img
                          className={styles.img_socialtype}
                          src="/images/member/naver.png"
                          alt="naver"
                        ></img>
                      ) : member.socialType === 'google' ? (
                        <img
                          className={styles.img_socialtype}
                          src="/images/member/google.png"
                          alt="naver"
                        ></img>
                      ) : (
                        <img
                          className={styles.img_socialtype}
                          src="/images/member/kakao.png"
                          alt="naver"
                        ></img>
                      )
                    ) : (
                      '일반'
                    )}
                  </td>
                  <td>{new Date(member.createdDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
