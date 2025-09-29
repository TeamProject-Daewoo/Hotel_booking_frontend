<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <p>{{ message }}</p>
      <button @click="$emit('close')">확인</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  visible: Boolean,   // 부모에서 모달 보여줄지 여부
  message: String     // 표시할 메시지
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: white;
  padding: 24px 32px;
  border-radius: 12px;
  border: 2px solid #0071c2; /* 테두리 강조 */
  box-shadow: 0 4px 12px rgba(0,0,0,0.15); /* 그림자 추가 */
  text-align: center;
  min-width: 280px;
}

.modal-content button {
  margin-top: 16px;
  padding: 8px 16px;
  background: #0071c2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
