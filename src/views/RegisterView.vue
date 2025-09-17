<template>
  <div class="auth-wrapper reverse">
    <div class="form-container">
      <div class="form-content">
        <h1>Sign up</h1>
        <p class="subtitle">회원가입</p>

        <form @submit.prevent="handleRegister">
          <div class="input-group">
            <label for="name">사용자 이름</label>
            <input type="text" id="name" v-model="formData.name" placeholder="이름을 입력하세요" required />
          </div>

          <div class="input-group">
            <label for="user_name">아이디</label>
            <input type="text" id="user_name" v-model="formData.username" placeholder="사용할 아이디를 입력하세요" required />
          </div>

          <div class="input-group">
            <label for="email">이메일</label>
            <div class="input-with-button">
              <input type="email" id="email" v-model="formData.email" placeholder="이메일 주소를 입력하세요" :disabled="isEmailVerified" required />
              <button type="button" @click="sendVerificationCode" :disabled="isEmailVerified || !formData.email" class="inline-button">
                {{ isEmailVerified ? '인증완료' : '인증번호 발송' }}
              </button>
            </div>
          </div>

          <div v-if="isCodeSent && !isEmailVerified" class="input-group">
  <label for="verificationCode">인증번호</label>
  <div class="input-with-button">
    <input type="text" id="verificationCode" v-model="verificationCode" placeholder="받으신 인증번호를 입력하세요" required />
    <button type="button" @click="verifyCode" class="inline-button">인증번호 확인</button>
  </div>
  <p v-if="verificationMessage" :class="verificationMessageType === 'success' ? 'success-text' : verificationMessageType === 'error' ? 'error-text' : 'info-text'">
    {{ verificationMessage }}
  </p>
</div>

          <div class="input-group">
            <label for="phone">휴대폰 번호</label>
            <input type="tel" id="phone" v-model="formData.phoneNumber" placeholder="'-' 없이 숫자만 입력하세요" required />
          </div>

          <div class="input-group">
            <label for="password">비밀번호</label>
            <input type="password" id="password" v-model="formData.password" placeholder="비밀번호를 입력하세요" required />
          </div>

          <div class="input-group">
            <label for="confirmPassword">비밀번호 확인</label>
            <input type="password" id="confirmPassword" v-model="formData.confirmPassword" placeholder="비밀번호를 다시 입력하세요" required />
            <p v-if="formData.confirmPassword" :class="passwordsMatch ? 'success-text' : 'error-text'">
              {{ passwordsMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.' }}
            </p>
          </div>

          <div class="options">
             <div class="remember-me">
              <input type="checkbox" id="agree" v-model="formData.agree" />
              <label for="agree">동의하기</label>
            </div>
          </div>

          <button type="submit" class="auth-button" :disabled="!isFormValid">계정 생성</button>
        </form>

         <div class="switch-auth">
           <p>이미 계정이 있으신가요? <router-link to="/loginview">로그인</router-link></p>
        </div>
      </div>
    </div>
    <div class="image-container">
      <img src="https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1925&q=80" alt="Hotel pool view" />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/axios';

const router = useRouter();
const formData = reactive({
  name: '',
  username: '', // DTO와 일관성을 위해 user_name -> username으로 변경
  email: '',
  phoneNumber: '', // DTO와 일관성을 위해 phone -> phoneNumber로 변경
  password: '',
  confirmPassword: '',
  agree: false,
  role: 'USER',
});

const verificationCode = ref('');
const isCodeSent = ref(false);
const isEmailVerified = ref(false);
const verificationMessage = ref('');
const verificationMessageType = ref('info'); // 'info', 'success', 'error'

// ... passwordsMatch, isFormValid computed 속성은 그대로 ...

// 이메일 인증번호 발송 함수
const sendVerificationCode = async () => {
  verificationMessageType.value = 'info'; // 메시지 타입 초기화
  verificationMessage.value = '인증번호를 발송 중입니다...';
  try {
    await api.post('/api/auth/send-verification', { email: formData.email });
    isCodeSent.value = true;
    verificationMessage.value = '인증번호가 발송되었습니다. 이메일을 확인해주세요.';
  } catch (error) {
    verificationMessageType.value = 'error';
    verificationMessage.value = error.response?.data || '인증번호 발송에 실패했습니다.';
  }
};

// 인증번호 확인 함수
const verifyCode = async () => {
  try {
    await api.post('/api/auth/verify-code', { email: formData.email, code: verificationCode.value });
    isEmailVerified.value = true;
    
    // 👇 성공 메시지 및 타입 변경
    verificationMessage.value = '인증되었습니다!';
    verificationMessageType.value = 'success';

  } catch (error) {
    console.error('인증번호 확인 실패:', error);
    
    // 👇 실패 메시지 및 타입 변경
    verificationMessage.value = error.response?.data || '인증번호가 올바르지 않습니다.';
    verificationMessageType.value = 'error';
  }
};

const handleRegister = async () => {
  if (!isFormValid.value) {
    alert('입력 양식을 모두 올바르게 채워주세요.');
    return;
  }
  
  try {
    // DTO에 정의된 필드명과 일치시켜서 전송
    await api.post('/api/auth/sign-up', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        role: formData.role
    });

    alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
    router.push('/loginview');

  } catch (error) {
    console.error('회원가입 실패:', error);
    alert(error.response?.data || '회원가입 중 오류가 발생했습니다.');
  }
};
</script>

<style scoped>
/* 스타일 코드는 이전 답변과 동일하게 유지됩니다. */
.input-with-button { display: flex; gap: 10px; }
.input-with-button input { flex-grow: 1; }
.inline-button { padding: 0 15px; border-radius: 5px; border: 1px solid #ccc; background-color: #f0f0f0; cursor: pointer; white-space: nowrap; }
.inline-button:disabled { cursor: not-allowed; background-color: #e9ecef; color: #adb5bd; }
.success-text { color: green; /* ... */ }
.error-text { color: red; /* ... */ }
.info-text { /* 기본 안내 메시지 스타일 */
  font-size: 12px;
  margin-top: 5px;
  color: #007bff;
}
.verification-message { font-size: 12px; margin-top: 5px; color: #007bff; }
.auth-wrapper.reverse { flex-direction: row-reverse; }
.auth-wrapper { display: flex; min-height: 100vh; font-family: 'Helvetica Neue', Arial, sans-serif; }
.form-container { flex: 1; display: flex; justify-content: center; align-items: center; padding: 40px; background-color: #fff; }
.form-content { width: 100%; max-width: 420px; }
.image-container { flex: 1; position: relative; display: flex; justify-content: center; align-items: center; background-color: #f0f0f0; }
.image-container img { width: 85%; height: 85%; object-fit: cover; border-radius: 20px; }
h1 { font-size: 32px; font-weight: bold; margin-bottom: 8px; }
.subtitle { font-size: 16px; color: #666; margin-bottom: 30px; }
.input-group { margin-bottom: 20px; }
.input-group label { display: block; font-size: 14px; color: #333; margin-bottom: 8px; }
.input-group input { width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; box-sizing: border-box; }
.options { display: flex; justify-content: flex-start; align-items: center; font-size: 14px; margin-bottom: 25px; }
.remember-me { display: flex; align-items: center; }
.remember-me input { margin-right: 8px; }
.remember-me label { color: #555; text-decoration: none; }
.auth-button { width: 100%; padding: 15px; background-color: #68C9B4; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; transition: background-color 0.2s; }
.auth-button:hover { background-color: #57b3a0; }
.switch-auth { text-align: center; margin-top: 20px; font-size: 14px; }
.switch-auth a { color: #68C9B4; font-weight: bold; text-decoration: none; }
.switch-auth a:hover { text-decoration: underline; }
.dots { position: absolute; bottom: 5%; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; }
.dot { width: 8px; height: 8px; background-color: #ccc; border-radius: 50%; }
.dot.active { background-color: #fff; }
</style>