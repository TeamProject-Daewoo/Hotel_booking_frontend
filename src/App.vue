<script setup>
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router'; // useRoute 추가
import Footer from './components/Footer.vue';
import Header from './components/Header.vue';
import { useAuthStore } from './api/auth';
import api from './api/axios';
import { useWishlistStore } from './store/wishlistStore';

const authStore = useAuthStore();
const route = useRoute(); // 현재 라우트 정보를 가져옵니다.

const headerStyle = computed(() => ({
  height: route.path === '/' ? '0px' : '80px'
}));


onMounted(async () => {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/logout-callback') || currentPath.includes('/naver-callback') || currentPath.includes('/kakao-callback')) {
        console.log('소셜 로그인 콜백 경로이므로 자동 로그인을 건너뜁니다.');
        authStore.setInitialized();
        return;
    }

    // 기존의 자동 로그인 로직 (콜백 경로가 아닐 때만 실행됩니다)
    if (!authStore.isInitialized) {
        try {
            // 1. 토큰 재발급 시도
            const response = await api.post('/api/auth/refresh');
            authStore.setToken(response.data.accessToken);
            console.log("토큰 재발급 성공");

            // 2. 토큰 재발급 성공 시에만 찜목록 동기화
            const wishlistStore = useWishlistStore();
            await wishlistStore.fetchWishlist();
            console.log("찜목록 동기화 성공");

        } catch (error) {
            console.log("자동 로그인 실패, 유효한 리프레시 토큰이 없습니다.");
            // 로그인 실패 시 스토어에 남아있을 수 있는 데이터를 깨끗하게 정리
            authStore.logout(); 
        } finally {
            // 성공하든 실패하든, 초기화 작업은 완료되었음을 알림
            authStore.setInitialized();
        }
    }
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