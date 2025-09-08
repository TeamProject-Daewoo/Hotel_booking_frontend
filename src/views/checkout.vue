<template>
  <div>
    <div>
      <input type="checkbox" id="coupon-box" v-model="isCouponApplied" />
      <label for="coupon-box"> 5,000원 쿠폰 적용 </label>
    </div>

    <div id="payment-method"></div>

    <div id="agreement"></div>

    <button @click="requestPayment" class="button" style="margin-top: 30px">
      결제하기
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const isCouponApplied = ref(false);
const widgets = ref(null);
const baseAmount = 100;
const couponAmount = 10;

onMounted(async () => {
  const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
  const customerKey = "2GFsDORY6U2oRDSbtsrq5";

  const tossPayments = TossPayments(clientKey);

  widgets.value = tossPayments.widgets({
    customerKey,
  });

  await widgets.value.setAmount({
    currency: "KRW",
    value: baseAmount,
  });

  await Promise.all([
    widgets.value.renderPaymentMethods({
      selector: "#payment-method",
      variantKey: "DEFAULT",
    }),
    widgets.value.renderAgreement({
      selector: "#agreement",
      variantKey: "AGREEMENT"
    }),
  ]);
});

watch(isCouponApplied, async (newValue) => {
  const amountToSet = newValue ? baseAmount - couponAmount : baseAmount;
  if (widgets.value) {
    await widgets.value.setAmount({
      currency: "KRW",
      value: amountToSet,
    });
  }
});

const requestPayment = async () => {
  if (widgets.value) {
    try {
      await widgets.value.requestPayment({
        orderId: "_dTJzRgh4SMNgl9BUWbH7",
        orderName: "토스 티셔츠 외 2건",
        successUrl: window.location.origin + "/success",
        failUrl: window.location.origin + "/fail",
        customerEmail: "customer123@gmail.com",
        customerName: "김토스",
        customerMobilePhone: "01012341234",
      });
    } catch (error) {
      console.error("결제 요청 실패:", error);
    }
  }
};
</script>