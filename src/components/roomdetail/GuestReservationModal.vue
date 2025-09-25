<template>
  <div class="modal-backdrop">
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
          <button type="submit">결제하기</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const guestName = ref('');
const phone = ref('');
const emit = defineEmits(['confirm', 'close']);

const handleSubmit = () => {
  if (guestName.value && phone.value) {
    emit('confirm', { guestName: guestName.value, phone: phone.value });
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
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
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
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}
button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
button[type="submit"] {
  background-color: #007bff;
  color: white;
  border: none;
}
</style>