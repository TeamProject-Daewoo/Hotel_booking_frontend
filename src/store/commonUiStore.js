import { defineStore } from "pinia";
import { ref } from "vue";

export const useUiStore = defineStore('ui', () => {
  const isModalVisible = ref(false);
  const modalTitle = ref('');
  const modalMessage = ref('');
  const confirmText = ref('확인');
  const cancelText = ref('취소');
  const showCancelButton = ref(false);

  let resolvePromise = null;
  let rejectPromise = null;

  function openModal({
                       title,
                       message,
                       confirmText: confirm = '확인',
                       cancelText: cancel = '취소',
                       showCancel = false
                     }) {
    modalTitle.value = title;
    modalMessage.value = message;
    confirmText.value = confirm;
    cancelText.value = cancel;
    showCancelButton.value = showCancel;
    isModalVisible.value = true;

    return new Promise((resolve, reject) => {
      resolvePromise = resolve;
      rejectPromise = reject;
    });
  }

  function closeModal() {
    isModalVisible.value = false;
    modalTitle.value = '';
    modalMessage.value = '';
    confirmText.value = '확인';
    cancelText.value = '취소';
    showCancelButton.value = false;
    resolvePromise = null;
    rejectPromise = null;
  }

  function handleConfirm(value) {
    if (resolvePromise) {
      resolvePromise(value);
    }
    closeModal();
  }

  function handleCancel() {
    if (rejectPromise) {
      rejectPromise(new Error('Modal closed by cancellation'));
    }
    closeModal();
  }

  return {
    isModalVisible,
    modalTitle,
    modalMessage,
    confirmText,
    cancelText,
    showCancelButton,
    openModal,
    closeModal,
    handleConfirm,
    handleCancel
  };
});