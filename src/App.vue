<script setup>
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router'; // useRoute 추가
import Footer from './components/Footer.vue';
import Header from './components/Header.vue';
import { useAuthStore } from './api/auth';
import api from './api/axios';
import { useWishlistStore } from './store/wishlistStore';
import { useHistoryStore } from './store/recentHistoryStore';
import AlertModal from './components/mypage/AlertModal.vue';
import { useUiStore } from './store/commonUiStore';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const route = useRoute(); // 현재 라우트 정보를 가져옵니다.
const historyStore = useHistoryStore();
const uiStore = useUiStore();

const { isModalVisible, modalTitle, modalMessage } = storeToRefs(uiStore);
const { closeModal } = uiStore;

const headerStyle = computed(() => ({
  height: route.path === '/' ? '0px' : '80px'
}));


onMounted(async () => {
  historyStore.loadRecentSearches();
  historyStore.loadViewHistory();

    const currentPath = window.location.pathname;
    if (currentPath.includes('/logout-callback')) {
    console.log('로그아웃 콜백 경로이므로 자동 로그인을 건너뜁니다.');
    const uiStore = useUiStore();
      uiStore.openModal('로그아웃 되었습니다.', '');
    authStore.setInitialized(); // 초기화는 완료된 것으로 처리
    return; // 함수 종료
  }

  if (!authStore.isInitialized) {
    try {
      const response = await api.post('/api/auth/refresh');
      authStore.setToken(response.data.accessToken);
      //찜목록 db동기화
      const wishlistStore = useWishlistStore();
      await wishlistStore.fetchWishlist();

      console.log("토큰 재발급 성공");
    } catch (error) {
      console.log("자동 로그인 실패, 유효한 리프레시 토큰이 없습니다.");
    } finally {
      authStore.setInitialized();
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
    <AlertModal
      v-if="isModalVisible"
      :title="modalTitle"
      :message="modalMessage"
      @close="closeModal" 
    />
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