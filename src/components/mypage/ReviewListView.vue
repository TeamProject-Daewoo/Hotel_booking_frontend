<template>
  <div class="view-container">
    <h1 class="view-title">다가오는 예약</h1>
    <div v-if="isLoading" class="loading-state">
      <p>예약 내역을 불러오는 중입니다...</p>
    </div>

    <div v-else-if="upcomingBookings.length > 0" class="booking-list">
      <div v-for="booking in upcomingBookings" :key="booking.reservationId" class="booking-card">
        <div class="card-header">
          <div class="hotel-info">
            <img src="https://placehold.co/60x60/e0e7ff/4338ca?text=Hotel" alt="호텔 로고" class="hotel-logo">
            <div class="hotel-details">
              <strong class="hotel-name">{{ booking.hotelName }}</strong>
            </div>
          </div>
          <div class="header-actions">
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
      </div>
    </div>

    <div v-else class="empty-state">
      <h2>예정된 여행이 없습니다.</h2>
      <p>여행을 예약하고 내역을 확인해보세요.</p>
    </div>

    <BookingReceiptModal
        v-if="isModalOpen"
        :booking="selectedBooking"
        @close="closeModal"
    />

    <PastBookingListView :bookings="pastBookings" />

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'; // onMounted 대신 watch 사용
import api from '@/api/axios';
import { useAuthStore } from '@/api/auth'; // authStore 추가
import BookingReceiptModal from './BookingReceiptModal.vue';
import PastBookingListView from './PastBookingListView.vue';

const authStore = useAuthStore(); // authStore 인스턴스 생성
const allBookings = ref([]);
const isLoading = ref(true);

const isModalOpen = ref(false);
const selectedBooking = ref(null);

const upcomingBookings = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return allBookings.value.filter(b => b.status === 'PAID' && new Date(b.checkOutDate) >= today);
});

const pastBookings = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return allBookings.value.filter(b => b.status !== 'PAID' || new Date(b.checkOutDate) < today);
});

const openModal = (booking) => {
  selectedBooking.value = booking;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedBooking.value = null;
};

const fetchBookings = async () => {
  try {
    const response = await api.get('/api/mypage/bookings');
    allBookings.value = response.data.sort((a, b) => new Date(b.checkInDate) - new Date(a.checkInDate));
  } catch (error) {
    console.error("예약 내역을 불러오는 데 실패했습니다:", error);
  } finally {
    isLoading.value = false;
  }
};

// isInitialized 상태를 감시하여 API 호출
watch(() => authStore.isInitialized, (isInitialized) => {
  if (isInitialized && authStore.loggedInUser) {
    fetchBookings();
  }
}, { immediate: true });

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
/* 스타일은 변경하지 않습니다. */
.view-container { background-color: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
.view-title { font-size: 1.5rem; font-weight: 700; color: #111827; margin-bottom: 1.5rem; }
.loading-state, .empty-state { text-align: center; padding: 4rem 0; color: #6b7280; }
.empty-state h2 { font-size: 1.25rem; font-weight: 600; }
.empty-state p { margin-top: 0.5rem; }
.booking-list { display: flex; flex-direction: column; gap: 2rem; }
.booking-card { border: 1px solid #e5e7eb; border-radius: 0.75rem; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05); transition: box-shadow 0.2s; width: 100%; }
.booking-card:hover { box-shadow: 0 4px 12px 0 rgb(0 0 0 / 0.08); }
.card-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-bottom: 1px solid #e5e7eb; }
.hotel-info { display: flex; align-items: center; gap: 1rem; }
.hotel-logo { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; }
.hotel-details { display: flex; flex-direction: column; }
.hotel-name { font-size: 1.125rem; font-weight: 600; color: #1f2937; }
.header-actions { display: flex; align-items: center; gap: 1rem; }
.details-button { background-color: #4f46e5; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: background-color 0.2s; }
.details-button:hover { background-color: #4338ca; }
.card-body { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; padding: 1.5rem; background-color: #f9fafb; }
.info-group { display: flex; flex-direction: column; gap: 1rem; }
.info-item { display: flex; flex-direction: column; }
.info-label { font-size: 0.875rem; color: #6b7280; margin-bottom: 0.25rem; }
.info-value { font-size: 1rem; font-weight: 500; color: #111827; }
</style>