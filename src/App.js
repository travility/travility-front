import { createContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { global }from "./styles/dashboard/global.css";
import { GlobalStyle, Button } from "./styles/StyledComponents";
import { ThemeProvider, useTheme, lightTheme, darkTheme } from "./styles/Theme";
import Layout from "./components/header/Layout";
import AboutUsPage from "./pages/main/AboutusPage";
import MainPage from "./pages/main/mainPage2/MainPage";
import AccountBookListPage from "./pages/accountbook/AccountBookListPage";
import AccountBookDetail from "./pages/accountbook/detail/AccountBookDetail";
import LoginPage from "./pages/member/LoginPage";
import SignupPage from "./pages/member/SignupPage";
import MyInfo from "./pages/dashboard/MyInfo";
import MyCalendar from "./pages/dashboard/MyCalendar";
import MyReport from "./pages/dashboard/MyReport";
import UsersPage from "./pages/admin/UsersPage";
import LoadingPage from "./util/LoadingPage";
import AuthenticatedRoute from "./util/AuthenticatedRoute";
import { getMemberInfo, logout } from "./api/memberApi";
import { validateToken } from "./util/tokenUtils";
import { handleTokenExpirationLogout } from "./util/logoutUtils";
import SettlementPage from "./pages/accountbook/settlement/SettlementPage";
import SettlementExpenseListPage from "./pages/accountbook/settlement/SettlementExpenseListPage";
import { global } from "./styles/dashboard/global.css";

export const TokenStateContext = createContext();

function App() {
  const [tokenStatus, setTokenStatus] = useState();
  const [memberInfo, setMemberInfo] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme, loadTheme } = useTheme();

  useEffect(() => {
    loadTheme(); // 기존 선택 테마 로드

    const checkTokenStatus = async () => {
      try {
        const result = await validateToken();
        setTokenStatus(result);
        if (result === "Token valid") {
          const info = await getMemberInfo();
          setMemberInfo(info);
        } else if (result === "Token expired") {
          await logout();
          handleTokenExpirationLogout(navigate);
        }
      } catch (error) {
        console.error("토큰 유효성 검사 중 오류 발생:", error);
        if (location.pathname !== "/") {
          navigate("/login");
        }
      }
    };

    checkTokenStatus();
  }, [navigate, location, loadTheme]);

  return (
    <TokenStateContext.Provider value={{ tokenStatus, memberInfo }}>
      <StyledThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
        <GlobalStyle />
        <div>
          <Button onClick={toggleTheme}>Toggle Theme</Button>
          <Routes>
            <Route path="/" element={<AboutUsPage />} />
            <Route path="/" element={<Layout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/loading" element={<LoadingPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/settlement/:id" element={<SettlementPage />} />
              <Route
                path="/settlement/:id/expenses"
                element={<SettlementExpenseListPage />}
              />
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
                path="/accountbook/list"
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
        </div>
      </StyledThemeProvider>
    </TokenStateContext.Provider>
  );
}

export default function WrappedApp() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
