<template>
  <div class="card">
    <div class="point-section">
      <div class="point-header">
        <label for="points">포인트 사용</label>
        <span class="my-points">보유: {{ authStore.points?.toLocaleString() ?? 0 }} P</span>
      </div>
      <input
          type="number"
          id="points"
          :value="modelValue"
          @input="handleInput"
          placeholder="사용할 포인트 입력"
      >
    </div>
    <button @click="$emit('apply-points')" class="apply-button" :disabled="!modelValue > 0">
      포인트 사용하기
    </button>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/api/auth';

const props = defineProps({
  modelValue: { // v-model을 위한 prop
    type: Number,
    required: true
  },
  totalPrice: { // 최대 사용 가능 금액 (상품 가격)
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['update:modelValue', 'apply-points']);
const authStore = useAuthStore();

const handleInput = (event) => {
  let pointsToUse = Number(event.target.value);
  const myPoints = authStore.points ?? 0;

  if (pointsToUse > myPoints) {
    pointsToUse = myPoints;
  }
  if (pointsToUse > props.totalPrice) {
    pointsToUse = props.totalPrice;
  }
  if (pointsToUse < 0) {
    pointsToUse = 0;
  }

  emit('update:modelValue', pointsToUse);
};
</script>

<style scoped>
.card { background:#fff;border:1px solid #e5e7eb;border-radius:14px;box-shadow:0 8px 24px rgba(0,0,0,.04);padding:16px}
.point-section { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #eee; }
.point-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
.point-header label { font-weight: bold; }
.my-points { font-size: 0.9rem; color: #007bff; }
.point-section input { width: 100%; box-sizing: border-box; padding: 8px; border-radius: 4px; border: 1px solid #ccc; }
.apply-button {
  margin-top: 10px;
  padding: 10px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
}
.apply-button:disabled {
  background-color: #a0c3ff;
  cursor: not-allowed;
}
.apply-button:hover:not(:disabled) {
  background-color: #0056b3;
}
</style>