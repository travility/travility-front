import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import AboutUsPage from './pages/main/AboutusPage';
import AddAccountBookPage from './pages/accountbook/AddAccountBookPage';
import AccountBookListPage from "./pages/accountbook/AccountBookListPage";
import AccountBookMain from './pages/accountbook/main/AccountBookMain';
import LoginPage from './pages/member/LoginPage';
import SignupPage from './pages/member/SignupPage';
import MyInfo from './pages/dashboard/MyInfo';
import MyCalendar from './pages/dashboard/MyCalendar';
import MyReport from './pages/dashboard/MyReport';
import LoadingPage from './pages/auth/LoadingPage';
import AuthenticatedRoute from './pages/auth/AuthenticatedRoute';
import './App.css';
import './styles/dashboard/global.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AboutUsPage />} />
      <Route path="/" element={<Layout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/myreport"
          element={
            <AuthenticatedRoute>
              <MyReport />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/myinfo"
          element={
            <AuthenticatedRoute>
              <MyInfo />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/mycalendar"
          element={
            <AuthenticatedRoute>
              <MyCalendar />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/accountbook/add/:id"
          element={
            <AuthenticatedRoute>
              <AddAccountBookPage />
            </AuthenticatedRoute>
          }
        />
        {/* <Route
          path="/accountbook/list/:id"
          element={
            <AuthenticatedRoute>
              <AccountBookListPage />
            </AuthenticatedRoute>
          }
        /> */}
        <Route
          path="/accountbook/list/:id"
          element={
           
              <AccountBookListPage />
            
          }
        /> 

        <Route
          path="/accountbook/main/:id"
          element={
            <AuthenticatedRoute>
              <AccountBookMain />
            </AuthenticatedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
