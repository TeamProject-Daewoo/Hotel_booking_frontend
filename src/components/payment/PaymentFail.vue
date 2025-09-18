<template>
  <div class="status-container">
    <h1>결제에 실패했습니다.</h1>
    <div class="error-details">
      <p><strong>에러 코드:</strong> {{ errorCode }}</p>
      <p><strong>실패 사유:</strong> {{ errorMessage }}</p>
    </div>
    <router-link to="/" class="home-link">홈으로 돌아가기</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const errorCode = ref('');
const errorMessage = ref('');

onMounted(() => {
  // URL 쿼리 파라미터에서 에러 정보 추출
  errorCode.value = route.query.code || 'UNKNOWN_ERROR';
  errorMessage.value = route.query.message || '알 수 없는 오류가 발생했습니다.';
});
</script>

<style scoped>
.status-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
  text-align: center;
}
.error-details {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #ffdddd;
  background-color: #fff5f5;
  border-radius: 8px;
  color: #d8000c;
}
.home-link {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.2s;
}
.home-link:hover {
  background-color: #0056b3;
}
</style>