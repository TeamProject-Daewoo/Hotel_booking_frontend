<template>
  <div class="choice-container">
    <div class="choice-box">
      <h1>회원가입</h1>
      <p class="subtitle">가입 방식을 선택해주세요.</p>
      
      <div class="button-group">
        <router-link to="/register" class="choice-button email-button">
          <i class="icon-email">📧</i>
          <span>이메일로 회원가입</span>
        </router-link>

        <button @click="handleKakaoLogin" class="choice-button kakao-button">
          <i class="icon-kakao"></i>
          <span>카카오로 회원가입</span>
        </button>
      </div>

      <div class="login-link">
        <p>이미 계정이 있으신가요? <router-link to="/loginview">로그인</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

// 1. 카카오 SDK 초기화
const initializeKakaoSdk = () => {
  if (window.Kakao && !window.Kakao.isInitialized()) {
    // 
    window.Kakao.init(''); // 👈 카카오 개발자 사이트의 JavaScript 키
    console.log('카카오 SDK가 초기화되었습니다.');
  } 
};

onMounted(() => {
  initializeKakaoSdk();
});

// 2. 카카오 로그인 실행 함수
const handleKakaoLogin = () => {
  if (!window.Kakao) {
    alert("카카오 SDK가 로드되지 않았습니다.");
    return;
  }
  
  window.Kakao.Auth.authorize({
    redirectUri: 'http://localhost:5173/kakao-callback', // 👈 다음 단계에서 만들 콜백 경로
  });
};
</script>

<style scoped>
.choice-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f6f9;
}
.choice-box {
  width: 100%;
  max-width: 420px;
  padding: 40px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
}
h1 {
  margin-bottom: 10px;
  font-size: 28px;
}
.subtitle {
  color: #666;
  margin-bottom: 30px;
}
.button-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}
.choice-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 50px;
  border-radius: 5px;
  text-decoration: none;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.2s;
}
.email-button {
  background-color: #555;
  color: white;
  border: 1px solid #555;
}
.email-button:hover {
  background-color: #333;
}
.icon-email {
  margin-right: 10px;
}
.naver-button-container {
  line-height: 0; /* 네이버 버튼 이미지 주변의 불필요한 공백 제거 */
}
.login-link {
  margin-top: 30px;
  font-size: 14px;
}
.login-link a {
  color: #007bff;
  font-weight: bold;
  text-decoration: none;
}

.kakao-button {
  background-color: #FEE500;
  color: #191919;
  border: 1px solid #FEE500;
}
.kakao-button:hover {
  background-color: #f7d900;
}
.icon-kakao {
  width: 24px; /* 카카오 아이콘 크기 */
  height: 22px;
  margin-right: 8px;
  background-image: url('https://developers.kakao.com/tool/resource/static/img/button/kakaotalk.svg');
  background-size: cover;
}
</style>
