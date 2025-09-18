<template>
  <div class="payment-page-background">
    <div class="payment-container">
      <div class="card info-box" v-if="reservation">
        <h2 class="card-title">결제 정보 확인</h2>
        <div class="info-grid">
          <p><strong>예약 숙소</strong></p>
          <p>{{ reservation.hotelName || '숙소 정보 로딩 중...' }}</p>
          <p><strong>예약자</strong></p>
          <p>{{ reservation.customerName || '고객 정보 로딩 중...' }}</p>
          <p><strong>결제 금액</strong></p>
          <p class="price">{{ reservation.totalPrice?.toLocaleString() || 0 }}원</p>
        </div>
      </div>
      <div v-else class="card loading-box">
        <p>예약 정보를 불러오는 중입니다...</p>
      </div>

      <div class="card">
        <div id="payment-widget"></div>
      </div>
      <div class="card">
        <div id="agreement"></div>
      </div>

      <button
          class="payment-button"
          @click="requestPayment"
          :disabled="!isReady"
      >
        {{ isReady ? `${reservation?.totalPrice?.toLocaleString() || 0}원 결제하기` : '준비 중...' }}
      </button>
    </div>
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
  widgets.value = tossPayments.widgets({
    customerKey: `user-${reservation.value.userId}-res-${reservation.value.reservationId}`,
  });

  // 결제 금액 설정
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

  isReady.value = true;
};

const requestPayment = async () => {
  if (!widgets.value || !reservation.value) {
    alert("결제 정보를 초기화하는 중입니다. 잠시 후 다시 시도해주세요.");
    return;
  }

  try {
    await widgets.value.requestPayment({
      orderId: String(reservation.value.reservationId),
      orderName: reservation.value.hotelName,
      successUrl: `${window.location.origin}/payment-success`,
      failUrl: `${window.location.origin}/payment-fail`,
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
.payment-page-background {
  background-color: #f8f9fa;
  padding: 40px 16px;
  font-family: "Noto Sans KR", system-ui, Arial;
}

.payment-container {
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card {
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0,0,0,.04);
  padding: 24px;
}

.card-title {
  font-weight: 700;
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f3f5;
}

.info-grid {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px;
  font-size: 15px;
}
.info-grid p {
  margin: 0;
  color: #495057;
}
.info-grid p:nth-child(odd) {
  font-weight: 500;
  color: #212529;
}

.price {
  font-size: 16px;
  font-weight: 700;
  color: #2ECC9A;
}

.loading-box {
  text-align: center;
  padding: 40px;
  color: #868e96;
}

.payment-button {
  width: 100%;
  padding: 16px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 16px;
  text-align: center;
  border: none;
  cursor: pointer;
  transition: all .2s;
  background: #2ECC9A;
  color: #fff;
}

.payment-button:disabled {
  background: #ced4da;
  cursor: not-allowed;
}

.payment-button:hover:not(:disabled) {
  background: #27A582;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,.1);
}
</style>