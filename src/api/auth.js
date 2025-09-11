// src/stores/auth.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '@/api/axios'; // 설정한 axios 인스턴스를 가져옵니다.

export const useAuthStore = defineStore('auth', () => {
    // STATE
    const accessToken = ref(null);
    const isInitialized = ref(false); // 앱 초기화 시 토큰 재발급 시도 완료 여부

    // ACTIONS
    /**
     * 액세스 토큰을 상태에 저장하고, API 클라이언트 헤더를 설정합니다.
     * @param {string} token - 액세스 토큰
     */
    function setToken(token) {
        accessToken.value = token;
        if (token) {
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            // 토큰이 없으면 헤더 삭제
            delete apiClient.defaults.headers.common['Authorization'];
        }
    }

    /**
     * 저장된 토큰과 사용자 정보를 모두 제거합니다. (상태 초기화)
     */
    function clearToken() {
        setToken(null);
    }

    /**
     * 앱이 처음 로드될 때 실행되어, HttpOnly 쿠키(리프레시 토큰)를 이용해
     * 새로운 액세스 토큰을 발급받고 로그인 상태를 복원합니다.
     */
    async function reissueToken() {
        try {
            // 백엔드의 /refresh 엔드포인트에 요청을 보냅니다.
            // 브라우저가 자동으로 HttpOnly 쿠키를 함께 전송합니다.
            const response = await apiClient.post('/api/auth/refresh');
            const newAccessToken = response.data.accessToken;
            setToken(newAccessToken);
            console.log("액세스 토큰 재발급 성공");
        } catch (error) {
            console.error("토큰 재발급에 실패했습니다. 로그인이 필요합니다.", error);
            clearToken(); // 실패 시 깨끗하게 정리
        } finally {
            // 성공/실패 여부와 관계없이 초기화 상태는 true로 변경
            isInitialized.value = true;
        }
    }

    /**
     * 서버에 로그아웃을 요청하고, 성공 시 클라이언트의 상태를 초기화합니다.
     */
    async function logout() {
        try {
            await apiClient.post('/api/auth/logout');
        } catch (error) {
            console.error("로그아웃 처리 중 오류가 발생했습니다.", error);
        } finally {
            // API 호출 성공/실패와 관계없이 클라이언트 상태는 깨끗하게 정리합니다.
            clearToken();
        }
    }

    return {
        accessToken,
        isInitialized,
        setToken,
        clearToken,
        reissueToken,
        logout
    };
});