<template>
  <div class="view-container past-bookings">
    <div class="header-with-toggle">
      <h1 class="view-title">지난 예약 내역</h1>
      <div class="filter-toggle">
        <button
            :class="{ active: activeFilter === 'completed' }"
            @click="activeFilter = 'completed'"
        >
          이용 완료
        </button>
        <button
            :class="{ active: activeFilter === 'cancelled' }"
            @click="activeFilter = 'cancelled'"
        >
          취소 내역
        </button>
      </div>
    </div>

    <div v-if="filteredBookings.length === 0" class="empty-state">
      <h2 v-if="activeFilter === 'completed'">이용 완료된 예약이 없습니다.</h2>
      <h2 v-else>취소된 예약이 없습니다.</h2>
    </div>

    <div v-else class="booking-list">
      <div v-for="booking in filteredBookings" :key="booking.reservationId" class="booking-card">
        <div class="card-header">
          <div class="hotel-info">
            <img src="https://placehold.co/60x60/e0e7ff/4338ca?text=Hotel" alt="호텔 로고" class="hotel-logo">
            <div class="hotel-details">
              <strong class="hotel-name">{{ booking.hotelName }}</strong>
            </div>
          </div>
          <div class="header-actions">
            <span v-if="booking.status !== 'PAID'" class="status-badge cancelled">예약취소</span>
            <span v-else class="status-badge completed">이용완료</span>
            <button class="details-button" @click="openModal(booking)">예약 상세</button>
          </div>
        </div>

        <div class="card-body">
          <div class="info-group">
            <div class="info-item">
              <span class="info-label">체크인</span>
              <span class="info-value">{{ formatDate(booking.checkInDate) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">체크아웃</span>
              <span class="info-value">{{ formatDate(booking.checkOutDate) }}</span>
            </div>
          </div>
          <div class="info-group">
            <div class="info-item">
              <span class="info-label">성인</span>
              <span class="info-value">{{ booking.numAdults }}명</span>
            </div>
            <div class="info-item">
              <span class="info-label">아동</span>
              <span class="info-value">{{ booking.numChildren }}명</span>
            </div>
          </div>
        </div>

        <div v-if="booking.status === 'PAID' && !booking.hasReview" class="card-footer">
          <button @click="goToReview(booking)" class="review-button">리뷰 작성하기</button>
        </div>

      </div>
    </div>

    <BookingReceiptModal
        v-if="isModalOpen"
        :booking="selectedBooking"
        @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import BookingReceiptModal from './BookingReceiptModal.vue';

const props = defineProps({
  bookings: {
    type: Array,
    required: true
  }
});

const router = useRouter();
const isModalOpen = ref(false);
const selectedBooking = ref(null);
const activeFilter = ref('completed');

const filteredBookings = computed(() => {
  if (activeFilter.value === 'completed') {
    return props.bookings.filter(b => b.status === 'PAID');
  } else {
    return props.bookings.filter(b => b.status !== 'PAID');
  }
});

const openModal = (booking) => {
  selectedBooking.value = booking;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedBooking.value = null;
};

const goToReview = (booking) => {
  router.push({
    name: 'WriteReview',
    params: { reservationId: booking.reservationId },
    query: { hotelName: booking.hotelName }
  });
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
  return `${month}월 ${day}일 (${dayOfWeek})`;
};
</script>

<style scoped>
.past-bookings { margin-top: 3rem; }
.view-container { background-color: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
.header-with-toggle { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.view-title { font-size: 1.5rem; font-weight: 700; color: #111827; margin-bottom: 0; }
.filter-toggle { display: flex; border: 1px solid #d1d5db; border-radius: 0.5rem; overflow: hidden; }
.filter-toggle button { background-color: #fff; border: none; padding: 0.5rem 1rem; cursor: pointer; color: #6b7280; font-weight: 500; transition: background-color 0.2s, color 0.2s; }
.filter-toggle button:not(:last-child) { border-right: 1px solid #d1d5db; }
.filter-toggle button.active { background-color: #4f46e5; color: white; }
.empty-state { text-align: center; padding: 4rem 0; color: #6b7280; }
.empty-state h2 { font-size: 1.25rem; font-weight: 600; }
.booking-list { display: flex; flex-direction: column; gap: 2rem; }
.booking-card { border: 1px solid #e5e7eb; border-radius: 0.75rem; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05); transition: box-shadow 0.2s; width: 100%; }
.card-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-bottom: 1px solid #e5e7eb; }
.hotel-info { display: flex; align-items: center; gap: 1rem; }
.hotel-logo { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; }
.hotel-details { display: flex; flex-direction: column; }
.hotel-name { font-size: 1.125rem; font-weight: 600; color: #1f2937; }
.header-actions { display: flex; align-items: center; gap: 1rem; }
.status-badge { font-weight: 600; font-size: 0.9rem; padding: 0.25rem 0.75rem; border-radius: 999px; }
.status-badge.cancelled { color: #dc2626; background-color: #fee2e2; }
.status-badge.completed { color: #6b7280; background-color: #f3f4f6; }
.details-button { background-color: #4f46e5; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: background-color 0.2s; }
.details-button:hover { background-color: #4338ca; }
.card-body { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; padding: 1.5rem; background-color: #f9fafb; }
.info-group { display: flex; flex-direction: column; gap: 1rem; }
.info-item { display: flex; flex-direction: column; }
.info-label { font-size: 0.875rem; color: #6b7280; margin-bottom: 0.25rem; }
.info-value { font-size: 1rem; font-weight: 500; color: #111827; }
.card-footer { padding: 1rem 1.5rem; border-top: 1px solid #e5e7eb; background-color: #f9fafb; text-align: right; }
.review-button { background-color: #10b981; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: background-color 0.2s; }
.review-button:hover { background-color: #059669; }
</style>