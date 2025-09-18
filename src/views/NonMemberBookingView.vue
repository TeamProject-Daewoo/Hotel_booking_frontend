<template>
  <main class="lookup-page-background">
    <div class="lookup-container">
      <h1 class="view-title">비회원 예약 조회</h1>
      <p class="view-description">예약번호 또는 예약 시 입력하신 이름과 전화번호를 입력해주세요.</p>

      <form @submit.prevent="findBooking" class="lookup-form">
        <div class="form-group">
          <label for="reservationId" class="form-label">예약번호</label>
          <input type="text" id="reservationId" v-model="reservationId" placeholder="예약번호로 조회 시 이름/전화번호 불필요" class="form-input">
        </div>

        <div class="separator">또는</div>

        <div class="form-group">
          <label for="name" class="form-label">이름</label>
          <input type="text" id="name" v-model="name" class="form-input">
        </div>
        <div class="form-group">
          <label for="phone" class="form-label">전화번호</label>
          <input type="tel" id="phone" v-model="phone" placeholder="'-' 없이 숫자만 입력" class="form-input">
        </div>
        <button type="submit" class="submit-btn" :disabled="isLoading">
          {{ isLoading ? '조회 중...' : '예약 조회하기' }}
        </button>
      </form>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-if="bookings.length > 0" class="results-container">
        <h2 class="results-title">조회 결과</h2>
        <div v-for="booking in bookings" :key="booking.reservationId" class="booking-card">
          <div class="card-header">
            <strong class="hotel-name">{{ booking.hotelName }}</strong>
          </div>
          <div class="card-body">
            <div class="info-item">
              <span class="info-label">예약 번호</span>
              <span class="info-value">{{ booking.reservationId }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">체크인</span>
              <span class="info-value">{{ booking.checkInDate }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">체크아웃</span>
              <span class="info-value">{{ booking.checkOutDate }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">총 결제 금액</span>
              <span class="info-value total-price">{{ booking.totalPrice?.toLocaleString() }}원</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/api/axios';

const reservationId = ref('');
const name = ref('');
const phone = ref('');
const isLoading = ref(false);
const bookings = ref([]);
const error = ref(null);

const findBooking = async () => {
  isLoading.value = true;
  error.value = null;
  bookings.value = [];

  const params = {};

  if (reservationId.value.trim()) {
    params.reservationId = reservationId.value.trim();
  } else if (name.value.trim() && phone.value.trim()) {
    params.reservName = name.value.trim();
    params.reservPhone = phone.value.trim().replace(/\D/g, '');
  } else {
    error.value = '예약번호 또는 이름과 전화번호를 모두 입력해주세요.';
    isLoading.value = false;
    return;
  }

  try {
    const response = await api.get('/api/reservations/lookup', { params });
    if (response.data && response.data.length > 0) {
      bookings.value = response.data;
    } else {
      error.value = '일치하는 예약 내역이 없습니다.';
    }
  } catch (err) {
    console.error('비회원 예약 조회 실패:', err);
    error.value = '조회 중 오류가 발생했습니다. 다시 시도해주세요.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.lookup-page-background { background-color: #f8f9fa; padding: 40px 16px; min-height: 80vh; }
.lookup-container { max-width: 600px; margin: 2rem auto; padding: 2.5rem; background: #fff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); text-align: center; }
.view-title { font-size: 1.75rem; font-weight: 700; }
.view-description { color: #6b7280; margin-bottom: 2rem; }
.lookup-form { display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem; text-align: left; }
.form-group { display: flex; flex-direction: column; }
.form-label { font-weight: 600; margin-bottom: 0.5rem; font-size: 0.9rem; }
.form-input { padding: 0.8rem 1rem; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; }
.submit-btn { margin-top: 1rem; padding: 1rem; background-color: #2ECC9A; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1.1rem; font-weight: 700; transition: background-color 0.2s; }
.submit-btn:disabled { background-color: #ccc; }
.separator { text-align: center; color: #aaa; font-weight: bold; margin: 0.5rem 0; }
.error-message { color: #dc3545; margin-top: 1.5rem; font-weight: 500; }
.results-container { margin-top: 2.5rem; text-align: left; }
.results-title { font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; }
.booking-card { border: 1px solid #e5e7eb; border-radius: 0.75rem; margin-bottom: 1rem; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
.card-header, .card-body { padding: 1rem 1.5rem; }
.card-header { border-bottom: 1px solid #e5e7eb; background-color: #f9fafb; }
.hotel-name { font-size: 1.1rem; font-weight: 600; }
.card-body { display: flex; flex-direction: column; gap: 0.8rem; }
.info-item { display: flex; justify-content: space-between; }
.info-label { color: #6b7280; }
.info-value { font-weight: 500; color: #333; }
.total-price { font-weight: 700; color: #2ECC9A; }
</style>