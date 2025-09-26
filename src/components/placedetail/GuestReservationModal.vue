<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-content">
      <h3>비회원 예약</h3>
      <p>예약자 정보를 입력해주세요.</p>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="guestName">이름</label>
          <input id="guestName" type="text" v-model="guestName" required />
        </div>
        <div class="form-group">
          <label for="phone">연락처</label>
          <input id="phone" type="tel" v-model="phone" required placeholder="'-' 없이 입력" />
        </div>
        <div class="modal-actions">
          <button type="button" @click="$emit('close')">취소</button>
          <button type="submit">예약하기</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'; // watch import

const guestName = ref('');
const phone = ref('');
const emit = defineEmits(['confirm', 'close']);

watch(phone, (newValue) => {
  // 사용자가 입력한 값에서 숫자만 추출
  const digits = newValue.replace(/\D/g, '');

  // 하이픈을 추가하여 번호 포맷팅
  let formatted = '';
  if (digits.length > 0) {
    formatted = digits.substring(0, 3);
  }
  if (digits.length > 3) {
    formatted += '-' + digits.substring(3, 7);
  }
  if (digits.length > 7) {
    formatted += '-' + digits.substring(7, 11);
  }

  phone.value = formatted;
});

const handleSubmit = () => {
  // 전화번호 유효성 검사 (최소 10자리 이상)
  if (guestName.value && phone.value.replace(/\D/g, '').length >= 10) {
    emit('confirm', { guestName: guestName.value, phone: phone.value });
  } else {
    // 간단한 유효성 검사 실패 알림 (필요 시)
    alert('이름과 올바른 연락처를 입력해주세요.');
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 400px;
}
.form-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
}
input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box; /* padding이 너비에 포함되도록 설정 */
}
.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}
button {
  padding: 0.75rem 1.5rem; /* 버튼 크기 조정 */
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  border: 1px solid #ddd;
}
button[type="submit"] {
  background-color: #2ecc9a;
  color: white;
  border: none;
  transition: background-color 0.2s;
}
button[type="submit"]:hover {
  background-color: #4338ca;
}
button[type="button"] {
  background-color: #f8f9fa;
}
button[type="button"]:hover {
  background-color: #e9ecef;
}
</style>