import React, { useEffect, useState } from 'react';
import {
  getMemberList,
  getNewMembersCountToday,
  getTotalMembersCount,
} from '../../api/adminApi';
import {
  handleAccessDenied,
  handleTokenExpirationLogout,
} from '../../util/logoutUtils';
import { useNavigate } from 'react-router-dom';
import DefaultSidebar from '../../components/DefaultSidebar';
import styles from '../../styles/admin/UserPage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const UsersPage = () => {
  const [memberList, setMemberList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [todayCount, settodayCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const pageSize = 10;
  const [sort, setSort] = useState('desc');
  const navigate = useNavigate();

  const handleSort = (e) => {
    setSort(e.target.value);
    setCurrentPage(1);
  };

  const fetchData = async () => {
    try {
      const totalMembers = await getTotalMembersCount();
      setTotalCount(totalMembers);

      const newMembersToday = await getNewMembersCountToday();
      settodayCount(newMembersToday);

      const members = await getMemberList(currentPage - 1, pageSize, sort);
      setMemberList(members);
      console.log(members);
    } catch (error) {
      console.log(error);
      if (error.response?.data?.message === 'Access denied') {
        handleAccessDenied(navigate);
      } else if (error.response?.data?.message === 'Token expired') {
        handleTokenExpirationLogout(navigate);
      }
    }
  };

  //총 페이지 수
  const totalPages = Math.ceil(totalCount / pageSize); //반올림

  //페이지 목록
  const getPageNumbers = () => {
    const pages = []; //페이지 목록 배열
    const calcPage = Math.floor((currentPage - 1) / pageSize) * 10 + 1; //해당 페이지의 페이지 목록 시작 페이지
    if (startPage !== calcPage) {
      setStartPage(calcPage);
    }
    for (let i = startPage; i < startPage + 10 && i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleCurrentPage = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    console.log(totalPages);
    console.log(memberList);
    fetchData();
  }, [navigate, currentPage, sort]);

  return (
    <div className={styles.usersPage}>
      <DefaultSidebar />
      {memberList.length === 0 ? (
        <div className={styles.no_memberList}>
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className={styles.no_memberList_icon}
          />
          <div>회원이 없습니다.</div>
        </div>
      ) : (
        <>
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
              <div className={styles.sorttype_container}>
                <select
                  className={styles.sorttype}
                  value={sort}
                  onChange={handleSort}
                >
                  <option value="desc">최신순</option>
                  <option value="asc">오래된순</option>
                </select>
              </div>
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
                          <img
                            className={styles.img_socialtype}
                            src={`/images/member/${member.socialType}.png`}
                            alt="socialtype"
                          ></img>
                        ) : (
                          '일반'
                        )}
                      </td>
                      <td>
                        {new Date(member.createdDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={styles.pagination}>
                {currentPage > 10 && (
                  <span
                    className={styles.prev_button}
                    onClick={() => handleCurrentPage(currentPage - 10)}
                  >
                    이전
                  </span>
                )}
                {getPageNumbers().map((page) => (
                  <span
                    key={page}
                    className={
                      page === currentPage
                        ? styles.activePage
                        : styles.notActivePage
                    }
                    onClick={() => handleCurrentPage(page)}
                  >
                    {page}
                  </span>
                ))}
                {totalPages > startPage + 9 && (
                  <span
                    className={styles.next_button}
                    onClick={() => handleCurrentPage(startPage + 10)}
                  >
                    다음
                  </span>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UsersPage;
