<template>
  <div class="search-wrapper" :class="{ 'is-focused': isInputFocused }">
    <input
      type="text"
      :value="keyword"
      @input="handleInput"
      @focus="handleFocus"
      @blur="hideSuggestions"
      @keyup.enter="finalizeSearch"
      placeholder="호텔명 또는 지역 입력"
      class="search-input"
    >
    <SearchSuggestions
      v-if="isInputFocused"
      :keyword="keyword"
      @select-suggestion="selectSuggestion"
      @delete-history="deleteHistory"
    />
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue';
import _ from 'lodash';
import { useSearchStore } from '@/api/searchRequestStore';
import axios from '@/api/axios';
import { useRecentHistory } from '@/store/recentHistoryStore';
import SearchSuggestions from './SearchSuggestions.vue';

const searchStore = useSearchStore();
const historyStore = useRecentHistory();
const isInputFocused = ref(false);

const emits = defineEmits(['handelSearch'])
const keyword = ref('');

// --- API 호출 로직 ---
const callSuggestionAPI = async (newKeyword) => {
  if (!newKeyword || newKeyword.trim() === '') {
    searchStore.suggestions.value = [];
    return;
  }
  try {
    const response = await axios.get(`http://localhost:8888/api/recommend?keyword=${newKeyword}`);
    searchStore.suggestions.value = response.data;
  } catch (error) {
    console.error("API 호출 실패:", error);
    searchStore.suggestions.value = [];
  }
};
const debouncedFetch = _.debounce(callSuggestionAPI, 200);

watch(keyword, (newKeyword) => {
  debouncedFetch(newKeyword);
});

const handleInput = (event) => {
  keyword.value = event.target.value;
  emits('handelSearch', keyword.value);
  debouncedFetch(keyword.value);
};

const handleFocus = () => {
  isInputFocused.value = true;
  if (keyword.value && keyword.value.trim() !== '') {
    debouncedFetch(keyword.value);
  }
};

//추천 검색어 선택
const selectSuggestion = async (suggestion) => {
  keyword.value = suggestion;
  emits('handelSearch', keyword.value);
  finalizeSearch();
};

const deleteHistory = (item) => {
  historyStore.deleteRecentSearch(item);
};

//검색 확정
const finalizeSearch = () => {
  searchStore.keyword = keyword.value;
  isInputFocused.value = false;
  historyStore.addRecentSearch(keyword.value);
  //결과 화면 랜더링
  searchStore.fetchSearchResult();
};

const hideSuggestions = () => {
    isInputFocused.value = false;
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