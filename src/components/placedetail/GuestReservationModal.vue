<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-content">
      <h3 class="non-member-title">비회원 예약</h3>
      <p class="non-member-subtitle">예약자 정보를 입력해주세요.</p>
      <div class="signup-promo">
        <p>
          <span class="highlight">첫 예약이신가요?</span><br />
          회원가입하고 <strong class="point-text">즉시 사용 가능한 {{ welcomePointAmount.toLocaleString() }}포인트</strong>를 받으세요!
        </p>
        <button class="signup-button" @click="goToSignUp">회원가입 하러가기</button>
      </div>

      <div class="divider">
        <span>또는</span>
      </div>

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
          <button type="button" class="cancel-button" @click="$emit('close')">취소</button>
          <button type="submit" class="submit-button">비회원으로 예약하기</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useUiStore } from '@/store/commonUiStore'; // uiStore import

const guestName = ref('');
const phone = ref('');
const welcomePointAmount = inject('welcomePointAmount', 50000);
const emit = defineEmits(['confirm', 'close', 'go-signup']);
const router = useRouter();
const uiStore = useUiStore(); // uiStore 사용

watch(phone, (newValue) => {
  const digits = newValue.replace(/\D/g, '');
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
  if (guestName.value && phone.value.replace(/\D/g, '').length >= 10) {
    emit('confirm', { guestName: guestName.value, phone: phone.value });
  } else {
    // alert을 openModal로 교체
    uiStore.openModal({
      title: '입력 오류',
      message: '이름과 올바른 연락처를 입력해주세요.'
    });
  }
};

const goToSignUp = () => {
  emit('close');
  router.push('/register');
};
</script>

<style scoped>
/* 스타일은 변경되지 않았으므로 생략합니다. */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.25);
  width: 90%;
  max-width: 420px;
}

/* --- 회원가입 유도 섹션 스타일 --- */
.signup-promo {
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}
.signup-promo p {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  line-height: 1.6;
  color: #495057;
}
.highlight {
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
}
.point-text {
  color: #4338ca;
}
.signup-button {
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  background-color: #4338ca;
  color: white;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}
.signup-button:hover {
  background-color: #3730a3;
}

/* --- 구분선 스타일 --- */
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 2rem 0;
  color: #adb5bd;
}
.divider::before, .divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #dee2e6;
}
.divider span {
  padding: 0 1rem;
}

/* --- 비회원 예약 폼 스타일 --- */
.non-member-title {
  text-align: center;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}
.non-member-subtitle {
  text-align: center;
  color: #6c757d;
  margin-bottom: 1.5rem;
}
.form-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
}
input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  box-sizing: border-box;
}
.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}
button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  border: 1px solid transparent;
}
.submit-button {
  background-color: #24877f;
  color: white;
}
.submit-button:hover {
  background-color: #105c4a;
}
.cancel-button {
  background-color: #f1f3f5;
  border-color: #dee2e6;
}
.cancel-button:hover {
  background-color: #e9ecef;
}
</style>