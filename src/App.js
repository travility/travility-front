import { Route, Routes } from "react-router-dom";
import "./App.css";
import "./styles/dashboard/global.css"
import Layout from "./components/Layout";
import AboutUsPage from "./pages/main/AboutusPage";
import AddAccountBookPage from "./pages/accountbook/AddAccountBookPage";
import AccountBookMain from "./pages/accountbook/main/AccountBookMain";
import LoginPage from "./pages/member/LoginPage";
import SignupPage from "./pages/member/SignupPage";
import MyInfo from "./pages/dashboard/MyInfo";
import MyCalendar from "./pages/dashboard/MyCalendar";
import MyReport from "./pages/dashboard/MyReport";
import LoadingPage from "./pages/member/LoadingPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AboutUsPage />} />
      <Route path="/" element={<Layout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/myreport" element={<MyReport />} />
        <Route path="/myinfo" element={<MyInfo />} />
        <Route path="/mycalendar" element={<MyCalendar />} />
        <Route path="/accountbook/add/:id" element={<AddAccountBookPage />} />
        <Route path="/accountbook/main/:id" element={<AccountBookMain />} />
      </Route>
    </Routes>
  );
}

export default App;
