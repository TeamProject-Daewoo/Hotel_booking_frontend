import axios from 'axios';
import { useAuthStore } from '@/api/auth';

const VITE_BACK_ADMIN_URL = import.meta.env.VITE_BACK_ADMIN_URL;

const api = axios.create({
  baseURL: VITE_BACK_ADMIN_URL,
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

// Response Interceptor: 응답을 받은 후에 실행
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if ((error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await api.post('/api/auth/refresh');
        const newAccessToken = response.data.accessToken;

        const authStore = useAuthStore();
        authStore.setToken(newAccessToken);

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axios(originalRequest);

      } catch (refreshError) {
        const authStore = useAuthStore();
        authStore.logout();

        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
