import { createContext, useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import AboutUsPage from './pages/main/AboutusPage';
import MainPage from './pages/main/mainPage2/MainPage';
import AccountBookListPage from './pages/accountbook/AccountBookListPage';
import AccountBookDetail from './pages/accountbook/detail/AccountBookDetail';
import LoginPage from './pages/member/LoginPage';
import SignupPage from './pages/member/SignupPage';
import MyInfo from './pages/dashboard/MyInfo';
import MyCalendar from './pages/dashboard/MyCalendar';
import MyReport from './pages/dashboard/MyReport';
import UsersPage from './pages/admin/UsersPage';
import LoadingPage from './util/LoadingPage';
import AuthenticatedRoute from './util/AuthenticatedRoute';
import './App.css';
import './styles/dashboard/global.css';
import { getMemberInfo, logout } from './api/memberApi';
import { validateToken } from './util/tokenUtils';
import { handleTokenExpirationLogout } from './util/logoutUtils';
export const TokenStateContext = createContext();

function App() {
  const [tokenStatus, setTokenStatus] = useState();
  const [memberInfo, setMemberInfo] = useState();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkTokenStatus = async () => {
      try {
        const result = await validateToken();
        setTokenStatus(result);
        if (result === 'Token valid') {
          const info = await getMemberInfo();
          setMemberInfo(info);
        } else if (result === 'Token expired') {
          await logout();
          handleTokenExpirationLogout(navigate);
        }
      } catch (error) {
        console.error('토큰 유효성 검사 중 오류 발생:', error);
        if (location.pathname !== '/') {
          navigate('/login');
        }
      }
    };

    checkTokenStatus();
  }, [navigate, location]);

  return (
    <TokenStateContext.Provider value={{ tokenStatus, memberInfo }}>
      <Routes>
        <Route path="/" element={<AboutUsPage />} />
        <Route path="/" element={<Layout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/main"
            element={
              <AuthenticatedRoute>
                <MainPage />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/dashboard/myreport"
            element={
              <AuthenticatedRoute>
                <MyReport />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/dashboard/myinfo"
            element={
              <AuthenticatedRoute>
                <MyInfo />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/dashboard/mycalendar"
            element={
              <AuthenticatedRoute>
                <MyCalendar />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/accountbook/list/:id"
            element={
              <AuthenticatedRoute>
                <AccountBookListPage />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/accountbook/detail/:id"
            element={
              <AuthenticatedRoute>
                <AccountBookDetail />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AuthenticatedRoute>
                <UsersPage />
              </AuthenticatedRoute>
            }
          />
        </Route>
      </Routes>
    </TokenStateContext.Provider>
  );
}

export default App;
