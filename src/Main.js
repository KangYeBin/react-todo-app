import React from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { Outlet } from 'react-router-dom';

const Main = () => {
  return (
    <div className="wrapper">
      <Header />
      {/* <Routes>
        <Route path="/" element={<TodoTemplate />} />
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />
        <Route path="/oauth/kakao" element={<KakaoLoginHandler />} />
      </Routes> */}

      <div className="content-wrapper">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Main;
