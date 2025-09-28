<template>
  <div class="point-card">
    <div class="point-header">
      <label for="points">포인트 사용</label>
      <span class="my-points">보유 포인트: {{ remainingPoints.toLocaleString() }} P</span>
    </div>

<!--    <div v-if="disabled" class="disabled-message">-->
<!--      쿠폰을 먼저 선택해주세요-->
<!--    </div>-->

    <div class="point-input-wrapper">
      <input
          type="number"
          id="points"
          :value="modelValue"
          @input="handleInput"
          placeholder="사용할 포인트 입력"
      >
      <span
          class="clear-icon"
          v-if="modelValue !== null && modelValue !== undefined && modelValue !== ''"
          @click="cancelPoints"
      >×</span>
      <button
          @click="$emit('apply-points')"
          class="apply-button">
        적용
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/api/auth';

const props = defineProps({
  modelValue: Number,
  totalPrice: { type: Number, default: 0 },
  disabled: { type: Boolean, default: false },
  appliedPoints: { type: Number, default: 0 }
});

const emit = defineEmits(['update:modelValue', 'apply-points']);
const authStore = useAuthStore();

const cancelPoints = () => {
  emit('update:modelValue', 0);   // 부모 v-model에 0 전달
  emit('cancel-points');           // 부모에게도 알림
};

const remainingPoints = computed(() => {
  const totalPoints = authStore.points ?? 0;
  return totalPoints - props.appliedPoints;
});

const handleInput = (event) => {

  let value = event.target.value;
  value = value.replace(/[^0-9]/g, '');
  if (!value) value = '0';

  let pointsToUse = Number(value) || 0;   // 필터링된 값 사용
  const myPoints = authStore.points ?? 0;

  if (pointsToUse > myPoints) pointsToUse = myPoints;
  if (pointsToUse > props.totalPrice) pointsToUse = props.totalPrice;
  if (pointsToUse < 0) pointsToUse = 0;

  emit('update:modelValue', pointsToUse);
};
</script>

<style scoped>
.point-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.05);
}

.point-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.point-header label {
  font-weight: 600;
  font-size: 1.05rem;
  color: #222;
}

.my-points {
  font-size: 0.9rem;
  color: #555;
  background: #f8f9fa;
  padding: 4px 10px;
  border-radius: 20px;
}

.point-input-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.point-input-wrapper input {
  flex: 1;
  padding: 10px 36px 10px 12px; /* 오른쪽 공간 확보 */
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.clear-icon {
  position: absolute;
  right: 100px; /* 버튼과 겹치지 않게 위치 조정 */
  cursor: pointer;
  font-weight: bold;
  font-size: 1.2rem;
  color: #888;
  user-select: none;
}

.clear-icon:hover {
  color: #333;
}
.point-input-wrapper input:focus {
  outline: none;
  border: 1px solid #0071c2; /* 호텔 예약 사이트 파란색 */
  box-shadow: 0 0 0 2px rgba(0,113,194,0.1);
}

.apply-button {
  padding: 10px 16px;
  background-color: #0071c2; /* Booking.com 스타일 파랑 */
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  min-width: 80px;
  margin-left: 10px;
}

.apply-button:disabled {
  background-color: #b8d6f3;
  cursor: not-allowed;
}

.apply-button:hover:not(:disabled) {
  background-color: #005a99;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
