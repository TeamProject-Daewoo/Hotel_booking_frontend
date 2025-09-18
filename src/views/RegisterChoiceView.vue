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

        <div id="naverIdLogin" class="naver-button-container"></div>
      </div>

      <div class="login-link">
        <p>이미 계정이 있으신가요? <router-link to="/loginview">로그인</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

// 컴포넌트가 화면에 마운트된 후 네이버 로그인 버튼을 초기화
onMounted(() => {
  // window.naver 객체가 로드될 때까지 기다리는 로직
  const initializeNaverLogin = () => {
    if (window.naver && window.naver.LoginWithNaverId) {
      console.log("네이버 SDK 로드 확인됨. init()을 호출합니다.");
      const naverLogin = new window.naver.LoginWithNaverId({
          clientId: "9kVZs9vSjeS5NmO0ZF8E", // 👈 본인의 CLIENT ID로 변경
          callbackUrl: "http://localhost:5173/naver-callback", // 👈 다음 단계에서 만들 콜백 경로
          isPopup: false, // 팝업 여부
          loginButton: { color: "green", type: 3, height: 50 } // 버튼 디자인
      });
      naverLogin.init();
    } else {
      // 스크립트가 아직 로드되지 않았다면 100ms 후에 다시 시도
      console.log("네이버 SDK 로딩 중... 100ms 후 재시도.");
      setTimeout(initializeNaverLogin, 1000);
    }
  };
  initializeNaverLogin();
});
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
  </style>