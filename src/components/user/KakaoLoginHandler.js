import React, { useContext, useEffect } from 'react';
import { API_BASE_URL, USER } from '../../config/host-config';
import AuthContext from '../../utils/AuthContext';
import { useNavigate } from 'react-router-dom';

const KakaoLoginHandler = () => {
  console.log(
    '사용자가 동의 화면을 통해 필수 정보 동의 후 Kakao 인증 서버에서 reedicrect 진행',
  );

  const { onLogin } = useContext(AuthContext);
  const redirection = useNavigate();

  const REQUEST_URL = API_BASE_URL + USER;

  // URL에 쿼리 스트림으로 전달된 인가 코드를 얻어오기
  const code = new URL(window.location.href).searchParams.get('code');

  useEffect(() => {
    // 컴포넌트가 렌더링 될 때, 인가 코드를 백엔드로 전송하는 fetch 요청
    const kakaoLogin = async () => {
      const res = await fetch(
        REQUEST_URL + '/kakaologin?code=' + code,
      );

      // 서버에서 온 json 읽기
      const { token, userName, email, role } = await res.json();

      // Context API를 사용하여 로그인 상태 업데이트
      onLogin(token, userName, role);

      // 홈으로 리다이렉트
      redirection('/');
    };

    kakaoLogin();
  }, []);

  return <div>KakaoLoginHandler</div>;
};

export default KakaoLoginHandler;
