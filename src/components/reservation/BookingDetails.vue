<template>
  <div class="card">
    <h3 class="card-title">예약 상세</h3>
    <div class="info-grid">
      <p><strong>체크인</strong></p><p>{{ checkInDate }}</p>
      <p><strong>체크아웃</strong></p><p>{{ checkOutDate }}</p>
      <p><strong>숙박일수</strong></p><p>{{ nights }}박</p>
      <p><strong>인원</strong></p><p>성인 {{ numAdults }}명, 아동 {{ numChildren }}명</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  checkInDate: String,
  checkOutDate: String,
  nights: Number,
  numAdults: Number,
  numChildren: Number,
});
</script>

<style scoped>
.card {
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0,0,0,.04);
  padding: 24px;
}
.card-title {
  font-weight: 700;
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f3f5;
}
.info-grid {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px;
  font-size: 15px;
}
.info-grid p {
  margin: 0;
  color: #495057;
}
.info-grid p:nth-child(odd) {
  font-weight: 500;
  color: #212529;
}
</style>