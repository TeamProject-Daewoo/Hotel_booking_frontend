<template>
  <div class="card price-section">
    <h3 class="card-title">최종 결제 금액</h3>
    <p class="total-price">{{ formattedTotalPrice }}원</p>
  </div>
</template>

<script setup>
defineProps({
  formattedTotalPrice: String,
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
.price-section {
  text-align: right;
}
.card-title {
  text-align: left;
  font-weight: 700;
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f3f5;
}
.total-price {
  font-size: 28px;
  font-weight: 700;
  color: #2ECC9A;
  margin: 0;
}
</style>