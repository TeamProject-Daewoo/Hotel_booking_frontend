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
      <p><strong>숙박일수:</strong> {{ nights }}일</p>
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 이전 페이지에서 전달받았다고 가정하는 임시 데이터
const contentid = ref('142785'); // 호텔 ID
const roomcode = ref('ROOM789'); // 객실 코드
const hotelName = ref('토스 호텔');
const roomType = ref('디럭스 룸');
const checkInDate = ref('2025-12-24');
const checkOutDate = ref('2025-12-26');
const numAdults = ref(2);
const numChildren = ref(1);
const totalPrice = ref(350000);

// 숙박일수 계산
const nights = computed(() => {
  const start = new Date(checkInDate.value);
  const end = new Date(checkOutDate.value);
  const diff = end.getTime() - start.getTime();
  return diff / (1000 * 60 * 60 * 24);
});

// 가격 포맷팅
const formattedTotalPrice = computed(() => {
  return totalPrice.value.toLocaleString();
});

const proceedToPayment = async () => {
  // 1. localStorage에서 인증 토큰 가져오기
  const token = localStorage.getItem('accessToken');

  if (!token) {
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
    // 3. 백엔드 예약 생성 API 호출
    const response = await fetch('/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // 헤더에 토큰 추가
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error('예약 생성에 실패했습니다.');
    }

    const createdReservation = await response.json();
    console.log('예약 성공:', createdReservation);

    // 4. API 호출 성공 시, 결제 페이지로 이동
    // 라우터에 정의된 toss 결제 페이지 경로가 '/toss' 이므로 경로를 수정합니다.
    router.push('/toss');

  } catch (error) {
    console.error('예약 처리 중 오류 발생:', error);
    alert(error.message);
  }
};
</script>

<style scoped>
.reservation-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  font-family: 'Helvetica Neue', Arial, sans-serif;
}
h2 {
  text-align: center;
  margin-bottom: 30px;
}
.info-section, .price-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}
.info-section h3, .price-section h3 {
  margin-bottom: 15px;
  font-size: 1.2em;
}
p {
  margin: 5px 0;
  color: #555;
}
.price-section {
  text-align: right;
}
.total-price {
  font-size: 1.5em;
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
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.payment-button:hover {
  background-color: #0056b3;
}
</style>