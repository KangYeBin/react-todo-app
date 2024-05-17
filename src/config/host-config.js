// 브라우저에서 현재 클라이언트의 호스트 이름 얻어오기
const clientHostName = window.location.hostname;

let backEndHostName; // 백엔드 서버 호스트 이름

// 나중에 도메인을 구입하면 백엔드의 주소도 바뀜
// 리액트 내에서 백엔드를 지목하면서 fetch 요청을 많이 진행하고 있기 때문에
// 주소 변경 가능성을 염두에 두고 호스트 네임을 전역적으로 관리하려는 의도로 설정하는 파일

if (clientHostName === 'localhost') {
  // 개발중
  backEndHostName = 'http://localhost:8181';
} else if (clientHostName === 'spring.com') {
  // 배포해서 서비스 중
  backEndHostName = 'https://api.spring.com';
}

export const API_BASE_URL = backEndHostName;
export const TODO = '/api/todos';
export const USER = '/api/auth';
