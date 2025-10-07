<template>
  <div class="pdf-receipt-viewer">
    <button
        @click="fetchAndOpenPdf"
        class="download-btn"
        :disabled="!reservationId"
    >
      영수증 다운로드
    </button>
    <p v-if="!reservationId" style="color: red; margin-top: 8px;">
      예약 ID가 없습니다.
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import apiClient from '@/api/axios';
import { useUiStore } from '@/store/commonUiStore'; // uiStore import

const route = useRoute();
const uiStore = useUiStore(); // uiStore 사용
const reservationId = ref(route.params.reservationId || null);

const fetchAndOpenPdf = async () => {
  if (!reservationId.value) return;

  try {
    const response = await apiClient.get(`/api/receipt/${reservationId.value}`, {
      responseType: 'blob',
    });

    const file = new Blob([response.data], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
    // 메모리 누수 방지를 위해 해제
    setTimeout(() => URL.revokeObjectURL(fileURL), 10000);
  } catch (error) {
    console.error('PDF 다운로드 실패:', error);
    // alert을 openModal로 교체
    uiStore.openModal({
      title: '다운로드 실패',
      message: '영수증 다운로드 중 오류가 발생했습니다.'
    });
  }
};
</script>


<style scoped>
.pdf-receipt-viewer {
  max-width: 800px;
  margin: auto;
  text-align: center;
}

.download-btn {
  margin-top: 12px;
  padding: 10px 24px;
  background-color: #2ecc9a;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.3s;
}

.download-btn:hover {
  background-color: #27a582;
}
</style>