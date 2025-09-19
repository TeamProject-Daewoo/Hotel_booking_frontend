<template>
  <div class="search-wrapper">
    <input
      type="text"
      :value="searchStore.keyword"
      @input="updateKeywordAndFetch"
      @focus="isInputFocused = true"
      @blur="hideSuggestions"
      placeholder="호텔명 또는 지역 입력"
      class="search-input"
    >
    <SearchSuggestions v-if="isInputFocused" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import _ from 'lodash';
import { useSearchStore } from '@/api/searchRequestStore';
import SearchSuggestions from './SearchSuggestions.vue';
import axios from '@/api/axios';

const searchStore = useSearchStore();
const isInputFocused = ref(false);

const callSuggestionAPI = async (keyword) => { 
    if (!keyword || keyword.trim() === '') {
    searchStore.suggestions.value = [];
    return;
  }
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/recommend?keyword=${keyword}`);
    searchStore.suggestions.value = response.data;
  } catch (error) {
    console.error("추천 검색어 API 호출 실패:", error);
    searchStore.suggestions.value = [];
  }
 };
const debouncedFetch = _.debounce(callSuggestionAPI, 200);

const updateKeywordAndFetch = (event) => {
  searchStore.keyword = event.target.value;
  debouncedFetch(searchStore.keyword);
};

// input 포커스가 사라지면 잠시 후 추천창을 닫습니다.
const hideSuggestions = () => {
  setTimeout(() => {
    isInputFocused.value = false;
  }, 200); // mousedown 이벤트가 실행될 시간을 벌어줍니다.
};
</script>

<style scoped>
.search-wrapper {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  outline: none;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  border: none;
}
</style>