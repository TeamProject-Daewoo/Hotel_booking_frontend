<template>
  <div class="callback-container">
    <p>카카오 로그인을 처리 중입니다. 잠시만 기다려주세요...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/api/auth';
import api from '@/api/axios';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  // URL의 쿼리 파라미터에서 'code' (인가 코드)를 추출합니다.
  const authorizationCode = route.query.code;
  
  if (!authorizationCode) {
    alert('카카오 로그인에 실패했습니다. (인증 코드 없음)');
    router.push('/loginview');
    return;
  }

  console.log(authorizationCode)

  // 추출한 인가 코드를 우리 백엔드 서버로 보내서 로그인 처리를 요청합니다.
  handleKakaoBackendLogin(authorizationCode);
});

const handleKakaoBackendLogin = async (code) => {
  try {
    // 우리 백엔드에 인가 코드를 보내고, 우리 서비스의 JWT를 받아옵니다.
    const response = await api.post('/api/auth/kakao-login', { code });
    console.log('로그인 보냄')
    // 우리 서비스의 Access Token을 Pinia에 저장합니다. (Refresh Token은 서버가 쿠키로 설정)
    console.log("카카오 콜백", response.data.accessToken)
    authStore.setToken(response.data.accessToken);
    console.log('저장완료')
    alert('카카오 계정으로 로그인되었습니다.');
    router.push('/'); // 로그인 성공 후 메인 페이지로 이동

  } catch (error) {
    console.error('카카오 백엔드 로그인 실패:', error);
    alert('로그인 처리 중 오류가 발생했습니다.');
    router.push('/register-choice');
  }
};
</script>

<style scoped>
.callback-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
}
</style>