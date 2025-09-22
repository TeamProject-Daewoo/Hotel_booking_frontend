<template>
  <div class="view-container">
    <h1 class="view-title">예약내역</h1>
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
            <button class="details-button" @click="openReceiptModal(booking)">예약 상세</button>
            <button v-if="isCancellable(booking)" class="cancel-button" @click="openCancelModal(booking)">예약 취소</button>
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

    <BookingReceiptModal v-if="isReceiptModalOpen" :booking="selectedBooking" @close="closeReceiptModal" />
    <PastBookingListView :bookings="pastBookings" />

    <div v-if="isCancelModalOpen" class="modal-overlay" @click.self="closeCancelModal">
      <div class="modal-content">
        <h3>예약 취소 확인</h3>
        <p>정말로 이 예약을 취소하시겠습니까?<br>환불 규정에 따라 수수료가 발생할 수 있습니다.</p>
        <div class="modal-actions">
          <button class="btn-secondary" @click="closeCancelModal">유지하기</button>
          <button class="btn-danger" @click="handleConfirmCancellation">취소하기</button>
        </div>
      </div>
    </div>

    <AlertModal v-if="alertInfo.isOpen" :title="alertInfo.title" :message="alertInfo.message" @close="closeAlertModal" />

  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import api from '@/api/axios';
import BookingReceiptModal from './BookingReceiptModal.vue';
import PastBookingListView from './PastBookingListView.vue';
import AlertModal from './AlertModal.vue';

const allBookings = ref([]);
const isLoading = ref(true);
const selectedBooking = ref(null);

const isReceiptModalOpen = ref(false);
const isCancelModalOpen = ref(false);
const bookingToCancel = ref(null);

const alertInfo = reactive({
  isOpen: false,
  title: '',
  message: '',
});

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

const isCancellable = (booking) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkInDate = new Date(booking.checkInDate);
  return checkInDate > today;
};

const openReceiptModal = (booking) => {
  selectedBooking.value = booking;
  isReceiptModalOpen.value = true;
};

const closeReceiptModal = () => {
  isReceiptModalOpen.value = false;
  selectedBooking.value = null;
};

const openCancelModal = (booking) => {
  bookingToCancel.value = booking;
  isCancelModalOpen.value = true;
};

const closeCancelModal = () => {
  isCancelModalOpen.value = false;
  bookingToCancel.value = null;
};

const openAlertModal = (title, message) => {
  alertInfo.title = title;
  alertInfo.message = message;
  alertInfo.isOpen = true;
};

const closeAlertModal = () => {
  alertInfo.isOpen = false;
};

async function handleConfirmCancellation() {
  if (!bookingToCancel.value) return;

  try {
    const response = await api.post('/api/payment/cancel', {
      reservationId: bookingToCancel.value.reservationId,
      cancelReason: '고객 요청'
    });
    closeCancelModal();
    openAlertModal('취소 완료', response.data);
    await fetchBookings();
  } catch (error) {
    closeCancelModal();
    const errorMessage = error.response?.data || '예약 취소 중 오류가 발생했습니다.';
    openAlertModal('취소 실패', errorMessage);
  }
}

const fetchBookings = async () => {
  try {
    isLoading.value = true;
    const response = await api.get('/api/mypage/bookings');
    allBookings.value = response.data.sort((a, b) => new Date(b.checkInDate) - new Date(a.checkInDate));
  } catch (error) {
    console.error("예약 내역을 불러오는 데 실패했습니다:", error);
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
.cancel-button { background-color: #6b7280; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: background-color 0.2s; }
.cancel-button:hover { background-color: #4b5563; }
.card-body { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; padding: 1.5rem; background-color: #f9fafb; }
.info-group { display: flex; flex-direction: column; gap: 1rem; }
.info-item { display: flex; flex-direction: column; }
.info-label { font-size: 0.875rem; color: #6b7280; margin-bottom: 0.25rem; }
.info-value { font-size: 1rem; font-weight: 500; color: #111827; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal-content { background: #fff; padding: 24px; border-radius: 8px; text-align: center; width: 90%; max-width: 400px; }
.modal-content h3 { margin-top: 0; }
.modal-actions { display: flex; gap: 1rem; margin-top: 20px; }
.modal-actions button { flex: 1; padding: 10px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
.btn-secondary { background-color: #e5e7eb; color: #1f2937; }
.btn-danger { background-color: #ef4444; color: white; }
</style>