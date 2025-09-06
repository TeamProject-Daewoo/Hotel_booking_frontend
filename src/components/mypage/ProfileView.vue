<template>
  <div class="profile-container">
    <div class="header-section">
      <h1 class="view-title">내 정보 관리</h1>
      <button v-if="!isEditing" @click="startEditing" class="edit-button">수정하기</button>
    </div>

    <div class="content-wrapper">
      <div class="section">
        <h2 class="section-title">회원 정보</h2>
        <p class="section-description">현재 정보 수정은 '여기어때' 앱에서 가능해요.</p>
      </div>

      <div v-if="profile" class="form-grid">
        <div class="form-group">
          <label class="form-label">닉네임</label>
          <input type="text" v-model="profile.nickname" :disabled="!isEditing" class="form-input">
        </div>
        <div class="form-group">
          <label class="form-label">예약자 이름</label>
          <input type="text" v-model="profile.name" :disabled="!isEditing" class="form-input">
        </div>
        <div class="form-group">
          <label class="form-label">휴대폰 번호</label>
          <input type="text" v-model="profile.phoneNumber" :disabled="!isEditing" class="form-input">
        </div>
        <div class="form-group">
          <label class="form-label">생년월일</label>
          <input type="text" v-model="profile.birthDate" :disabled="!isEditing" class="form-input">
        </div>
        <div class="form-group">
          <label class="form-label">성별</label>
          <input type="text" v-model="profile.gender" :disabled="!isEditing" class="form-input">
        </div>
      </div>

      <div v-if="isEditing" class="button-container">
        <button @click="cancelEditing" class="button-secondary">취소</button>
        <button @click="submitUpdate" class="button-primary">수정 완료</button>
      </div>
      <div class="section">
        <h2 class="section-title">더 이상 여기어때 이용을 원하지 않으신가요?</h2>
        <a href="#" class="withdraw-link">회원탈퇴</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isEditing = ref(false);
const profile = ref(null);
const originalProfile = ref(null);

const fetchProfile = () => {
  const mockData = {
    nickname: "온화하고상냥한인간선비",
    name: "미입력(탭하여 입력해주세요.)",
    phoneNumber: "01023683770",
    birthDate: "2002년 09월 15일",
    gender: "남성"
  };
  profile.value = { ...mockData };
  originalProfile.value = { ...mockData };
};

const startEditing = () => {
  isEditing.value = true;
};

const cancelEditing = () => {
  profile.value = { ...originalProfile.value };
  isEditing.value = false;
};

const submitUpdate = () => {
  console.log('서버로 전송할 수정된 데이터:', profile.value);
  originalProfile.value = { ...profile.value };
  isEditing.value = false;
  alert('수정이 완료되었습니다. (실제 서버 연동 필요)');
};

onMounted(() => {
  fetchProfile();
});
</script>

<style scoped>
.profile-container {
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.view-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}
.edit-button {
  background: none;
  border: none;
  color: #3b82f6;
  font-weight: 600;
  cursor: pointer;
}
.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.section {
  padding-bottom: 1rem;
}
.section.separator {
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
}
.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}
.section-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
}
.form-input {
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  background-color: #f9fafb;
}
.form-input:disabled {
  background-color: #f3f4f6;
  color: #374151;
  border-color: #e5e7eb;
  cursor: not-allowed;
}
.form-input:not(:disabled) {
  background-color: white;
}
.form-input:focus {
  outline: 2px solid #3b82f6;
  border-color: #3b82f6;
}
.button-container {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}
.button-primary, .button-secondary {
  padding: 0.6rem 1.2rem;
  border-radius: 0.375rem;
  font-weight: 600;
  border: 1px solid;
  cursor: pointer;
  transition: all 0.2s;
}
.button-primary {
  background-color: #2563eb;
  color: white;
  border-color: #2563eb;
}
.button-primary:hover {
  background-color: #1d4ed8;
}
.button-secondary {
  background-color: white;
  color: #374151;
  border-color: #d1d5db;
}
.button-secondary:hover {
  background-color: #f9fafb;
}
.withdraw-link {
  color: #6b7280;
  text-decoration: underline;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}
</style>