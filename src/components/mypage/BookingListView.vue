<template>
  <div class="view-container">
    <div v-if="isLoading" class="loading-state">
      <p>예약 내역을 불러오는 중입니다...</p>
    </div>

    <div v-else-if="bookings.length > 0" class="booking-list">
      <div v-for="booking in bookings" :key="booking.reservationId" class="booking-card">
        <div class="hotel-logo">
          <img src="https://placehold.co/60x60/e0e7ff/4338ca?text=Hotel" alt="호텔 로고">
        </div>
        <div class="hotel-name-info">
          <strong>{{ booking.hotelName }}</strong>
        </div>
        <div class="date-info">
          <div class="date-item">
            <span class="date-label">체크인</span>
            <span class="date-value">{{ formatDate(booking.checkInDate) }}</span>
          </div>
          <span class="date-separator">-</span>
          <div class="date-item">
            <span class="date-label">체크아웃</span>
            <span class="date-value">{{ formatDate(booking.checkOutDate) }}</span>
          </div>
        </div>
        <div class="time-room-info">
          <div class="info-line">
            <span>성인</span>
            <span>{{ booking.numAdults }}명</span>
          </div>
          <div class="info-line">
            <span>아동</span>
            <span>{{ booking.numChildren }}명</span>
          </div>
          <div class="info-line">
            <span>상태</span>
            <span class="status-badge">{{ booking.status }}</span>
          </div>
        </div>
        <div class="actions">
          <button class="ticket-button">예약 상세</button>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <p>예정된 여행이 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';

const bookings = ref([]);
const isLoading = ref(true); // 로딩 상태 추가

const fetchBookings = async () => {
  try {
    const response = await api.get('/api/mypage/bookings');
    bookings.value = response.data;
  } catch (error) {
    console.error("예약 내역을 불러오는 데 실패했습니다:", error);
    // 필요하다면 사용자에게 에러 메시지를 보여주는 로직 추가
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
  return `${month}월 ${day}일 (${dayOfWeek})`;
};


onMounted(fetchBookings);
</script>

<style scoped>
/* 기존 스타일에 추가 */
.loading-state, .empty-state {
  text-align: center;
  padding: 3rem 0;
  color: #6b7280;
}
.hotel-name-info {
  width: 150px; /* 호텔 이름 영역 너비 고정 */
  font-size: 1.1rem;
  font-weight: 600;
}
.status-badge {
  font-weight: 600;
  color: #1e40af; /* RESERVED 상태에 맞는 색상 */
}
</style>