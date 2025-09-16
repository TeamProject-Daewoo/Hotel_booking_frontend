<template>
  <div class="complete-container">
    <div v-if="reservation">
      <h1>🎉 예약이 성공적으로 완료되었습니다!</h1>
      <div class="details-box">
        <h3>예약 정보</h3>
        <p><strong>예약 번호:</strong> {{ reservation.reservationId }}</p>
        <p><strong>숙소 이름:</strong> {{ reservation.hotelName }}</p>
        <p><strong>체크인:</strong> {{ reservation.checkInDate }}</p>
        <p><strong>체크아웃:</strong> {{ reservation.checkOutDate }}</p>
        <p><strong>총 결제 금액:</strong> {{ reservation.totalPrice?.toLocaleString() }}원</p>
        <p><strong>예약 상태:</strong> <span class="status-paid">{{ reservation.status }}</span></p>
      </div>
      <router-link to="/" class="home-link">홈으로 돌아가기</router-link>
    </div>
    <div v-else>
      <p>예약 완료 정보를 불러오는 중입니다...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import apiClient from '@/api/axios';

const route = useRoute();
const reservation = ref(null);

onMounted(async () => {
  const reservationId = route.params.reservationId;
  try {
    // 서버에서 최종 확정된 예약 정보를 다시 조회
    const response = await apiClient.get(`/api/reservations/${reservationId}`);
    reservation.value = response.data;
  } catch (error) {
    console.error("완료된 예약 정보를 불러오는 데 실패했습니다.", error);
    alert("예약 정보를 불러오는 데 실패했습니다.");
  }
});
</script>

<style scoped>
.complete-container {
  max-width: 700px;
  margin: 40px auto;
  padding: 30px;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.details-box {
  text-align: left;
  margin: 30px 0;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}
.details-box p {
  margin: 10px 0;
  font-size: 16px;
}
.status-paid {
  color: #28a745;
  font-weight: bold;
}
.home-link {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
}
</style>