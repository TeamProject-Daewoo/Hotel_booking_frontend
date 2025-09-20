<template>
    <div>
      <p>안전하게 로그아웃 처리 중입니다...</p>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/api/auth';
  import api from '@/api/axios';
  import { nextTick } from 'vue';
  
  const router = useRouter();
  const authStore = useAuthStore();
  
  onMounted(async () => {
    // 카카오 로그아웃 후 돌아왔을 때, 우리 서비스의 최종 로그아웃 절차를 실행
    try {
      authStore.logout(); // Pinia 스토어의 Access Token 및 사용자 정보 삭제
      await api.post('/api/auth/logout'); // 우리 서버에 요청하여 Refresh Token 쿠키 삭제

      await nextTick();

      alert('로그아웃되었습니다.');
    } catch (error) {
      console.error('최종 로그아웃 처리 실패:', error);
    } finally {
      router.push('/');
    }
  });
  </script>