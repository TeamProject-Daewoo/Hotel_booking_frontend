<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container" :style="modalSize">
        <button class="modal-close" @click="closeModal">
          &times;
        </button>
        <div class="modal-content">
          <slot></slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  maxWidth: {
    type: String,
    default: '800px'
  },
  height: {
    type: String,
    default: '600px'
  }
});
const modalSize = computed(() => {
  return {
    maxWidth: props.maxWidth,
    height: props.height
  };
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-container {
    background: white;
    padding: 20px 20px;
    margin: 0;
    width: 100%;
    border-radius: 8px;
    max-width: 600px;
    height: 450px;
    position: relative;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.modal-close {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 40px;
    cursor: pointer;
}

/* 모달 애니메이션 */
.modal-fade-enter-active, .modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.modal-fade-enter-from, .modal-fade-leave-to {
    opacity: 0;
}
</style>