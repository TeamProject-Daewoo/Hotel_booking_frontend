<template>
  <div v-if="isModalVisible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h3 v-if="modalTitle">{{ modalTitle }}</h3>
      <p v-if="modalMessage">{{ modalMessage }}</p>

      <slot></slot>

      <div class="modal-actions">
        <button v-if="showCancelButton" class="cancel-button" @click="handleCancel">{{ cancelText }}</button>
        <button class="confirm-button" @click="handleConfirm">{{ confirmText }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUiStore } from '@/store/commonUiStore';
import { storeToRefs } from 'pinia';

const uiStore = useUiStore();
const {
  isModalVisible,
  modalTitle,
  modalMessage,
  confirmText,
  cancelText,
  showCancelButton
} = storeToRefs(uiStore);

const { closeModal, handleConfirm, handleCancel } = uiStore;
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
  padding: 1.3rem;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  font-size: 1.1rem;
  text-align: center;
  width: 90%;
  max-width: 400px;
}
.modal-content h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.35rem;
  font-weight: 600;
}
.modal-content h3 + p {
  margin-top: -0.5rem;
}
.modal-content p {
  margin-bottom: 1.5rem;
  color: #555;
  line-height: 1.6;
  white-space: pre-wrap;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: auto; /* 버튼을 항상 아래쪽에 위치시킵니다. */
}

.modal-actions button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.confirm-button {
  background-color: #2ecc9a;
  color: white;
}
.confirm-button:hover {
  background-color: #27a582;
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