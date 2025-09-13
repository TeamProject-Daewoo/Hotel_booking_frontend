<template>
  <div class="card">
    <h3 class="card-title">숙소 정보</h3>
    <div class="info-grid">
      <p><strong>호텔 이름</strong></p><p>{{ hotelName }}</p>
      <p><strong>객실 타입</strong></p><p>{{ roomType }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  hotelName: String,
  roomType: String,
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