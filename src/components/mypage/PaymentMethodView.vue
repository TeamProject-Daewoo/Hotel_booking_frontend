<template>
  <div class="view-container">
    <h1 class="view-title">결제수단</h1>
    <div class="card-grid">
      <div v-for="card in cards" :key="card.id" class="payment-card-item">
        <div class="card-header">
          <span class="card-chip"></span>
          <button class="card-delete-button">&times;</button>
        </div>
        <div class="card-number">
          <span>****</span>
          <span>****</span>
          <span>****</span>
          <span class="last-digits">{{ card.last4Digits }}</span>
        </div>
        <div class="card-footer">
          <span class="card-holder">{{ card.cardNickname }}</span>
          <span class="card-vendor">{{ card.vendor }}</span>
        </div>
      </div>

      <button class="add-card-button">
        <div class="add-icon">+</div>
        <span>Add a new card</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const cards = ref([]);

const fetchCards = () => {
  cards.value = [
    { id: 1, cardNickname: 'My Hyundai Card', last4Digits: '1234', vendor: 'VISA' },
  ];
};

onMounted(fetchCards);
</script>

<style scoped>
.view-container {
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
.view-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 2rem;
}
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: center;
}
.payment-card-item {
  width: 280px;
  height: 170px;
  border-radius: 1rem;
  padding: 1.25rem;
  background-color: #a7f3d0; /* 민트색 배경 */
  color: #064e3b;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  position: relative;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-chip {
  width: 40px;
  height: 30px;
  background-color: #fde68a;
  border-radius: 0.25rem;
}
.card-delete-button {
  background: rgba(0,0,0,0.1);
  border: none;
  color: #064e3b;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 1.2rem;
  line-height: 24px;
  cursor: pointer;
}
.card-number {
  display: flex;
  justify-content: space-between;
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: 2px;
}
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  font-size: 0.875rem;
}
.card-holder {
  font-weight: 500;
}
.card-vendor {
  font-weight: 700;
  font-style: italic;
}
.add-card-button {
  width: 280px;
  height: 170px;
  border-radius: 1rem;
  border: 2px dashed #d1d5db;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #6b7280;
  transition: border-color 0.2s;
}
.add-card-button:hover {
  border-color: #9ca3af;
}
.add-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  line-height: 40px;
  margin-bottom: 0.75rem;
}
</style>