<template>
  <div class="booking-page" v-if="reservation">
    <Breadcrumb :id="reservation.hotel.contentid" :title="reservation.hotel.title" />
    <div class="grid">
      <div class="left-col">
        <div class="info-section">
          <h2>예약 정보 확인</h2>
          <div class="info-item">
            <span class="label">예약자 이름</span>
            <span class="value">{{ reservation.customerName }}</span>
          </div>
          <div class="info-item">
            <span class="label">연락처</span>
            <span class="value">{{ reservation.phone }}</span>
          </div>
          <div class="info-item">
            <span class="label">체크인</span>
            <span class="value">{{ formatDate(reservation.checkInDate) }}</span>
          </div>
          <div class="info-item">
            <span class="label">체크아웃</span>
            <span class="value">{{ formatDate(reservation.checkOutDate) }}</span>
          </div>
        </div>
        <Coupon @update:selectedCoupon="(coupon) => { selectedCoupon = coupon }" />

      <button @click="toggleCoupon" class="apply-coupon-button">
  {{ selectedCoupon?.isUsed ? '쿠폰 적용 취소' : '쿠폰 적용하기' }}
</button>


        <button @click="goToPayment" class="reservation-button">
          결제하기
        </button>
      </div>

      <aside class="right-col">
        <SummaryCard
  :base="reservation.hotel"
  :room="reservation.room"
  :checkIn="reservation.checkInDate"
  :checkOut="reservation.checkOutDate"
  :nights="nights"
  :fare="reservation.basePrice"
  :total="discountedTotalPrice"
/>

      </aside>
    </div>
  </div>

  <div v-else class="loading-container">
    <div class="spinner"></div>
    <p>예약 정보를 불러오는 중입니다...</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/axios';

import Breadcrumb from '@/components/roomdetail/Breadcrumb.vue';
import RoomHero from '@/components/roomdetail/RoomHero.vue'; // RoomHero는 여전히 사용 가능
import PaymentOptions from '@/components/roomdetail/PaymentOptions.vue';
import SummaryCard from '@/components/roomdetail/SummaryCard.vue';
import Coupon from '@/components/coupon/Coupon.vue'

const route = useRoute();
const router = useRouter();

const reservation = ref(null);
const payMode = ref('full');

const selectedCoupon = ref(null);

// 할인된 가격 계산 - 여기 추가
const discountedTotalPrice = computed(() => {
  if (!reservation.value) return 0;
  if (!selectedCoupon.value) return reservation.value.totalPrice;

  const total = reservation.value.totalPrice;
  const coupon = selectedCoupon.value.coupon;

  if (!coupon) return total;

  const percentage = coupon.discountPercent;

  // 할인 방식 판단: 퍼센트가 0보다 크면 퍼센트 할인, 아니면 정액 할인
  if (percentage > 0) {
    return Math.max(total * (1 - percentage / 100), 0);
  } else {
    const discountAmount = coupon.discountAmount || 0; // 혹은 coupon.discountValue
    return Math.max(total - discountAmount, 0);
  }
});


onMounted(async () => {
  const reservationId = route.query.reservationId;
  if (!reservationId) {
    alert("잘못된 접근입니다.");
    router.push('/');
    return;
  }

  try {
    const response = await api.get(`/api/reservations/${reservationId}`);
    reservation.value = response.data;
  } catch (error) {
    console.error("예약 정보를 불러오는 데 실패했습니다.", error);
    alert("예약 정보를 불러오는 데 실패했습니다.");
    router.push('/');
  }
});

const nights = computed(() => {
  if (!reservation.value) return 0;
  const s = new Date(reservation.value.checkInDate);
  const e = new Date(reservation.value.checkOutDate);
  const diff = Math.round((e - s) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
});

// 날짜 포맷팅을 위한 간단한 헬퍼 함수
const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' };
  return new Date(dateString).toLocaleString('ko-KR', options);
};


const goToPayment = () => {
console.log('예약 객체:', reservation.value);
  console.log('예약 ID:', reservation.value?.reservationId);
  if (!reservation.value) return;
  router.push({
    name: 'Payment',
    params: { reservationId: reservation.value.reservationId },
    query: { userCouponId: selectedCoupon.value?.id ?? null } 
  });
};


const toggleCoupon = async () => {
  if (!selectedCoupon.value || !selectedCoupon.value.id) {
    alert("❗️ 쿠폰이 선택되지 않았습니다.");
    return;
  }

  const userCouponId = selectedCoupon.value.id;

  try {
    if (!selectedCoupon.value.isUsed) {
      // 쿠폰 적용
      await api.patch(`/api/coupons/user/${userCouponId}/use`);
      selectedCoupon.value.isUsed = true;
      selectedCoupon.value.usedAt = new Date().toISOString();
      alert("✅ 쿠폰이 적용되었습니다.");
    } else {
      // 쿠폰 취소
      await api.patch(`/api/coupons/user/${userCouponId}/cancel`);
      selectedCoupon.value.isUsed = false;
      selectedCoupon.value.usedAt = null;
      alert("❌ 쿠폰 적용이 취소되었습니다.");
    }
  } catch (error) {
    console.error("쿠폰 처리 실패:", error);
    alert("❌ 쿠폰 처리 중 오류가 발생했습니다.");
  }
};



</script>

<style scoped>
.booking-page { max-width: 1120px; margin: 24px auto; padding: 0 16px; }
.grid { display: grid; grid-template-columns: 2fr 1fr; gap: 18px; margin-top: 18px; align-items: start; }
.left-col { display: flex; flex-direction: column; gap: 18px; }
.right-col { position: sticky; top: 80px; }
@media (max-width: 960px) { .grid { grid-template-columns: 1fr } .right-col { position: static } }

.info-section { border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; }
.info-section h2 { font-size: 1.25rem; font-weight: 600; margin: 0 0 16px; padding-bottom: 16px; border-bottom: 1px solid #e5e7eb; }
.info-item { display: flex; justify-content: space-between; font-size: 1rem; margin-bottom: 12px; }
.info-item .label { color: #6b7280; }
.info-item .value { font-weight: 500; }

.reservation-button { width: 100%; padding: 15px; background-color: #2ecc9a; color: white; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: background-color 0.2s; }
.reservation-button:hover { background-color: #2ecc9a; }

.loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 70vh; }
.spinner { width: 48px; height: 48px; border: 5px solid #f3f4f6; border-bottom-color: #4f46e5; border-radius: 50%; display: inline-block; animation: rotation 1s linear infinite; margin-bottom: 16px; }
@keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.apply-coupon-button {
  margin-top: 10px;
  padding: 10px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.apply-coupon-button:hover {
  background-color: #0056b3;
}
</style>