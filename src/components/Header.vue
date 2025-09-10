<template>
  <header>
    <div class="navbar">
      <div class="logo" @click="goHome" style="cursor: pointer;">
        <span class="logo-text">Booking</span>
      </div>

      <div class="user-actions">
        <button class="signup" @click.prevent="goRegister">회원 가입</button>
        <router-link to="/login"><button class="login">로그인</button></router-link>
        <!-- 어드민 버튼: 클릭 시 외부 포트로 이동 -->
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

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

function goHome() {
  router.push('/');
}

function goRegister() {
  router.push('/register');
}

// 외부 포트(5174)로 이동하는 함수
function goAdmin() {
  window.location.href = 'http://localhost:5174';
}
</script>

<style scoped>
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
.user-actions .register,
.user-actions .signup {
  border: 1px solid #007bff !important;
  color: #007bff !important;
  background-color: transparent !important;
}
.user-actions .register:hover,
.user-actions .signup:hover {
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
.user-actions button:focus {
  outline: none;
}
</style>
