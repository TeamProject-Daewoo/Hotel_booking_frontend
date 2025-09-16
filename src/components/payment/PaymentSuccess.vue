<template>
  <div class="status-container">
    <h1>{{ message }}</h1>
    <div v-if="errorInfo">
      <p>에러 코드: {{ errorInfo.code }}</p>
      <p>에러 메시지: {{ errorInfo.message }}</p>
    </div>
    <router-link to="/" v-if="!isLoading">홈으로 돌아가기</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// import api from '@/api/axios';
import { useAuthStore } from '@/api/auth';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const message = ref('결제를 승인하고 있습니다. 잠시만 기다려주세요...');
const errorInfo = ref(null);
const isLoading = ref(true);

onMounted(async () => {
  // authStore의 초기화가 완료될 때까지 기다리는 로직 추가
  if (!authStore.isInitialized) {
    await new Promise(resolve => {
      const unwatch = watch(() => authStore.isInitialized, (isInitialized) => {
        if (isInitialized) {
          unwatch();
          resolve();
        }
      });
    });
  }

  const { paymentKey, orderId: tossOrderId, amount: rawAmount } = route.query;

  if (!paymentKey || !tossOrderId || !rawAmount) {
    message.value = "결제 정보가 올바르지 않습니다.";
    isLoading.value = false;
    return;
  }

  const reservationId = tossOrderId.split('_')[0];
  const amount = Array.isArray(rawAmount) ? rawAmount[0] : rawAmount;

  try {
    console.log("confirm실행");
    const response = await axios.post('/api/payment/confirm', {
      paymentKey: paymentKey,
      reservationId: Number(reservationId),
      amount: Number(amount),
      orderId: tossOrderId
    });

    if (response.status === 200) {
      message.value = '결제가 성공적으로 완료되었습니다!';
      setTimeout(() => {
        router.push(`/reservation-complete/${reservationId}`);
      }, 3000);
    }

  } catch (error) {
    console.error("결제 승인 실패:", error);
    message.value = '결제 승인에 실패했습니다.';
    errorInfo.value = error.response?.data || { code: 'UNKNOWN', message: '알 수 없는 오류' };
  } finally {
    isLoading.value = false;
  }
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
</style>