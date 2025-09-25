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

   // 1. 401 에러인 경우: 토큰 재발급 시도 (기존 로직)
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await api.post('/api/auth/refresh');
        const newAccessToken = response.data.accessToken;
        const authStore = useAuthStore();
        authStore.setToken(newAccessToken);
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axios(originalRequest); // 수정된 요청으로 재시도
      } catch (refreshError) {
        const authStore = useAuthStore();
        authStore.logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
// 2. 403 에러인 경우: 접근 제한 페이지로 리다이렉트
    if (error.response.status === 403) {
        // uiStore.openModal('접근 권한 없음', '요청하신 작업에 대한 권한이 없습니다.'); // 기존 모달 방식 대신
        console.warn("403 Forbidden 에러 발생: 접근 권한이 없습니다. 접근 제한 페이지로 리다이렉트합니다.");
        router.push('/errorPage'); // 👈 접근 제한 페이지로 이동
        return Promise.reject(error); // 에러 전파 (필요하다면)
    }

    // 그 외 모든 에러는 호출한 쪽에서 처리하도록 그대로 반환
    return Promise.reject(error);
  }
);

export default api;