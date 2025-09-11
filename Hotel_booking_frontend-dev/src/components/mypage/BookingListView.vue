<template>
  <div class="view-container">
    <div class="header-section">
      <h1 class="view-title">예약내역</h1>
      <select class="filter-select">
        <option>다가오는 예약</option>
        <option>지난 예약</option>
        <option>전체</option>
      </select>
    </div>

    <div class="category-bar">
      <span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> 객실</span>
    </div>

    <div v-if="bookings.length > 0" class="booking-list">
      <div v-for="booking in bookings" :key="booking.id" class="booking-card">
        <div class="hotel-logo">
          <img src="https://placehold.co/60x60/e0e7ff/4338ca?text=CVK" alt="호텔 로고">
        </div>
        <div class="date-info">
          <div class="date-item">
            <span class="date-label">체크인</span>
            <span class="date-value">{{ booking.checkIn }}</span>
          </div>
          <span class="date-separator">-</span>
          <div class="date-item">
            <span class="date-label">체크아웃</span>
            <span class="date-value">{{ booking.checkOut }}</span>
          </div>
        </div>
        <div class="time-room-info">
          <div class="info-line">
            <span>체크인</span>
            <span>{{ booking.checkInTime }}</span>
          </div>
          <div class="info-line">
            <span>체크아웃</span>
            <span>{{ booking.checkOutTime }}</span>
          </div>
          <div class="info-line">
            <span>방번호</span>
            <span class="room-number">{{ booking.roomNumber }}</span>
          </div>
        </div>
        <div class="actions">
          <button class="ticket-button">티켓 다운로드</button>
          <button class="arrow-button">›</button>
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

const bookings = ref([]);

const fetchBookings = () => {
  bookings.value = [
    { id: 1, checkIn: '12월 8일 (목)', checkOut: '12월 9일 (금)', checkInTime: '오후 12:00', checkOutTime: '오전 11:30', roomNumber: '도착 시 배정' },
    { id: 2, checkIn: '12월 8일 (목)', checkOut: '12월 9일 (금)', checkInTime: '오후 12:00', checkOutTime: '오전 11:30', roomNumber: '도착 시 배정' },
    { id: 3, checkIn: '12월 8일 (목)', checkOut: '12월 9일 (금)', checkInTime: '오후 12:00', checkOutTime: '오전 11:30', roomNumber: '도착 시 배정' },
  ];
};

onMounted(fetchBookings);
</script>

<style scoped>
.view-container {
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.view-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}
.filter-select {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}
.category-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
  color: #374151;
}
.booking-list {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.booking-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: #f9fafb;
}
.hotel-logo img {
  border-radius: 0.5rem;
}
.date-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.date-item {
  display: flex;
  flex-direction: column;
}
.date-label {
  font-size: 0.8rem;
  color: #6b7280;
}
.date-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
}
.date-separator {
  font-size: 1.5rem;
  color: #9ca3af;
}
.time-room-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  margin-left: 2rem;
}
.info-line {
  display: flex;
  gap: 1rem;
  min-width: 180px;
}
.info-line span:first-child {
  width: 60px;
}
.room-number {
  font-weight: 600;
  color: #374151;
}
.actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.ticket-button {
  background-color: #d1fae5;
  color: #065f46;
  border: none;
  border-radius: 0.375rem;
  padding: 0.6rem 1rem;
  font-weight: 600;
  cursor: pointer;
}
.arrow-button {
  background-color: white;
  border: 1px solid #e5e7eb;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 1.5rem;
  color: #9ca3af;
  cursor: pointer;
  line-height: 32px;
}
.empty-state {
  text-align: center;
  padding: 3rem 0;
  color: #6b7280;
}
</style>