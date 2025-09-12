<script setup>
import { onMounted } from 'vue';
import Footer from './components/Footer.vue';
import Header from './components/Header.vue';
import { useAuthStore } from './api/auth';
import api from './api/axios';

const authStore = useAuthStore();

onMounted(async () => {
    // isInitialized가 false일 때만 (즉, 앱이 처음 로드될 때 한번만) 실행
    if (!authStore.isInitialized) { 
        try {
            const response = await api.post('/api/auth/refresh');
            authStore.setToken(response.data.accessToken);
            console.log('토큰 재발급 성공');
        } catch (error) {
            console.log('자동 로그인 실패. 유효한 리프레시 토큰이 없습니다.');
        } finally {
            authStore.setInitialized();
        }
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
