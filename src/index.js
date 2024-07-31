import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

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

reportWebVitals();
