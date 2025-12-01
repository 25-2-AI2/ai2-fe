import axios from 'axios';

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10초
});

// 요청 인터셉터 (필요시 토큰 등 추가)
apiClient.interceptors.request.use(
  (config) => {
    // 추후 인증 토큰 추가 가능
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 핸들링)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 공통 에러 처리
    if (error.response?.status === 401) {
      // 인증 실패 처리
      console.error('Unauthorized');
    } else if (error.response?.status === 500) {
      // 서버 에러 처리
      console.error('Server Error');
    }
    return Promise.reject(error);
  }
);
