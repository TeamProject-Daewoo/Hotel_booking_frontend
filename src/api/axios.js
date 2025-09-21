import axios from 'axios';
import { useAuthStore } from '@/api/auth';

const VITE_API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request Interceptor: 요청을 보내기 전에 실행
api.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore();
        const accessToken = authStore.accessToken;
        
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 👇 [추가] Response Interceptor: 응답을 받은 후에 실행
api.interceptors.response.use(
  (response) => {
    // 2xx 범위의 상태 코드는 이 함수를 트리거합니다.
    // 여기서는 별다른 작업을 하지 않고 응답을 그대로 반환합니다.
    return response;
  },
  async (error) => {
    // 2xx 외의 범위에 있는 상태 코드는 이 함수를 트리거합니다.
    const originalRequest = error.config;

    // 401 또는 403 에러이고, 재시도한 요청이 아닐 경우에만 토큰 재발급 시도
    if ((error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true; // 재시도 플래그 설정 (무한 루프 방지)

      try {
        // Refresh Token으로 새로운 Access Token을 요청합니다.
        const response = await api.post('/api/auth/refresh');
        const newAccessToken = response.data.accessToken;
        
        // Pinia 스토어에 새로운 토큰을 저장합니다.
        const authStore = useAuthStore();
        authStore.setToken(newAccessToken);

        // 원래 요청의 헤더에 새로운 토큰을 설정합니다.
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // 원래 실패했던 요청을 새로운 토큰으로 다시 시도합니다.
        return axios(originalRequest);

      } catch (refreshError) {
        // Refresh Token도 만료되었거나 유효하지 않은 경우
        const authStore = useAuthStore();
        authStore.logout(); // 모든 인증 정보 삭제
        
        // 로그인 페이지로 리디렉션
        window.location.href = '/login'; 
        
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;