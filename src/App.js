import { Route, Routes } from 'react-router-dom';
import './App.css';
import AboutUsPage from './pages/AboutusPage';
import AddAccountBookPage from './pages/accountbook/AddAccountBookPage';
import LoginPage from './pages/member/LoginPage';
import SignupPage from './pages/member/SignupPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AboutUsPage />}></Route>
      <Route path="/login" element={<LoginPage />}></Route>
      <Route path="/signup" element={<SignupPage />}></Route>
      <Route
        path="/accountbook/add/:id"
        element={<AddAccountBookPage />}
      ></Route>
    </Routes>
  );
}

export default App;
