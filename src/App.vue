<script setup>
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router'; // useRoute 추가
import Footer from './components/Footer.vue';
import Header from './components/Header.vue';
import { useAuthStore } from './api/auth';
import api from './api/axios';

const authStore = useAuthStore();
const route = useRoute(); // 현재 라우트 정보를 가져옵니다.

const headerStyle = computed(() => ({
  height: route.path === '/' ? '0px' : '80px'
}));


onMounted(async () => {
    // 👇 현재 URL 경로를 확인하는 조건을 추가합니다.
    const currentPath = window.location.pathname;
    if (currentPath.includes('/logout-callback') || currentPath.includes('/naver-callback')) {
        // 소셜 로그인 콜백 경로에서는 자동 로그인을 실행하지 않습니다.
        // 콜백 컴포넌트가 로그인 처리를 책임집니다.
        console.log('소셜 로그인 콜백 경로이므로 자동 로그인을 건너뜁니다.');
        authStore.setInitialized(); // 다른 페이지들의 로딩을 위해 초기화는 완료된 것으로 처리
        return; // 여기서 함수를 종료
    }

    // 기존의 자동 로그인 로직 (콜백 경로가 아닐 때만 실행됩니다)
    if (!authStore.isInitialized) {
        const response = await api.post('/api/auth/refresh');
      authStore.setToken(response.data.accessToken);
    }
});
</script>

<template>
  <div class="container">
    <header class="header-container" :style="headerStyle">
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
  transition: height 0.5s ease-in-out;
}
.footer-container {
  min-height: 300px;
}
</style>