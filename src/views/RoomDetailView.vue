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
        <PaymentOptions v-model="payMode" />

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
            :total="reservation.totalPrice"
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

const route = useRoute();
const router = useRouter();

const reservation = ref(null);
const payMode = ref('full');


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
  if (!reservation.value) return;
  router.push({
    name: 'Payment',
    params: { reservationId: reservation.value.reservationId }
  });
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
</style>