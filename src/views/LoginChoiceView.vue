
<template>
  <div class="choice-container">
    <div class="choice-box">
      <h1>로그인</h1>
      <p class="subtitle">로그인 방식을 선택해주세요.</p>

      <div class="button-group">
        <router-link to="/login" class="choice-button email-button">
          <i class="icon-email">📧</i>
          <span>이메일로 로그인</span>
        </router-link>

        <button @click="handleKakaoLogin" class="choice-button kakao-button">
          <i class="icon-kakao"></i>
          <span>카카오로 로그인</span>
        </button>
      </div>

      <div class="register-link">
        <p>아직 회원이 아니신가요? <router-link to="/register-choice">회원가입</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useUiStore } from '@/store/commonUiStore';

const uiStore = useUiStore();

const KAKAO_JAVASCRIPT_KEY = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;
const VITE_HOMPAGE_MAIN = import.meta.env.VITE_HOMPAGE_MAIN;

// 카카오 SDK 초기화
const initializeKakaoSdk = () => {
  if (window.Kakao && !window.Kakao.isInitialized()) {
    window.Kakao.init(KAKAO_JAVASCRIPT_KEY); // 👈 본인의 JavaScript 키 입력
    console.log('카카오 SDK가 초기화되었습니다.');
  }
};

onMounted(() => {
  initializeKakaoSdk();
});

// 카카오 로그인 실행 함수
const handleKakaoLogin = () => {
  if (!window.Kakao || !window.Kakao.isInitialized()) {
      uiStore.openModal({title: '로그인 오류',  message: '로그인 처리 중 오류가 발생했습니다.'});
    return;
  }

  window.Kakao.Auth.authorize({
    redirectUri: `${VITE_HOMPAGE_MAIN}/kakao-callback`,
  });
};
</script>

<style scoped>
/* 스타일은 RegisterChoiceView.vue와 거의 동일합니다. */
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
  cursor: pointer;
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
.register-link { /* login-link -> register-link로 이름 변경 */
  margin-top: 30px;
  font-size: 14px;
}
.register-link a {
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
  width: 24px;
  height: 22px;
  margin-right: 8px;
  background-image: url('https://developers.kakao.com/tool/resource/static/img/button/kakaotalk.svg');
  background-size: cover;
}
</style>
