import { defineStore } from "pinia";
import { ref } from "vue";

export const useUiStore = defineStore('ui', () => {
  // 모달의 상태 값들
  const isModalVisible = ref(false);
  const modalTitle = ref('');
  const modalMessage = ref('');

  // 모달을 여는 액션
  function openModal(title, message) {
    modalTitle.value = title;
    modalMessage.value = message;
    isModalVisible.value = true;
  }

  // 모달을 닫는 액션
  function closeModal() {
    isModalVisible.value = false;
  }

  return { isModalVisible, modalTitle, modalMessage, openModal, closeModal };
});