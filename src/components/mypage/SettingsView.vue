<template>
  <div class="view-container">
    <h1 class="view-title">설정</h1>
    <p class="view-description">특가, 쿠폰 등 이벤트 정보를 빠르게 알려드릴게요.</p>

    <div class="info-banner">
      <p>ⓘ 앱 알림, 최근 본 상품 저장, 앱 푸시, 접근 권한 설정은 'HotelHub' 앱에서 가능해요.</p>
    </div>

    <div class="settings-form">
      <div class="main-checkbox-group">
        <input type="checkbox" id="marketing-main" v-model="settings.marketing.main" class="custom-checkbox">
        <label for="marketing-main">마케팅 알림 수신 동의 (선택)</label>
      </div>

      <div class="sub-checkbox-group">
        <div class="checkbox-item">
          <input type="checkbox" id="marketing-sms" v-model="settings.marketing.sms" class="custom-checkbox">
          <label for="marketing-sms">문자</label>
        </div>
        <div class="checkbox-item">
          <input type="checkbox" id="marketing-email" v-model="settings.marketing.email" class="custom-checkbox">
          <label for="marketing-email">이메일</label>
        </div>
        <div class="checkbox-item">
          <input type="checkbox" id="marketing-kakao" v-model="settings.marketing.kakao" class="custom-checkbox">
          <label for="marketing-kakao">카카오톡</label>
        </div>
      </div>
    </div>

    <div class="button-container">
      <button @click="saveSettings" class="button-primary">저장</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUiStore } from '@/store/commonUiStore';

const uiStore = useUiStore();

const settings = ref({
  marketing: {
    main: true,
    sms: true,
    email: true,
    kakao: false,
  }
});

const saveSettings = () => {
  console.log('저장된 설정:', settings.value);
  uiStore.openModal('설정이 저장되었습니다.');
};

onMounted(() => {
  // 실제로는 여기서 API로 사용자 설정 값을 불러옵니다.
});
</script>

<style scoped>
.view-container {
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  text-align: left;
}
.view-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}
.view-description {
  margin-top: 0.5rem;
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}
.info-banner {
  background-color: #f3f4f6;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 2rem;
}
.main-checkbox-group {
  display: flex;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}
.main-checkbox-group label {
  font-weight: 600;
  color: #1f2937;
}
.sub-checkbox-group {
  padding-top: 1rem;
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: flex-start;
}
.checkbox-item {
  display: flex;
  align-items: center;
}
.custom-checkbox {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 0.25rem;
  margin-right: 0.75rem;
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s, border-color 0.2s;
  flex-shrink: 0;
}
.custom-checkbox:checked {
  background-color: #2563eb;
  border-color: #2563eb;
}
.custom-checkbox:checked::after {
  content: '✔';
  position: absolute;
  color: white;
  font-size: 14px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.checkbox-item label, .main-checkbox-group label {
  cursor: pointer;
  color: #374151;
}
.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}
.button-primary {
  background-color: #2563eb;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 0.375rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}
.button-primary:hover {
  background-color: #1d4ed8;
}
</style>