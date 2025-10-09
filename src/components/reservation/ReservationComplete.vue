<template>
  <div class="complete-page-background">
    <div class="complete-container">
      <div v-if="reservation">
        <div class="confirmation-header">
          <i class="fa-solid fa-circle-check confirmation-icon"></i>
          <h1 class="main-title">예약이 확정되었습니다!</h1>
          <p class="sub-title">예약해주셔서 감사합니다. 즐거운 여행이 되시길 바랍니다.</p>
        </div>

        <div class="card details-box">
    <h3 class="card-title">예약 정보</h3>
    <ReceiptDownload class="receipt-download-btn" />
  <div class="info-grid">
            <p><strong>예약 번호</strong></p><p>{{ reservation.reservationId }}</p>
            <p><strong>숙소 이름</strong></p><p>{{ reservation.hotelName }}</p>
            <p><strong>예약자 이름</strong></p><p>{{ reservation.customerName || '정보 없음' }}</p>
            <p><strong>체크인</strong></p><p>{{ reservation.checkInDate }}</p>
            <p><strong>체크아웃</strong></p><p>{{ reservation.checkOutDate }}</p>
            <p><strong>총 결제 금액</strong></p><p class="price">{{ reservation.totalPrice?.toLocaleString() }}원</p>
          </div>
        </div>

        <div class="button-container">
          <button @click="goToBookingDetails" class="button-secondary">예약 내역 확인</button>
          <router-link to="/" class="button-primary">홈으로 돌아가기</router-link>
        </div>

      </div>
      <div v-else class="card loading-box">
        <p>예약 완료 정보를 불러오는 중입니다...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/api/axios';
import { useAuthStore } from '@/api/auth';
import { useUiStore } from '@/store/commonUiStore';
import ReceiptDownload from '@/components/receipt/PdfReceiptViewer.vue';


const route = useRoute();
const router = useRouter();
const reservation = ref(null);
const authStore = useAuthStore();

onMounted(async () => {
  const reservationId = route.params.reservationId;
  if (!reservationId) return;

  try {
    const response = await apiClient.get(`/api/reservations/${reservationId}`);
    reservation.value = response.data;
  } catch (error) {
    console.error("완료된 예약 정보를 불러오는 데 실패했습니다.", error);
    const uiStore = useUiStore();
    uiStore.openModal('예약 실패', '예약 정보를 불러오는 데 실패했습니다.');
  }
});

const goToBookingDetails = () => {
  if (authStore.loggedInUser) {
    router.push('/mypage/bookinglist');
  } else {
    router.push('/lookup-booking');
  }
};
</script>

<style scoped>
.complete-page-background {
  background-color: #f8f9fa;
  padding: 40px 16px;
  font-family: "Noto Sans KR", system-ui, Arial;
  min-height: 80vh;
}

.complete-container {
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
}

.confirmation-header {
  margin-bottom: 32px;
}

.confirmation-icon {
  font-size: 48px;
  color: #2ECC9A;
  margin-bottom: 16px;
}

.main-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}

.sub-title {
  font-size: 16px;
  color: #868e96;
  margin-bottom: 32px;
}

.card {
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0,0,0,.04);
  padding: 24px;
  text-align: left;
}

/* details-box에 position: relative 추가 */
.details-box {
  position: relative;
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
  gap: 16px;
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
  font-weight: 700;
  color: #212529;
}

.status-paid {
  color: #2ECC9A;
  font-weight: bold;
}

.button-container {
  margin-top: 32px;
  display: flex;
  justify-content: center;
  gap: 12px;
}

.button-primary, .button-secondary {
  padding: 14px 28px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 16px;
  text-align: center;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all .2s;
}

.button-primary {
  background: #2ECC9A;
  color: #fff;
}
.button-primary:hover {
  background: #27A582;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,.1);
}

.button-secondary {
  background-color: #e9ecef;
  color: #495057;
}
.button-secondary:hover {
  background-color: #dee2e6;
  transform: translateY(-2px);
}

.loading-box {
  text-align: center;
  padding: 40px;
  color: #868e96;
}
.receipt-download-btn {
  position: absolute;
  top: 5px; /* 카드 패딩과 버튼 높이를 고려한 위치 */
  right: 24px;
}
</style>