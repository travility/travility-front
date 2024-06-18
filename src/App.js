import { Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import AboutUsPage from './pages/main/AboutusPage';
import AddAccountBookPage from './pages/accountbook/AddAccountBookPage';
import LoginPage from './pages/member/LoginPage';
import SignupPage from './pages/member/SignupPage';
import MyInfoPage from "./pages/dashboard/MyInfoPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AboutUsPage />} />
      <Route path="/" element={<Layout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/myinfopage" element={<MyInfoPage/>}/>
        <Route path="/accountbook/add/:id" element={<AddAccountBookPage />} />
      </Route>
    </Routes>
  );
}

export default App;
