import axios from 'axios';
import { useAuthStore } from '@/api/auth';

const api = axios.create({
    baseURL: 'http://localhost:8888', // Spring Boot 서버의 주소
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request Interceptor 설정
api.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore();
        const accessToken = authStore.accessToken; // Pinia 스토어에서 토큰 가져오기
        
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;