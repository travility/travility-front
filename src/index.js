import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
//import 'bootstrap/dist/css/bootstrap.min.css';

//KAKAO SDK 초기화 (스크립트를 제대로 불러왔으면 window.kakao로 접근 가능)
const kakaoKey = '467f687af03172ae256cb3f52936eed4';
if (!window.Kakao.isInitialized()) {
  window.Kakao.init(kakaoKey);
}

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
