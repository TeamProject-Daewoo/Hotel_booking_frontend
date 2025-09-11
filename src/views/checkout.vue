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
import { useRoute } from 'vue-router';

// 상태 변수
const isCouponApplied = ref(false);
const widgets = ref(null);
const couponAmount = 5000; // 쿠폰 금액

// 라우트로부터 받을 데이터
const route = useRoute();
const reservationId = ref('');
const orderName = ref('');
const amount = ref(0);
const customerName = ref('');
const customerEmail = ref('');
const customerMobilePhone = ref('');


onMounted(async () => {
  // 1. 라우트 쿼리에서 예약 정보 추출
  reservationId.value = route.query.reservationId || '';
  orderName.value = route.query.orderName || '주문 정보 없음';
  amount.value = Number(route.query.amount) || 0;
  customerName.value = route.query.customerName || '';
  customerEmail.value = route.query.customerEmail || '';
  customerMobilePhone.value = route.query.customerMobilePhone || '';

  // 2. 토스 페이먼츠 위젯 초기화
  const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
  const customerKey = reservationId.value; // 고객별로 유니크한 키 사용 (예: 예약 ID)

  const tossPayments = TossPayments(clientKey);

  widgets.value = tossPayments.widgets({
    customerKey,
  });

  // 3. 결제 금액 설정
  await widgets.value.setAmount({
    currency: "KRW",
    value: amount.value,
  });

  // 4. 위젯 렌더링
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

// 쿠폰 적용 여부에 따라 결제 금액 동적 변경
watch(isCouponApplied, async (newValue) => {
  const amountToSet = newValue ? amount.value - couponAmount : amount.value;
  if (widgets.value) {
    await widgets.value.setAmount({
      currency: "KRW",
      value: amountToSet,
    });
  }
});

// 결제 요청
const requestPayment = async () => {
  if (widgets.value) {
    try {
      await widgets.value.requestPayment({
        orderId: `${reservationId.value}_${new Date().getTime()}`, // 매번 고유한 주문번호 생성
        orderName: orderName.value,
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
        customerEmail: customerEmail.value,
        customerName: customerName.value,
        customerMobilePhone: customerMobilePhone.value,
      });
    } catch (error) {
      console.error("결제 요청 실패:", error);
    }
  }
};
</script>