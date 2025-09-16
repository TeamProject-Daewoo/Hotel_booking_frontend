<template>
  <div class="payment-container">
    <h2>결제 진행</h2>
    <div class="info-box">
      <p><strong>주문명:</strong> {{ orderName }}</p>
      <p class="price"><strong>결제금액:</strong> {{ Number(amount).toLocaleString() }}원</p>
    </div>
    <div id="payment-widget"></div>
    <div id="agreement"></div>
    <button @click="requestPayment" :disabled="!isReady" class="payment-button">
      {{ Number(amount).toLocaleString() }}원 결제하기
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const widgets = ref(null);
const isReady = ref(false);

const reservationId = ref(route.query.reservationId);
const orderName = ref(route.query.orderName);
const amount = ref(Number(route.query.amount));

onMounted(async () => {
  console.log("onMounted 실행");
  const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
  const tossPayments = TossPayments(clientKey);

  widgets.value = tossPayments.widgets({
    customerKey: `user-key-${reservationId.value}-${new Date().getTime()}`,
  });

  await widgets.value.setAmount({
    currency: "KRW",
    value: amount.value
  });

  await Promise.all([
    widgets.value.renderPaymentMethods({ selector: "#payment-widget" }),
    widgets.value.renderAgreement({ selector: "#agreement" }),
  ]);

  isReady.value = true;
});

const requestPayment = async () => {
  try {
    console.log("requestPayment 실행");
    await widgets.value.requestPayment({
      orderId: `${reservationId.value}_${new Date().getTime()}`,
      orderName: orderName.value,
      successUrl: `${window.location.origin}/payment-success`,
      failUrl: `${window.location.origin}/payment-fail`,
    });
  } catch (error) {
    console.error("결제 요청 실패:", error);
    alert("결제 요청에 실패했습니다. 다시 시도해주세요.");
  }
};
</script>

<style scoped>
.payment-container { max-width: 600px; margin: 40px auto; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); display: flex; flex-direction: column; gap: 20px; }
.info-box { padding: 15px; border: 1px solid #eee; border-radius: 4px; }
.price { font-size: 1.2em; font-weight: bold; color: #333; }
.payment-button { padding: 15px; border-radius: 8px; background-color: #007bff; color: white; border: none; font-size: 16px; font-weight: bold; cursor: pointer; }
.payment-button:disabled { background-color: #ccc; cursor: not-allowed; }
</style>