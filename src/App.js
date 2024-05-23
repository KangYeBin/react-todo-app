import './App.css';
import TodoTemplate from './components/todo/TodoTemplate';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import { Route, Routes } from 'react-router-dom';
import Join from './components/user/Join';
import { AuthContextProvider } from './utils/AuthContext';
import Login from './components/user/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import KakaoLoginHandler from './components/user/KakaoLoginHandler';

function App() {
  return (
    // 데이터를 전달하고자하는 자식 컴포넌트를 Provider로 감싼다
    <AuthContextProvider>
      <div className="wrapper">
        <Header />
        <Routes>
          <Route path="/" element={<TodoTemplate />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />
          <Route path="/oauth/kakao" element={KakaoLoginHandler} />
        </Routes>
        <Footer />
      </div>
    </AuthContextProvider>
  );
}

export default App;
