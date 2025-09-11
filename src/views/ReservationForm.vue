<template>
  <div class="reservation-container">
    <h2>예약 정보 확인</h2>

    <div class="info-section">
      <h3>숙소 정보</h3>
      <p><strong>호텔 이름:</strong> {{ hotelName }}</p>
      <p><strong>객실 타입:</strong> {{ roomType }}</p>
    </div>

    <div class="info-section">
      <h3>예약 상세</h3>
      <p><strong>체크인:</strong> {{ checkInDate }}</p>
      <p><strong>체크아웃:</strong> {{ checkOutDate }}</p>
      <p><strong>숙박일수:</strong> {{ nights }}박</p>
      <p><strong>인원:</strong> 성인 {{ numAdults }}명, 아동 {{ numChildren }}명</p>
    </div>

    <div class="price-section">
      <h3>최종 결제 금액</h3>
      <p class="total-price">{{ formattedTotalPrice }}원</p>
    </div>

    <button @click="proceedToPayment" class="payment-button">
      결제하기
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/axios';
import { useAuthStore } from '@/api/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// 라우터 쿼리 파라미터로부터 데이터 추출
const contentid = ref('');
const roomcode = ref('');
const hotelName = ref('');
const roomType = ref('');
const checkInDate = ref('');
const checkOutDate = ref('');
const nights = ref(0);
const numAdults = ref(0);
const numChildren = ref(0);
const totalPrice = ref(0);

// 컴포넌트가 마운트될 때 쿼리 파라미터로 상태를 초기화
onMounted(() => {
  contentid.value = route.query.contentid || '';
  roomcode.value = route.query.roomcode || '';
  hotelName.value = route.query.hotelName || '정보 없음';
  roomType.value = route.query.roomType || '정보 없음';
  checkInDate.value = route.query.checkInDate || '';
  checkOutDate.value = route.query.checkOutDate || '';
  nights.value = Number(route.query.nights) || 0;
  numAdults.value = Number(route.query.numAdults) || 0;
  numChildren.value = Number(route.query.numChildren) || 0;
  totalPrice.value = Number(route.query.totalPrice) || 0;
});


// 가격 포맷팅
const formattedTotalPrice = computed(() => {
  return totalPrice.value.toLocaleString();
});

const proceedToPayment = async () => {
  // 1. 로그인 상태 확인 (Pinia 스토어 사용)
  if (!authStore.accessToken) {
    alert('로그인이 필요합니다.');
    router.push('/login');
    return;
  }

  // 2. 백엔드로 보낼 데이터 준비
  const requestData = {
    contentid: contentid.value,
    roomcode: roomcode.value,
    checkInDate: checkInDate.value,
    checkOutDate: checkOutDate.value,
    numAdults: numAdults.value,
    numChildren: numChildren.value,
    totalPrice: totalPrice.value,
  };

  try {
    // 3. 백엔드 예약 생성 API 호출 (apiClient 사용)
    const response = await api.post('/api/reservations', requestData);

    if (response.status !== 201) { // 201 Created
      throw new Error('예약 생성에 실패했습니다.');
    }

    const createdReservation = response.data;
    console.log('예약 성공:', createdReservation);

    // 4. API 호출 성공 시, 결제 페이지로 이동
    // 라우터에 정의된 toss 결제 페이지 경로가 '/toss' 이므로 경로를 수정합니다.
    router.push('/toss');

  } catch (error) {
    console.error('예약 처리 중 오류 발생:', error);
    alert(error.response?.data?.message || '예약 처리 중 오류가 발생했습니다.');
  }
};
</script>

<style scoped>
.reservation-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 30px;
  border: 1px solid #eee;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  font-family: 'Helvetica Neue', Arial, sans-serif;
  background-color: #fff;
}
h2 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 1.8em;
  color: #333;
}
.info-section, .price-section {
  margin-bottom: 25px;
  padding-bottom: 25px;
  border-bottom: 1px solid #eee;
}
.info-section:last-of-type, .price-section:last-of-type {
  border-bottom: none;
}
.info-section h3, .price-section h3 {
  margin-bottom: 15px;
  font-size: 1.3em;
  color: #1e40af;
}
p {
  margin: 10px 0;
  color: #555;
  font-size: 1.1em;
}
p strong {
  color: #333;
  margin-right: 10px;
}
.price-section {
  text-align: right;
}
.total-price {
  font-size: 2em;
  font-weight: bold;
  color: #d9534f;
}
.payment-button {
  width: 100%;
  padding: 15px;
  font-size: 1.2em;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.payment-button:hover {
  background-color: #0056b3;
}
</style>