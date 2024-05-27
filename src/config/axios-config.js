// 여기에서 axios 인스턴스 생성
// intercepter 기능을 활용하여,
// access token이 만료되었을 때 refresh token을 사용하여
// 새로운 access token을 발급받는 비동기 방식의 요청을 모듈화
// fetch는 interceptor 기능 X
// axios 인스턴스는 token이 필요한 모든 요청에 활용된다

import axios from 'axios';
import { API_BASE_URL as BASE, TODO, USER } from './host-config';
import { useNavigate } from 'react-router-dom';

const TODO_URL = BASE + TODO;
const USER_URL = BASE + USER;

const axiosInstance = axios.create({
  baseURL: TODO_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
    Axios Interceptor는 요청 또는 응답이 처리되기 전에 실행되는 코드
    요청을 수정하거나, 응답에 대한 결과 처리를 수행할 수 있다
*/
// Request Interceptor 설정
axiosInstance.interceptors.request.use(
  // 요청 보내기 전에 일괄 처리해야할 내용을 함수로 선언
  (config) => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor 설정
axiosInstance.interceptors.response.use(
  (response) => response, // 응답에 문제가 없다면 응답 내용 그대로 리턴
  async (error) => {
    console.log('response interceptor 동작, 응답 에러 발생');

    // 원본 요청의 정보를 기억해놓는다 - 새로운 토큰을 받아서 다시 보내야하므로
    const originalRequest = error.config;

    // 응답에 에러가 발생하면 실행할 두 번째 함수
    if (error.response.status === 401 && !originalRequest._retry) {
      console.log('응답 상태 401 확인 토큰 재발급 요청');

      // _retry 속성은 사용자 정의 속성, 최초 요청에는 존재하지 않는다
      // 만약 재요청 시에도 문제가 발생했다면 (refresh 토큰 만료),
      // 더 이상 똑같은 요청을 반복해서 무한 루프에 빠지지 않도록 막는 역할을 한다
      originalRequest._retry = true;

      // 토큰 문제 발생
      try {
        const refreshToken = localStorage.getItem('REFRESH_TOKEN');
        const res = await axios.post(`${USER_URL}/refresh`, {
          refreshToken,
        });

        if (res.status === 200) {
          // ${USER_URL}/refresh 요청이 성공했다면
          // 서버가 넘겨준 새로운 accessToken을 json에서 꺼내기
          const { accessToken } = res.data; // axios는 json() 사용 안함. data라고 하면 josn 객체 바로 리턴
          localStorage.setItem('ACCESS_TOKEN', accessToken); // 동일한 이름으로 localStorage에 담기
          // 실패한 원본 요청 정보에서 Authorization의 값을 새 토큰으로
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
          // axiosInstance를 사용해서 다시 한 번 원본의 요청을 보내고, 응답값을 원래 호출한 곳으로 리턴
          return axiosInstance(originalRequest);
        }
      } catch (err) {
        // Refresh token이 만료된 경우
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('REFRESH_TOKEN');
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
