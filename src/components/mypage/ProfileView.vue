<template>
  <div class="profile-container">
    <div class="header-section">
      <h1 class="view-title">내 정보 관리</h1>
      <button v-if="!isEditing" @click="startEditing" class="edit-button">수정하기</button>
    </div>

    <div class="content-wrapper">
      <div class="section">
        <h2 class="section-title">회원 정보</h2>
        <p class="section-description">회원 정보를 수정할 수 있습니다.</p>
      </div>

      <div v-if="profile" class="form-vertical">
        <div class="form-group">
          <label class="form-label">이메일</label>
          <input type="text" :value="profile.username" disabled class="form-input">
        </div>
        <div class="form-group">
          <label class="form-label">이름</label>
          <input type="text" v-model="profile.name" :disabled="!isEditing" class="form-input">
        </div>
        <div class="form-group">
          <label class="form-label">휴대폰 번호</label>
          <input type="text" v-model="profile.phoneNumber" :disabled="!isEditing" class="form-input">
        </div>
      </div>
      <div v-else>
        <p>사용자 정보를 불러오는 중입니다...</p>
      </div>

      <div v-if="isEditing" class="password-section">
        <div class="form-group">
          <label class="form-label">현재 비밀번호</label>
          <input type="password" v-model="passwords.currentPassword" placeholder="정보 수정을 위해 현재 비밀번호를 입력하세요" class="form-input">
        </div>
        <div class="form-group">
          <label class="form-label">새 비밀번호 (선택)</label>
          <input type="password" v-model="passwords.newPassword" placeholder="변경할 경우에만 입력하세요" class="form-input">
        </div>
      </div>

      <div v-if="isEditing" class="button-container">
        <button @click="cancelEditing" class="button-secondary">취소</button>
        <button @click="submitUpdate" class="button-primary">수정 완료</button>
      </div>

      <div class="section separator">
        <h2 class="section-title">계정 관리</h2>
        <p class="section-description">로그아웃하거나 계정을 영구적으로 삭제할 수 있습니다.</p>
        <div class="account-actions">
          <button @click="handleLogout" class="logout-button">로그아웃</button>
          <a href="#" @click.prevent="withdraw" class="withdraw-link">회원탈퇴</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/api/axios.js'; // @ 별칭을 사용하도록 경로 수정
import { useAuthStore } from '@/api/auth.js'; // authStore를 가져옵니다

const router = useRouter();
const authStore = useAuthStore(); // authStore 인스턴스 생성

const isEditing = ref(false);
const profile = ref(null);
const originalProfile = ref(null);
const passwords = ref({
  currentPassword: '',
  newPassword: ''
});

const fetchProfile = async () => {
  try {
    const response = await apiClient.get('/api/user/me');
    profile.value = { ...response.data };
    originalProfile.value = { ...response.data };
  } catch (error) {
    console.error("프로필 정보를 불러오는 데 실패했습니다.", error);
    alert("세션이 만료되었거나 로그인이 필요합니다.");
    authStore.clearToken(); // 에러 발생 시 토큰 정리
    router.push('/login');
  }
};

const startEditing = () => {
  isEditing.value = true;
};

const cancelEditing = () => {
  profile.value = { ...originalProfile.value };
  isEditing.value = false;
  passwords.value = { currentPassword: '', newPassword: '' };
};

const submitUpdate = async () => {
  if (!passwords.value.currentPassword) {
    alert('정보를 수정하려면 현재 비밀번호를 입력해야 합니다.');
    return;
  }

  const payload = {
    name: profile.value.name,
    phoneNumber: profile.value.phoneNumber, // userPhone -> phoneNumber로 수정
    currentPassword: passwords.value.currentPassword,
    newPassword: passwords.value.newPassword || ''
  };

  try {
    // 백엔드 DTO 필드명에 맞춰 userPhone으로 전송
    await apiClient.patch('/api/mypage/profile', payload);

    await fetchProfile();
    isEditing.value = false;
    alert('수정이 완료되었습니다.');
    passwords.value = { currentPassword: '', newPassword: '' };
  } catch (error) {
    console.error("프로필 수정에 실패했습니다.", error);
    alert(error.response?.data?.message || "프로필 수정 중 오류가 발생했습니다.");
  }
};

const withdraw = async () => {
  if (confirm("정말 탈퇴하시겠습니까? 모든 정보가 삭제되며 복구할 수 없습니다.")) {
    try {
      await apiClient.delete('/api/mypage/member');
      alert("회원 탈퇴가 완료되었습니다.");
      authStore.clearToken(); // 토큰 정리
      router.push('/login');
    } catch (error) {
      console.error("회원 탈퇴에 실패했습니다.", error);
      alert(error.response?.data?.message || "회원 탈퇴 중 오류가 발생했습니다.");
    }
  }
};

const handleLogout = async () => {
  try {
    await apiClient.post('/api/auth/logout');
    authStore.clearToken(); // 클라이언트 토큰 삭제
    alert('로그아웃되었습니다.');
    router.push('/login');
  } catch (error) {
    console.error('로그아웃 실패:', error);
  }
};

watch(() => {
  fetchProfile();
});
</script>

<style scoped>
.profile-container { background-color: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
.header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.view-title { font-size: 1.5rem; font-weight: 700; color: #111827; }
.edit-button { background: none; border: none; color: #3b82f6; font-weight: 600; cursor: pointer; }
.content-wrapper { display: flex; flex-direction: column; gap: 2rem; }
.section { padding-bottom: 1rem; }
.section.separator { border-top: 1px solid #e5e7eb; padding-top: 1.5rem; }
.section-title { font-size: 1.125rem; font-weight: 600; color: #1f2937; }
.section-description { font-size: 0.875rem; color: #6b7280; margin-top: 0.25rem; }
.form-vertical { display: flex; flex-direction: column; gap: 1.5rem; }
.form-group { display: flex; flex-direction: column; }
.form-label { font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem; }
.form-input { width: 100%; max-width: 400px; padding: 0.75rem; border-radius: 0.375rem; border: 1px solid #d1d5db; background-color: #f9fafb; }
.form-input:disabled { background-color: #f3f4f6; color: #374151; border-color: #e5e7eb; cursor: not-allowed; }
.form-input:not(:disabled) { background-color: white; }
.form-input:focus { outline: 2px solid #3b82f6; border-color: #3b82f6; }
.password-section { border-top: 1px solid #e5e7eb; padding-top: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
.button-container { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem; }
.button-primary, .button-secondary { padding: 0.6rem 1.2rem; border-radius: 0.375rem; font-weight: 600; border: 1px solid; cursor: pointer; transition: all 0.2s; }
.button-primary { background-color: #2563eb; color: white; border-color: #2563eb; }
.button-primary:hover { background-color: #1d4ed8; }
.button-secondary { background-color: white; color: #374151; border-color: #d1d5db; }
.button-secondary:hover { background-color: #f9fafb; }
.account-actions { display: flex; align-items: center; gap: 1rem; margin-top: 0.5rem; }
.logout-button { padding: 0.5rem 1rem; background-color: #6b7280; color: white; border: none; border-radius: 0.375rem; cursor: pointer; }
.withdraw-link { color: #ef4444; text-decoration: underline; font-size: 0.875rem; cursor: pointer; }
</style>