<template>
  <div class="profile-wrapper">
    <div class="profile-card" v-if="user">
      <h1>내 정보</h1>
      <div class="info-grid">
        <div class="info-item">
          <label>아이디</label>
          <p>{{ user.username }}</p>
        </div>
        <div class="info-item">
          <label>이름</label>
          <p>{{ user.name }}</p>
        </div>
        <div class="info-item">
          <label>이메일</label>
          <p>{{ user.email }}</p>
        </div>
        <div class="info-item">
          <label>휴대폰 번호</label>
          <p>{{ user.phoneNumber || '등록되지 않음' }}</p>
        </div>
      </div>
      <button @click="handleLogout" class="logout-button">로그아웃</button>
    </div>
    <div v-else>
      <p>사용자 정보를 불러오는 중입니다...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/axios'; // 설정해둔 axios 인스턴스
import { useAuthStore } from '@/api/auth';

const user = ref(null);
const router = useRouter();
const authStore = useAuthStore();

// 컴포넌트가 마운트될 때 사용자 정보를 가져오는 함수
const fetchUserInfo = async () => {
  try {
    const response = await api.get('/api/user/me'); // 내 정보 조회 API 호출
    user.value = response.data;
  } catch (error) {
    console.error('사용자 정보 조회 실패:', error);
    alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
    router.push('/login');
  }
};

// 로그아웃 처리 함수
const handleLogout = async () => {
    try {
        // 서버에 로그아웃 요청을 보내 쿠키를 삭제
        await api.post('/api/auth/logout');
        
        // Pinia 스토어의 Access Token 삭제
        authStore.clearToken();
        
        alert('로그아웃되었습니다.');
        router.push('/login');
    } catch (error) {
        console.error('로그아웃 실패:', error);
    }
};

watch(
  () => authStore.isInitialized,
  (isInitialized) => {
    // 초기화가 완료되었을 때 (isInitialized가 true가 되면) 사용자 정보를 가져옴
    if (isInitialized) {
      fetchUserInfo();
    }
  },
  { immediate: true } // immediate: true 옵션으로 컴포넌트 로드 시 즉시 한번 실행
);
</script>

<style scoped>
.profile-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f6f9;
}
.profile-card {
  width: 100%;
  max-width: 600px;
  padding: 40px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
h1 {
  text-align: center;
  margin-bottom: 30px;
}
.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}
.info-item {
  text-align: left;
}
.info-item label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}
.info-item p {
  font-size: 18px;
  font-weight: 500;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 5px;
  margin: 0;
}
.logout-button {
  width: 100%;
  margin-top: 30px;
  padding: 12px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}
</style>