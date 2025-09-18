<template>
  <div class="test-container">
    <h1>네이버 로그인 테스트 페이지</h1>
    <p>아래에 네이버 로그인 버튼이 보여야 합니다.</p>
    <div id="naverIdLogin"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  console.log("NaverTest.vue가 마운트되었습니다. 네이버 로그인을 초기화합니다.");

  const initializeNaverLogin = () => {
    if (window.naver && window.naver.LoginWithNaverId) {
      console.log("네이버 SDK 로드 확인됨. init()을 호출합니다.");
      const naverLogin = new window.naver.LoginWithNaverId({
          clientId: "YOUR_CLIENT_ID", // 👈 본인의 CLIENT ID
          callbackUrl: "http://localhost:5173/naver-callback", // 👈 본인의 Callback URL
          isPopup: false,
          loginButton: { color: "green", type: 3, height: 50 }
      });
      naverLogin.init();
      console.log("naverLogin.init() 호출 완료.");
    } else {
      console.log("네이버 SDK 로딩 중... 100ms 후 재시도.");
      setTimeout(initializeNaverLogin, 100);
    }
  };
  
  initializeNaverLogin();
});
</script>

<style scoped>
.test-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 20px;
}
</style>