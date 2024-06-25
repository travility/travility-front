import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

/* 지금 index.js 9번째 줄에 axios.defaults.withCredentials = true; 있습니다.
withCredentials = true -> 요청에 쿠키나 인증정보 포함시켜준다는 뜻으로 axios.defaults.withCredentials = true;는 즉, 모든 axios 요청에 쿠키나 인증 정보 포함시킨다는 뜻입니다.
그런데 현재 환율 받아오는 api 서버는 Access-Control-Allow-Origin(어떤 도메인 요청 받을 지 정하는거)가 *로 되어있고, 이 상태에서 withCredentials = true가 되어 있으면 cors 에러가 뜹니다. withCredentials = true 한 상태로 서버 요청을 보내려면 Access-Control-Allow-Origin = "http://localhost:3000" 이런 식으로 특정 url을 정해줘야 해요! 근데 우리가 api 서버 설정을 바꿀 수는 없으니까 axios.defaults.withCredentials = true; 이거를 없애고 필요한 요청에만 개별적으로 withCredentials = true으로 넣어주겠습니다. */


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
