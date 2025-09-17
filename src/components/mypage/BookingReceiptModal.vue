<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">
      <button class="close-button" @click="$emit('close')">&times;</button>
      <div class="modal-header">
        <h2 class="modal-title">예약 상세 정보</h2>
      </div>
      <div class="modal-body">
        <div class="receipt-info">
          <div class="info-row">
            <span>예약 번호</span>
            <span>{{ booking.reservationId }}</span>
          </div>
          <div class="info-row">
            <span>숙소명</span>
            <span>{{ booking.hotelName }}</span>
          </div>
          <div class="info-row">
            <span>체크인</span>
            <span>{{ booking.checkInDate }}</span>
          </div>
          <div class="info-row">
            <span>체크아웃</span>
            <span>{{ booking.checkOutDate }}</span>
          </div>
          <div class="info-row">
            <span>인원</span>
            <span>성인 {{ booking.numAdults }}명, 아동 {{ booking.numChildren }}명</span>
          </div>
        </div>
        <div class="receipt-total">
          <div class="info-row total">
            <span>총 결제 금액</span>
            <span class="total-price" :class="{ 'is-cancelled': booking.status !== 'PAID' }">
              {{ booking.totalPrice?.toLocaleString() }}원
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  booking: {
    type: Object,
    required: true,
  },
});
defineEmits(['close']);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #aaa;
}

.modal-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 20px 0;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  text-align: center;
}

.receipt-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
}

.info-row span:first-child {
  color: #888;
}

.info-row span:last-child {
  font-weight: 500;
  color: #333;
}

.receipt-total {
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.info-row.total span {
  font-size: 18px;
  font-weight: 700;
  color: #000;
}

.total-price {
  color: #2ECC9A !important;
}

.total-price.is-cancelled {
  color: #dc3545 !important;
  text-decoration: line-through;
}
</style>