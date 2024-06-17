import React from 'react';
import { useParams } from 'react-router-dom';

const AddAccountBookPage = () => {
  const { id } = useParams();
  return <div>{id}회원의 가계부 등록 페이지입니다.</div>;
};

export default AddAccountBookPage;
