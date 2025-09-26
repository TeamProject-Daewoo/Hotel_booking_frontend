<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/api/auth';
import api from '@/api/axios';
import { useUiStore } from '@/store/commonUiStore';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 640; // 10px만 스크롤 되어도 배경이 생기도록 설정
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const headerClass = computed(() => {
  if (route.path === '/') {
    return isScrolled.value ? 'white-header' : 'transparent-header';
  }
  return 'white-header';
});

function goHome() {
  router.push('/');
}
function goCoupon() {
  router.push('/coupon'); // 쿠폰 페이지 경로에 맞게 변경하세요
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

  const VITE_HOMPAGE_MAIN = import.meta.env.VITE_HOMPAGE_MAIN;

const handleLogout = async () => {
  const loginType = authStore.loginType;

  if (loginType === 'KAKAO') {
    const KAKAO_RESTAPI_KEY = import.meta.env.VITE_KAKAO_RESTAPI_KEY;
    const KAKAO_LOGOUT_REDIRECT_URI = `${VITE_HOMPAGE_MAIN}/logout-callback`;
    window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=${KAKAO_RESTAPI_KEY}&logout_redirect_uri=${KAKAO_LOGOUT_REDIRECT_URI}`;
  } else {
    try {
      authStore.logout();
      await api.post('/api/auth/logout');
      const uiStore = useUiStore();
      uiStore.openModal('로그아웃 되었습니다.', '');
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
          <button class="coupon" @click="goCoupon">쿠폰함</button>
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
  transition: background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
}

.transparent-header {
  background-color: transparent;
  border-bottom: 1px solid transparent;
}
.transparent-header .logo-image {
  filter: brightness(0) invert(1);
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

.white-header {
  background-color: #fff;
  border-bottom: 1px solid #eee;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}
.white-header .logo-image {
  filter: none;
}
.white-header .user-greeting,
.white-header .user-actions .login,
.white-header .user-actions .signup,
.white-header .user-actions .logout,
.white-header .user-actions .lookup-button {
  color: #333; /* 기본 텍스트 색상 */
}
.white-header .user-actions .signup { border-color: #007bff; color: #007bff; }
.white-header .user-actions .login { border: none; }
.white-header .user-actions .logout { border-color: #dc3545; color: #dc3545; }
.white-header .user-actions .lookup-button { border-color: #28a745; color: #28a745; }


.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px;
}
.logo-image {
  height: 45px;
  width: auto;
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

.user-actions .signup:hover {
  background-color: #007bff !important;
  color: white !important;
}
.user-actions .login:hover {
  background-color: #f4f4f4 !important;
}
.user-actions .logout:hover {
  background-color: #dc3545 !important;
  color: white !important;
}
.user-actions .lookup-button:hover {
  background-color: #28a745 !important;
  color: white !important;
}
</style>