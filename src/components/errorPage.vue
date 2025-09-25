<template>
  <div class="forbidden-container">
    <div class="forbidden-content">
      <img src="https://i.ibb.co/ccn2vLPb/hotel-logo.png" alt="Hotel Hub Logo" class="logo-image" />

      <h1>잘못된 접근입니다</h1>
      <p class="message">요청하신 페이지에 접근할 수 있는 권한이 없습니다.</p>
      <p class="sub-message">입력하신 주소가 정확한지 확인하시거나, 다른 페이지로 이동해 주세요.</p>

      <div class="button-group">
        <button @click="goBack" class="btn btn-secondary">
          이전 페이지로
        </button>
        <button @click="goToMain" class="btn btn-primary">
          메인으로 돌아가기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  // 이전 기록이 없을 경우 메인으로 이동
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    router.push('/');
  }
};

const goToMain = () => {
  router.push('/');
};
</script>

<style scoped>
/* Google Fonts Noto Sans KR (프로젝트에 맞게 import 필요) */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');

.forbidden-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  background-color: #f4f7f6; /* 부드러운 배경색 */
  font-family: 'Noto Sans KR', sans-serif;
  color: #333;
  text-align: center;
  padding: 20px;
}

.forbidden-content {
  background-color: #ffffff;
  padding: 40px;
  border-radius: 16px; /* 더 둥글게 */
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.07); /* 부드러운 그림자 */
  max-width: 480px;
  width: 100%;
  animation: fadeIn 0.5s ease-in-out; /* 부드러운 등장 효과 */
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo-image {
  width: 120px; /* 로고 크기 축소 */
  margin-bottom: 24px;
}

h1 {
  font-size: 2rem;
  color: #e74c3c; /* 톤 다운된 빨간색 */
  margin-bottom: 12px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.message {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #555;
  font-weight: 500;
}

.sub-message {
  font-size: 0.95rem;
  color: #888;
  margin-top: 8px;
  margin-bottom: 32px;
}

.button-group {
  margin-top: 32px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  letter-spacing: 0.5px;
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background-color: #3498db; /* 세련된 파란색 */
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-secondary {
  background-color: #f0f0f0; /* 밝은 회색 */
  color: #555;
  border: 1px solid #e0e0e0;
}

.btn-secondary:hover {
  background-color: #e9e9e9;
  border-color: #d0d0d0;
}
</style>