import React, { useEffect, useState, useCallback } from "react";
import {
  deleteMemberByAdmin,
  getMemberList,
  getNewMembersCountToday,
  getTotalMembersCount,
} from "../../api/adminApi";
import { handleAccessDenied, handleProblemSubject } from "../../util/swalUtils";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/admin/UserPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import Select from "react-select";
import { selectStyles } from "../../util/CustomStyles";

const UsersPage = () => {
  const navigate = useNavigate();
  const [memberList, setMemberList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [todayCount, settodayCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [sort, setSort] = useState({ value: "desc", label: "최신순" });
  const sortOptions = [
    { value: "desc", label: "최신순" },
    { value: "asc", label: "오래된순" },
  ];
  const pageSize = 10;

  const fetchData = useCallback(async () => {
    // 무한루프방지
    try {
      const totalMembers = await getTotalMembersCount();
      setTotalCount(totalMembers);

      const newMembersToday = await getNewMembersCountToday();
      settodayCount(newMembersToday);

      const members = await getMemberList(
        currentPage - 1,
        pageSize,
        sort.value
      );
      setMemberList(members);
    } catch (error) {
      console.log(error);
      if (error.response.data === "Access denied") {
        handleAccessDenied(navigate);
      }
    }
  }, [currentPage, sort, navigate]);

  //정렬
  const handleSort = (sortOption) => {
    setSort(sortOption);
    setCurrentPage(1);
  };

  //계정 삭제
  const handleDeleteMember = async (username) => {
    const { value: text } = await Swal.fire({
      icon: "warning",
      text: "계정 삭제 시 모든 정보가 삭제되며, 복구되지 않습니다. 정말 해당 회원 계정을 삭제시키겠습니까?",
      inputLabel: '계정 삭제를 위해 "삭제합니다"를 입력해주세요',
      input: "text",
      inputPlaceholder: "삭제합니다",
      showCancelButton: true,
      confirmButtonText: "삭제하기",
      confirmButtonColor: "#2a52be",
      cancelButtonText: "취소",
      preConfirm: (inputValue) => {
        if (inputValue !== "삭제합니다") {
          Swal.showValidationMessage('정확히 "삭제합니다"를 입력해주세요.');
        }
      },
    });

    if (text === "삭제합니다") {
      deleteMemberByAdmin(username)
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "삭제 성공",
            text: "해당 회원 계정 삭제가 성공적으로 되었습니다",
            confirmButtonText: "확인",
            confirmButtonColor: "#2a52be",
          }).then((res) => {
            if (res.isConfirmed) {
              fetchData();
            }
          });
        })
        .catch((error) => {
          console.log(error);
          handleProblemSubject("계정 삭제");
        });
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

  //현재 페이지
  const handleCurrentPage = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const customSelectStyles = {
    ...selectStyles,
    control: (base) => ({
      ...base,
      backgroundColor: "var(--background-color)",
      border: "1px solid var(--line-color)",
      borderRadius: "0.3rem",
      minHeight: "1rem",
      width: "5rem",
      color: "var(--text-color)",
      cursor: "pointer",
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0.1rem 0.5rem",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "0.1rem",
    }),
  };

  return (
    <div className={styles.usersPage}>
      {memberList.length === 0 ? (
        <div className={styles.no_memberList}>
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className={styles.no_memberList_icon}
          />
          <div>Travility에 가입한 회원이 없어요🐷</div>
        </div>
      ) : (
        <>
          <div className={styles.content}>
            <div className={styles.statistics}>
              <p>
                총 회원 수는 <span>{totalCount}</span> 명이고, 오늘 가입자 수는{" "}
                <span>{todayCount}</span> 명입니다.
              </p>
            </div>
            <div className={styles.memberList_container}>
              <div className={styles.sortType_container}>
                <Select
                  id="sort"
                  value={sort}
                  onChange={handleSort}
                  options={sortOptions}
                  styles={customSelectStyles}
                ></Select>
              </div>
              <table className={styles.memberList}>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>아이디</th>
                    <th>이메일</th>
                    <th>소셜</th>
                    <th>가입일</th>
                    <th>삭제</th>
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
                          "일반"
                        )}
                      </td>
                      <td>
                        {new Date(member.createdDate).toLocaleDateString()}
                      </td>
                      <td>
                        <FontAwesomeIcon
                          icon={faTrashCan}
                          className={styles.delete_icon}
                          onClick={() => handleDeleteMember(member.username)}
                        />
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
