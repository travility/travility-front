import React, { useEffect, useState } from 'react';
import { getMemberList } from '../../api/adminApi';
import { handleAccessDenied } from '../../util/logoutUtils';
import { useNavigate } from 'react-router-dom';
import DefaultSidebar from '../../components/DefaultSidebar';

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
    <div>
      <DefaultSidebar />
      <div>
        {memberList.map((member) => {
          return <div key={member.username}>{member.username}</div>;
        })}
      </div>
    </div>
  );
};

export default UsersPage;
