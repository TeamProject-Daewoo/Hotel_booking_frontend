<script setup>
import { onMounted } from 'vue';
import Footer from './components/Footer.vue';
import Header from './components/Header.vue';
import { useAuthStore } from './api/auth';

const authStore = useAuthStore();

onMounted(async () => {
  // isInitialized가 false일 때만 (즉, 앱이 처음 로드될 때 한번만) 실행
  if (!authStore.isInitialized) {
    // auth.js에 이미 구현된 재발급 로직을 호출
    await authStore.reissueToken();
  }
});
</script>

<template>
  <div class="container">
    <header class="header-container">
      <Header/>
    </header>
    <main class="main-container">
      <router-view/>
    </main>
    <footer class="footer-container">
      <Footer/>
    </footer>
  </div>
</template>

<style scoped>
.header-container {
    height: 100px;
    background-color: rgb(255, 255, 130);
}
.footer-container {
    height: 100px;
    background-color: rgb(219, 255, 165);
}
</style>
