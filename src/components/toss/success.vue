<template>
  <div>
    <div v-if="isLoading">
      <h2>결제 승인 중...</h2>
      <p>잠시만 기다려주세요.</p>
    </div>

    <div v-else>
      <div v-if="isSuccess">
        <h2>결제 성공</h2>
        <p>주문번호: {{ orderId }}</p>
        <p>결제 금액: {{ amount }}원</p>
        <p>paymentKey: {{ paymentKey }}</p>
      </div>
      <div v-else>
        <h2>결제 승인 실패</h2>
        <p>오류가 발생했습니다. 다시 시도해주세요.</p>
        <p v-if="errorMessage">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const paymentKey = ref(null);
const orderId = ref(null);
const amount = ref(null);

const isLoading = ref(true);
const isSuccess = ref(false);
const errorMessage = ref('');

onMounted(async () => {
  paymentKey.value = route.query.paymentKey;
  orderId.value = route.query.orderId;
  amount.value = Number(route.query.amount).toLocaleString();

  const requestData = {
    paymentKey: paymentKey.value,
    orderId: orderId.value,
    amount: route.query.amount,
  };

  try {
    const response = await fetch("/confirm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    const json = await response.json();

    if (!response.ok) {
      router.push(`/fail?message=${json.message}&code=${json.code}`);
      return;
    }

    isSuccess.value = true;
  } catch (error) {
    console.error("승인 요청 실패:", error);
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
});
</script>