
<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/api/auth';  // Pinia 스토어 경로에 맞게 조정하세요

const router = useRouter();
const authStore = useAuthStore();

function goHome() {
  router.push('/');
}

function goRegister() {
  router.push('/register');
}

function goAdmin() {
  window.location.href = 'http://localhost:5174';
}

function logout() {
  authStore.logout();  // Pinia 상태 초기화 (persisted state에서 자동 제거됨)
  router.push('/');
}

onMounted(() => {
  // 별도 initFromStorage 불필요 (persistedstate가 자동으로 상태 복원)
});
</script>

<template>
  <header>
    <div class="navbar">
      <div class="logo" @click="goHome" style="cursor: pointer;">
        <span class="logo-text">Booking</span>
      </div>

      <div class="user-actions">
        <template v-if="authStore.loggedInUser">
          <span style="margin-right: 10px;">안녕하세요, {{ authStore.loggedInUser }}님</span>
          <button class="logout" @click="logout">로그아웃</button>
        </template>

        <template v-else>
          <button class="signup" @click.prevent="goRegister">회원 가입</button>
          <router-link to="/login">
            <button class="login">로그인</button>
          </router-link>
        </template>

        <button class="signup" @click="goAdmin">admin</button>
        <router-link to="/cart">
          <i class="fa-solid fa-cart-shopping cart-icon"></i>
        </router-link>
        <router-link to="/my-page">
          <i class="fa-solid fa-bars my-page-icon"></i>
        </router-link>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* 기존 스타일 유지 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  border-bottom: 1px solid #ccc;
}
.logo .logo-text {
  font-size: 32px;
  font-weight: bold;
  color: #007bff;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-family: 'Arial', sans-serif;
}
.user-actions button {
  padding: 10px 20px;
  margin: 0 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
  border-radius: 25px !important;
}
.user-actions button:hover {
  background-color: #f4f4f4 !important;
}
.user-actions .register, .user-actions .signup {
  border: 1px solid #007bff !important;
  color: #007bff !important;
  background-color: transparent !important;
}
.user-actions .register:hover, .user-actions .signup:hover {
  background-color: #007bff !important;
  color: white !important;
}
.user-actions .login {
  border: none !important;
  background-color: transparent !important;
  color: #333 !important;
}
.user-actions .login:hover {
  background-color: #f4f4f4 !important;
}
.user-actions .cart-icon {
  font-size: 24px;
  color: #ffbc00 !important;
  cursor: pointer;
}
.user-actions .cart-icon:hover {
  opacity: 0.8;
}
.user-actions .my-page-icon {
  font-size: 24px;
  color: #007bff !important;
  cursor: pointer;
}
.user-actions .my-page-icon:hover {
  opacity: 0.8;
}
.user-actions .logout {
  border: 1px solid #dc3545 !important;
  color: #dc3545 !important;
  background-color: transparent !important;
}
.user-actions .logout:hover {
  background-color: #dc3545 !important;
  color: white !important;
}
.user-actions button:focus {
  outline: none;
}
</style>
