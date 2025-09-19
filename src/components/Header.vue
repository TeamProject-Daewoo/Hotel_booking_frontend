<script setup>
import { computed } from 'vue';
import { nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/api/auth';
import api from '@/api/axios';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const headerClass = computed(() => {
  return route.path === '/' ? 'transparent-header' : 'white-header';
});

function goHome() {
  router.push('/');
}

function goRegister() {
  router.push('/register-choice');
}

function goMypage() {
  router.push('/mypage');
}

function goToLookup() {
  router.push('/lookup-booking');
}

const handleLogout = async () => {
    // 스토어에서 현재 사용자의 로그인 타입을 확인
    const loginType = authStore.loginType;

    console.log(loginType)

    if (loginType === 'KAKAO') {

        // 카카오 로그인의 경우: 카카오 로그아웃 URL로 리디렉션
        const KAKAO_RESTAPI_KEY = import.meta.env.VITE_KAKAO_RESTAPI_KEY;; // 👈 본인의 REST API 키
        const KAKAO_LOGOUT_REDIRECT_URI = 'http://localhost:5173/logout-callback'; // 👈 다음 단계에서 만들 콜백 경로

        window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=${KAKAO_RESTAPI_KEY}&logout_redirect_uri=${KAKAO_LOGOUT_REDIRECT_URI}`;
    
    } else {
        // 일반 이메일 로그인의 경우: 기존 로그아웃 방식 사용
        try {
          authStore.logout();
            await api.post('/api/auth/logout');

            alert('로그아웃되었습니다.');
            router.push('/');
        } catch (error) {
            console.error('로그아웃 실패:', error);
        }
    }
};
</script>

<template>
  <header :class="headerClass">
    <div class="navbar">
      <div class="logo" @click="goHome" style="cursor: pointer;">
        <img src="https://i.ibb.co/ccn2vLPb/hotel-logo.png" alt="Hotel Hub Logo" class="logo-image">
      </div>

      <div class="user-actions">
        <template v-if="authStore.loggedInUser">
          <span @click="goMypage" class="user-greeting">안녕하세요, {{ authStore.userName }}님</span>
          <button class="logout" @click="handleLogout">로그아웃</button>
        </template>

        <template v-else>
          <button class="lookup-button" @click="goToLookup">비회원 예약조회</button>
          <button class="signup" @click.prevent="goRegister">회원 가입</button>
          <router-link to="/login-choice">
            <button class="login">로그인</button>
          </router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  transition: background-color 0.4s ease, border-color 0.4s ease;
}

.transparent-header {
  background-color: transparent;
  border-bottom: 1px solid transparent;
}

.white-header {
  background-color: #fff;
  border-bottom: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px;
}

.logo-image {
  height: 45px;
  width: auto;
  filter: brightness(0) invert(1);
}

.white-header .logo-image {
  filter: none;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-greeting {
  margin-right: 10px;
  cursor: pointer;
  font-weight: 500;
}

.user-actions button {
  padding: 8px 18px;
  cursor: pointer;
  font-size: 15px;
  transition: all 0.3s ease;
  border-radius: 25px !important;
  border: 1px solid;
  background-color: transparent;
}

.user-actions .signup {
  color: #007bff;
  border-color: #007bff;
}
.user-actions .signup:hover {
  background-color: #007bff !important;
  color: white !important;
}

.user-actions .login {
  color: #333;
  border: none;
}
.user-actions .login:hover {
  background-color: #f4f4f4 !important;
}

.user-actions .logout {
  color: #dc3545;
  border-color: #dc3545;
}
.user-actions .logout:hover {
  background-color: #dc3545 !important;
  color: white !important;
}

.user-actions .lookup-button {
  color: #28a745;
  border-color: #28a745;
}

.user-actions .lookup-button:hover {
  background-color: #28a745 !important;
  color: white !important;
}


.transparent-header .user-greeting,
.transparent-header .user-actions .login,
.transparent-header .user-actions .signup,
.transparent-header .user-actions .logout,
.transparent-header .user-actions .lookup-button {
  color: white;
  border-color: white;
}

.transparent-header .user-actions .login {
  border: none;
}
.transparent-header .user-actions .login:hover {
  background-color: rgba(255, 255, 255, 0.15) !important;
}

.transparent-header .user-actions .signup:hover,
.transparent-header .user-actions .logout:hover,
.transparent-header .user-actions .lookup-button:hover {
  background-color: white !important;
  color: black !important;
}

</style>