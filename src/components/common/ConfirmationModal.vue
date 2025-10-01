<template>
  <div v-if="visible" class="modal-overlay" @click.self="handleCancel">
    <div class="modal-content">
      <h3 v-if="title">{{ title }}</h3>
      <p>{{ message }}</p>
      <div class="modal-actions">
        <button class="cancel-button" @click="handleCancel">취소</button>
        <button class="confirm-button" @click="handleConfirm">확인</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean,
  title: String,
  message: String,
});

const emit = defineEmits(['confirm', 'cancel']);

const handleConfirm = () => {
  emit('confirm');
};

const handleCancel = () => {
  emit('cancel');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  text-align: center;
  width: 90%;
  max-width: 400px;
}
.modal-content h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
}
.modal-content p {
  margin-bottom: 1.5rem;
  color: #555;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 1rem;
}

.modal-actions button {
  flex: 1; /* 버튼이 공간을 균등하게 차지하도록 함 */
  padding: 0.75rem;
  border: none;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.confirm-button {
  background-color: #d9534f; /* 경고/삭제와 관련된 빨간색 */
  color: white;
}
.confirm-button:hover {
  background-color: #c9302c;
}

.cancel-button {
  background-color: #f0f0f0;
  color: #555;
  border: 1px solid #ccc;
}
.cancel-button:hover {
  background-color: #e6e6e6;
}
</style>

