<template>
  <div class="reservation-page-background">
    <div class="reservation-container">

      <ReservationTitle />

      <AccommodationInfo :hotel-name="hotelName" :room-type="roomType" />

      <BookingDetails
          :check-in-date="checkInDate"
          :check-out-date="checkOutDate"
          :nights="nights"
          :num-adults="numAdults"
          :num-children="numChildren"
      />

      <FinalPrice :formatted-total-price="formattedTotalPrice" />

      <button @click="proceedToPayment" class="payment-button">
        결제하기
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/axios';

// 새로 만든 자식 컴포넌트들을 import 합니다.
import ReservationTitle from '@/components/reservation/ReservationTitle.vue';
import AccommodationInfo from '@/components/reservation/AccommodationInfo.vue';
import BookingDetails from '@/components/reservation/BookingDetails.vue';
import FinalPrice from '@/components/reservation/FinalPrice.vue';

const route = useRoute();
const router = useRouter();

// 데이터 로직과 결제 함수는 그대로 부모 컴포넌트에 둡니다.
const hotelName = ref('');
const roomType = ref('');
const checkInDate = ref('');
const checkOutDate = ref('');
const nights = ref(0);
const numAdults = ref(0);
const numChildren = ref(0);
const totalPrice = ref(0);

onMounted(() => {
  hotelName.value = route.query.hotelName;
  roomType.value = route.query.roomType;
  checkInDate.value = route.query.checkInDate;
  checkOutDate.value = route.query.checkOutDate;
  nights.value = Number(route.query.nights);
  numAdults.value = Number(route.query.numAdults);
  numChildren.value = Number(route.query.numChildren);
  totalPrice.value = Number(route.query.totalPrice);
});

const formattedTotalPrice = computed(() => {
  return totalPrice.value.toLocaleString();
});

const proceedToPayment = async () => {
  const reservationData = {
    contentid: route.query.contentid,
    roomcode: route.query.roomcode,
    checkInDate: checkInDate.value,
    checkOutDate: checkOutDate.value,
    numAdults: numAdults.value,
    numChildren: numChildren.value,
    totalPrice: totalPrice.value,
  };

  try {
    const response = await api.post('/api/reservations', reservationData);
    const createdReservation = response.data;
    console.log('예약 성공:', createdReservation);

    router.push({
      path: '/payment-process',
      query: {
        reservationId: createdReservation.reservationId,
        orderName: `${hotelName.value} - ${roomType.value}`,
        amount: createdReservation.totalPrice,
      }
    });

  } catch (error) {
    console.error('예약 처리 중 오류 발생:', error);
    alert(error.response?.data?.message || '예약 처리 중 오류가 발생했습니다.');
  }
};
</script>

<style scoped>
.reservation-page-background {
  background-color: #f8f9fa;
  padding: 40px 16px;
  font-family: "Noto Sans KR", system-ui, Arial;
}

.reservation-container {
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px; /* 각 카드(컴포넌트) 사이의 간격 */
}

.payment-button {
  width: 100%;
  padding: 16px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 16px;
  text-align: center;
  border: none;
  cursor: pointer;
  transition: all .2s;
  background: #2ECC9A;
  color: #fff;
}

.payment-button:hover:not(:disabled) {
  background: #27A582;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,.1);
}
</style>