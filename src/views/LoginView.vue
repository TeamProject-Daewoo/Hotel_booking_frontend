<template>
  <div class="auth-wrapper">
    <div class="form-container">
      <div class="form-content">
        <h1>로그인</h1>
        <p class="subtitle">로그인해주세요</p>

        <form @submit.prevent = "handleLogin">
          <div class="input-group">
            <label for="user_name">이메일</label>
            <input type="text" id="user_name" v-model="user_name" @keydown="preventSpaces" required />
          </div>

          <div class="input-group">
            <label for="password">비밀번호</label>
            <div class="password-wrapper">
              <input :type="passwordFieldType" id="password" v-model="password" @keydown="preventSpaces" required />
              <span class="toggle-password" @click="togglePasswordVisibility">👁️</span>
            </div>
          </div>

          <div class="options">
            <div class="remember-me">
              <input type="checkbox" id="remember" v-model="rememberMe" />
              <label for="remember">비밀번호 기억하기</label>
            </div>
            <a href="#" class="forgot-password">비밀번호를 잊으셨나요?</a>
          </div>

          <div class="recaptcha-wrapper">
            <div 
              id="recaptcha-widget"
              class="g-recaptcha"
              :data-sitekey="recaptchaSiteKey"
              @verify="onRecaptchaVerified"
              @expired="onRecaptchaExpired"
            ></div>
          </div>

          <button type="submit" class="auth-button">로그인</button>
        </form>
        

        <div class="switch-auth">
          <router-link to="/register-choice">회원가입</router-link>
        </div>
      </div>
    </div>
    <div class="image-container">
      <img
        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        alt="Hotel promotional image" />
      <div class="dots">
        <span class="dot active"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>
  </div>
</template>



<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/axios';
import { useAuthStore } from '@/api/auth';
import { useWishlistStore } from '@/store/wishlistStore';
import { useUiStore } from '@/store/commonUiStore';

const user_name = ref('');
const password = ref('');
const rememberMe = ref(false);
const passwordFieldType = ref('password');
const router = useRouter();
const authStore = useAuthStore();
const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const recaptchaToken = ref(null);

// 👇 [추가] 이메일 형식 검증을 위한 정규식 함수
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// 👇 [추가] 스페이스바 입력을 막는 함수
const preventSpaces = (event) => {
  if (event.key === ' ') {
    event.preventDefault();
  }
};

window.onRecaptchaVerified = (token) => {
  recaptchaToken.value = token;
};

// reCAPTCHA가 만료되었을 때 호출될 콜백
window.onRecaptchaExpired = () => {
  recaptchaToken.value = null;
};

const handleLogin = async (e) => {

  const uiStore = useUiStore();

  if (!isValidEmail(user_name.value)) {
    uiStore.openModal({
  title: '올바른 이메일 형식을 입력해주세요.'});
    return;
  }

  if (!recaptchaToken.value) {
    uiStore.openModal({title: 'reCAPTCHA 확인 필요', message: 'reCAPTCHA 확인란을 체크해주세요.'});
    return;
  }

  try {
    const response = await api.post('/api/auth/login', {
      username: user_name.value,
      password: password.value,
      recaptchaToken: recaptchaToken.value
    });
    authStore.setToken(response.data.accessToken);

    //찜목록 db동기화
    const wishlistStore = useWishlistStore();
    await wishlistStore.fetchWishlist();

    //찜목록에서 로그인 페이지로 이동했다면 돌아가기
    const redirectPath = router.currentRoute.value.query.redirect;
    if (redirectPath) {
      router.push(redirectPath);
    } else {
      router.push('/');
    }

  } catch (error) {
    console.error("로그인 실패:", error);

    recaptchaToken.value = null; // 1. 저장된 토큰을 비웁니다.
    if (window.grecaptcha) {
      window.grecaptcha.reset(); // 2. Google reCAPTCHA 위젯을 초기화하여 다시 체크하도록 합니다.
    }

    if (error.response?.status === 429) {
      // 서버가 보낸 'body'의 메시지를 그대로 사용
      uiStore.openModal({title:'로그인 시도 초과', message: '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.'});
    } else {
      uiStore.openModal({title: '로그인 실패', message: '아이디 또는 비밀번호가 올바르지 않습니다.'});
    }
  }
};

const togglePasswordVisibility = () => {
  passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password';
};

onMounted(() => {
  if (window.grecaptcha && window.grecaptcha.render) {
    window.grecaptcha.render('recaptcha-widget', {
      'sitekey' : recaptchaSiteKey,
      'callback' : 'onRecaptchaVerified',
      'expired-callback': 'onRecaptchaExpired'
    });
  }
});

</script>

<style scoped>
/* 기본 레이아웃 */
.auth-wrapper {
  display: flex;
  min-height: 100vh;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.form-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background-color: #fff;
}

.form-content {
  width: 100%;
  max-width: 420px;
}

.image-container {
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
}

.image-container img {
  width: 85%;
  height: 85%;
  object-fit: cover;
  border-radius: 20px;
}

/* 폼 요소 스타일 */
h1 {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.input-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper input {
  padding-right: 40px;
}

.toggle-password {
  position: absolute;
  right: 15px;
  cursor: pointer;
  user-select: none;
}

.name-group {
  display: flex;
  gap: 20px;
}

.name-group .input-group {
  flex: 1;
}

/* 옵션 (비밀번호 찾기, 등) */
.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  margin-bottom: 25px;
}

.remember-me {
  display: flex;
  align-items: center;
}

.remember-me input {
  margin-right: 8px;
}

.remember-me label,
.forgot-password {
  color: #555;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

/* 버튼 및 링크 */
.auth-button {
  width: 100%;
  padding: 15px;
  background-color: #68C9B4;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.auth-button:hover {
  background-color: #57b3a0;
}

.switch-auth {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
}

.switch-auth a {
  color: #68C9B4;
  font-weight: bold;
  text-decoration: none;
}

.switch-auth a:hover {
  text-decoration: underline;
}

/* 이미지 아래 점 */
.dots {
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  background-color: #ccc;
  border-radius: 50%;
}

.dot.active {
  background-color: #fff;
}

.recaptcha-wrapper {
  display: flex; /* Flexbox 사용하여 중앙 정렬 */
  justify-content: center; /* 가로 중앙 정렬 */
  margin: 25px 0; /* 상하 여백 추가 */
  transform: scale(0.95); /* 위젯이 너무 크다면 살짝 축소 */
  transform-origin: center; /* 중앙을 기준으로 축소 */
}
</style>