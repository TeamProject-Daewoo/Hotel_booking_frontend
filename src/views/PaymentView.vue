<template>
  <div class="payment-container">
    <div v-if="reservation" class="info-box">
      <h2>결제 정보 확인</h2>
      <p><strong>예약 숙소:</strong> {{ reservation.hotelName || '숙소 정보 로딩 중...' }}</p>
      <p><strong>예약자:</strong> {{ reservation.customerName || '고객 정보 로딩 중...' }}</p>
      <p class="price"><strong>결제 금액:</strong> {{ reservation.totalPrice?.toLocaleString() || 0 }}원</p>
    </div>
    <div v-else class="loading-box">
      <p>예약 정보를 불러오는 중입니다...</p>
    </div>

    <div id="payment-widget" style="width: 100%"></div>
    <div id="agreement" style="width: 100%"></div>

    <button
        class="payment-button"
        @click="requestPayment"
        :disabled="!isReady"
    >
      결제하기
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import apiClient from '@/api/axios'; // 설정해둔 Axios 인스턴스

// --- 상태 관리 ---
const route = useRoute();
const reservation = ref(null); // 서버에서 가져온 예약 정보
const widgets = ref(null); // 토스 위젯 인스턴스
const isReady = ref(false); // 위젯 렌더링 완료 여부

// --- 토스페이먼츠 클라이언트 키 ---
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

// --- 라이프사이클 훅 ---
onMounted(async () => {
  // 1. 라우터 파라미터에서 예약 ID 가져오기
  const reservationId = route.params.reservationId;
  if (!reservationId) {
    alert("예약 ID가 올바르지 않습니다.");
    return;
  }

  try {
    // 2. 서버에서 예약 정보 조회 (가상의 API 엔드포인트)
    const response = await apiClient.get(`/api/reservations/${reservationId}`);
    reservation.value = response.data;

    // 3. 토스페이먼츠 위젯 초기화 및 렌더링
    await initializeWidgets();

  } catch (error) {
    console.error("예약 정보를 불러오는 데 실패했습니다.", error);
    alert("예약 정보를 불러올 수 없습니다.");
  }
});

// --- 메서드 ---
const initializeWidgets = async () => {
  // TossPayments 객체 생성
  const tossPayments = TossPayments(clientKey);

  // 위젯 인스턴스 생성
  // customerKey는 예약 ID나 사용자 ID 같이 고유한 값으로 설정합니다.
  widgets.value = tossPayments.widgets({
    customerKey: `user-${reservation.value.userId}-res-${reservation.value.reservationId}`,
  });

  // 결제 금액 설정 (DB에서 가져온 totalPrice 사용)
  await widgets.value.setAmount({
    currency: "KRW",
    value: reservation.value.totalPrice,
  });

  // 결제 UI와 약관 UI 렌더링
  await Promise.all([
    widgets.value.renderPaymentMethods({
      selector: "#payment-widget",
      variantKey: "DEFAULT",
    }),
    widgets.value.renderAgreement({
      selector: "#agreement",
      variantKey: "AGREEMENT",
    }),
  ]);

  // 모든 준비가 끝나면 결제 버튼 활성화
  isReady.value = true;
};

const requestPayment = async () => {
  if (!widgets.value || !reservation.value) {
    alert("결제 정보를 초기화하는 중입니다. 잠시 후 다시 시도해주세요.");
    return;
  }

  try {
    // 결제 요청
    await widgets.value.requestPayment({
      orderId: String(reservation.value.reservationId), // reservation_id를 orderId로 사용
      orderName: reservation.value.hotelName, // 실제 주문 이름
      successUrl: `${window.location.origin}/payment-success`, // 성공 시 리다이렉트될 URL
      failUrl: `${window.location.origin}/payment-fail`,   // 실패 시 리다이렉트될 URL
      customerName: reservation.value.customerName,
      customerEmail: reservation.value.customerEmail,
    });
  } catch (error) {
    console.error("결제 요청에 실패했습니다.", error);
    alert("결제 요청 중 오류가 발생했습니다.");
  }
};
</script>

<style scoped>
.payment-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.info-box {
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
}
.price {
  font-size: 1.2em;
  font-weight: bold;
  color: #333;
}
.loading-box {
  text-align: center;
  padding: 40px;
}
.payment-button {
  padding: 15px;
  border-radius: 8px;
  background-color: #007bff;
  color: white;
  border: none;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}
.payment-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.payment-button:hover:not(:disabled) {
  background-color: #0056b3;
}
</style>