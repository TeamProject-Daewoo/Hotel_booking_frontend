<template>
    <div class="container">
      <div class="content-box">
        <h1>가입 정보 확인</h1>
        <div class="error-info-box">
          <p>{{ message }}</p>
          <p v-if="loginType" class="login-type">
            가입 방식: 
            <span :class="loginTypeClass">{{ loginTypeDisplay }}</span>
          </p>
        </div>
        <div class="button-group">
          <router-link to="/login-choice" class="action-button primary">로그인하러 가기</router-link>
          <button @click="goBack" class="action-button secondary">이전으로</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const message = ref('해당 이메일로 가입된 계정이 있습니다.');
  const loginType = ref('');
  
  // 페이지가 로드될 때, 라우터의 state로부터 에러 정보를 가져옴
  onMounted(() => {
    const errorInfo = history.state.errorInfo;
    if (errorInfo) {
      message.value = errorInfo.message || message.value;
      loginType.value = errorInfo.loginType || '이메일';
    }
  });
  
  // loginType에 따라 표시될 텍스트와 클래스를 계산
  const loginTypeDisplay = computed(() => {
    if (loginType.value.toUpperCase() === 'KAKAO') return '카카오';
    return '이메일';
  });
  
  const loginTypeClass = computed(() => {
    if (loginType.value.toUpperCase() === 'KAKAO') return 'kakao-text';
    return 'email-text';
  });
  
  // '이전으로' 버튼 기능
  const goBack = () => {
    router.back();
  };
  </script>
  
  <style scoped>
  .container { display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f4f6f9; }
  .content-box { width: 100%; max-width: 420px; padding: 40px; background-color: white; border-radius: 10px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); text-align: center; }
  h1 { margin-bottom: 20px; font-size: 28px; }
  .error-info-box { margin-bottom: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px; }
  .error-info-box p { margin: 10px 0; font-size: 16px; }
  .login-type { font-weight: 500; }
  .login-type span { font-weight: bold; padding: 3px 6px; border-radius: 4px; }
  .kakao-text { color: #191919; background-color: #FEE500; }
  .email-text { color: white; background-color: #555; }
  .button-group { display: flex; flex-direction: column; gap: 10px; }
  .action-button { display: block; padding: 12px; border-radius: 5px; text-decoration: none; font-size: 16px; font-weight: bold; cursor: pointer; transition: all 0.2s; border: 1px solid; }
  .primary { background-color: #007bff; color: white; border-color: #007bff; }
  .primary:hover { background-color: #0056b3; }
  .secondary { background-color: white; color: #6c757d; border-color: #6c757d; }
  .secondary:hover { background-color: #f8f9fa; }
  </style>