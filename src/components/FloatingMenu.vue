<template>
  <div class="floating-container">
    <div class="floating-button" @click="toggleMenu">
      <i :class="isOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
    </div>

    <transition-group name="fade" tag="div" class="menu-items">
      <a v-if="isOpen" key="top" href="#" @click.prevent="scrollToTop" class="menu-item">
        <i class="fas fa-arrow-up"></i>
        <span class="tooltip-text">맨 위로</span>
      </a>
      <router-link v-if="isOpen" key="mypage" to="/mypage" @click="closeMenu" class="menu-item">
        <i class="fas fa-user"></i>
        <span class="tooltip-text">마이페이지</span>
      </router-link>
      <router-link v-if="isOpen" key="coupon" to="/coupon" @click="closeMenu" class="menu-item">
        <i class="fas fa-ticket-alt"></i>
        <span class="tooltip-text">쿠폰함</span>
      </router-link>
      <router-link v-if="isOpen" key="notice" to="/notices" @click="closeMenu" class="menu-item">
        <i class="fas fa-bullhorn"></i>
        <span class="tooltip-text">공지사항</span>
      </router-link>
      <router-link v-if="isOpen" key="inquiry" to="/inquiries" @click="closeMenu" class="menu-item">
        <i class="fas fa-comments"></i>
        <span class="tooltip-text">1:1 문의</span>
      </router-link>
    </transition-group>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const isOpen = ref(false);
const router = useRouter();

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const closeMenu = () => {
  isOpen.value = false;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
  closeMenu();
};

// Font Awesome 아이콘을 사용하기 위해 main.js 또는 App.vue에 CDN 링크를 추가해야 할 수 있습니다.
// 예: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</script>

<style scoped>
.floating-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1050;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
}

.floating-button {
  width: 60px;
  height: 60px;
  background-color: #308c84;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.floating-button:hover {
  background-color: #0056b3;
  transform: scale(1.1);
}

.menu-items {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
}

.menu-item {
  position: relative;
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
  background-color: #ffffff;
  color: #007bff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.menu-item:hover {
  background-color: #007bff;
  color: white;
  transform: scale(1.15);
}

.menu-item:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

.tooltip-text {
  visibility: hidden;
  font-size: 15px;
  width: 80px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  right: 125%;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip-text::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 100%;
  margin-top: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent transparent #333;
}

/* Transition for menu items */
.fade-enter-active, .fade-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}
</style>