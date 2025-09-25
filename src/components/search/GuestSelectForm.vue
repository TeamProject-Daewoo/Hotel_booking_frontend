<template>
  <div class="guest-wrapper" ref="searchComponentRef" :class="{ 'is-focused': isInputFocused }">
    <input
      type="text"
      id="guest-input"
      :value="guestInput" 
      @input="handleInput"
      ref="inputRef"
      @blur="validateGuestCount"
      @focus="handleFocus"
      @keyup.enter="finalize"
      class="guest-input"
    >
    <div class="search-wrapper"
      v-if="isInputFocused">
      <div class="suggestions-container" ref="searchComponentRef">
        <button @mousedown="decreaseCount" class="control-btn minus-btn">-</button>
        <label for="guest-input">{{ guestCount }}</label>
        <button @mousedown="increaseCount" class="control-btn plus-btn">+</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import SearchSuggestions from './SearchSuggestions.vue';
import { useSearchStore } from '@/api/searchRequestStore';

const searchStore = useSearchStore();

const isInputFocused = ref(false);
const inputRef = ref(null);
const searchComponentRef = ref(null);
const { guestCount } = storeToRefs(searchStore);
const guestInput = ref(guestCount.value);
const isControlClicked = ref(false);

const handleFocus = () => {
  isInputFocused.value = true;
};
const handleInput = (event) => {
  guestInput.value = event.target.value.replace(/\D/g, '');
}

//click outside 방식 
const handleClickOutside = (event) => {
  if (searchComponentRef.value && !searchComponentRef.value.contains(event.target)) {
    isInputFocused.value = false;
  }
};
watch(isInputFocused, (isFocused) => {
  if (isFocused) {
    document.addEventListener('mousedown', handleClickOutside);
  } else {
    document.removeEventListener('mousedown', handleClickOutside);
  }
});

const decreaseCount = () => {
  if(guestCount.value > 1) {
    guestCount.value--;
    guestInput.value = guestCount.value;
  }
}
const increaseCount = () => {
  if(guestCount.value < 30) {
    guestCount.value++;
    guestInput.value = guestCount.value;
  }
}

const finalize = () => {
  guestCount.value = guestInput.value;
  validateGuestCount();
  if(inputRef.value) {
    isInputFocused.value = false;
    inputRef.value?.blur();
  }
};

//유효성 검증
const validateGuestCount = () => {
  if (guestCount.value === null || guestCount.value === '' || isNaN(guestCount.value)) {
    guestCount.value = 1;
    return;
  }

  if (guestCount.value < 1) {
    guestCount.value = 1;
  } else if (guestCount.value > 30) {
    guestCount.value = 30;
  }
  guestInput.value = guestCount.value;
};

</script>
<style scoped>
.search-wrapper {
  position: relative;
  transition: width 0.3s ease;
}

.suggestions-container {
  position: absolute;
  top: 110%;
  left: 0;
  width: 100%;
  border: 1px solid #e5e5e5;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  padding: 8px;
  z-index: 10;
  align-items: center;
  text-align: center;
}

.guest-wrapper {
  position: relative;
  width: 90%;
}

.guest-input {
  width: 95%;
  padding: 12px 16px;
  outline: none;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  border: none;
}
.control-btn {
  width: 36px;
  height: 36px;
  border: none; /* 기본 테두리 제거 */
  border-radius: 50px;
  background-color: #f5f5f5; /* 버튼 배경색 */
  color: #555;
  font-size: 1.4rem; /* 아이콘 크기 */
  font-weight: bold;
  margin-left: 10px;
  margin-right: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease; /* 부드러운 전환 효과 */
}

.control-btn:hover {
  background-color: #e0e0e0;
}

/* 숫자 표시 부분 */
.quantity-input {
  width: 50px;
  height: 36px;
  border: none; /* 테두리 제거 */
  border-left: 1px solid #ccc; /* 버튼과 구분선 */
  border-right: 1px solid #ccc;
  text-align: center; /* 숫자 가운데 정렬 */
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  /* input 기본 스타일 초기화 */
  -webkit-appearance: none;
  -moz-appearance: textfield;
  appearance: none;
  outline: none; /* 포커스 시 테두리 제거 */
}

/* (선택) type="number" 사용 시 브라우저 기본 화살표 제거 */
.quantity-input::-webkit-outer-spin-button,
.quantity-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>