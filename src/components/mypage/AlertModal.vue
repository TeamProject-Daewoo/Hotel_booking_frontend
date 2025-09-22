<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <button @click="$emit('close')">확인</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  message: String,
});
defineEmits(['close']);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal-content {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  text-align: center;
  width: 90%;
  max-width: 400px;
}
.modal-content h3 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 1.25rem;
}
.modal-content p {
  margin-bottom: 20px;
  color: #666;
}
.modal-content button {
  width: 100%;
  padding: 10px;
  border: none;
  background-color: #2ecc9a;
  color: white;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
}
</style>