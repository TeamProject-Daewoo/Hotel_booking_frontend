<template>
  <div class="search-wrapper" :class="{ 'is-focused': isInputFocused }">
    <input
      type="text"
      ref="inputRef"
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
      :keyword="searchKeyword"
      @select-suggestion="selectSuggestion"
    />
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import _ from 'lodash';
import { useSearchStore } from '@/api/searchRequestStore';
import axios from '@/api/axios';
import { useHistoryStore } from '@/store/recentHistoryStore';
import SearchSuggestions from './SearchSuggestions.vue';

const searchStore = useSearchStore();
const historyStore = useHistoryStore();
const isInputFocused = ref(false);

const inputRef = ref(null);
const keyword = ref('');
watch(
  () => searchStore.inputData,
  (newKeyword, oldKeyword) => {
    if (newKeyword !== oldKeyword) {
      keyword.value = searchStore.inputData;
    }
  }
);
const searchKeyword = computed(() => {
  // 문자열 끝에 있는 완성되지 않은 한글 자음/모음을 찾아서 반환
  return keyword.value.replace(/[ㄱ-ㅎㅏ-ㅣ]$/, '');
});

// --- API 호출 로직 ---
const callSuggestionAPI = async (newKeyword) => {
  console.log(newKeyword)
  if (!newKeyword || newKeyword.trim() === '') {
    searchStore.suggestions.value = [];
    return;
  }
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/recommend?keyword=${newKeyword}`);

    searchStore.suggestions.value = response.data;
  } catch (error) {
    console.error("API 호출 실패:", error);
    searchStore.suggestions.value = [];
  }
};
const debouncedFetch = _.debounce(callSuggestionAPI, 200);
watch(keyword, (newKeyword) => {
  debouncedFetch(newKeyword.replace(/[ㄱ-ㅎㅏ-ㅣ]$/, ''));
});


const handleInput = (event) => {
  const value = event.target.value;
  const regex = /[^a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣\s]/g;
  // 정규식에 해당하는 문자를 빈 문자열('')로 대체하여 제거
  const sanitizedValue = value.replace(regex, '').trim();
  searchStore.inputData = sanitizedValue;
  keyword.value = sanitizedValue;
  debouncedFetch(sanitizedValue);
};

const handleFocus = () => {
  isInputFocused.value = true;
  if (keyword.value && keyword.value.trim() !== '') {
    debouncedFetch(keyword.value);
  }
};

//검색 확정
const finalizeSearch = () => {
  searchStore.inputData = searchStore.keyword = keyword.value;
  // isInputFocused.value = false;
  historyStore.addRecentSearch(keyword.value);
  //결과 화면 랜더링
  searchStore.fetchSearchResult();

  inputRef.value?.blur();
};

const selectSuggestion = (suggestion) => {
  keyword.value = suggestion;
  finalizeSearch();
};

const hideSuggestions = () => {
  isInputFocused.value = false;
};
</script>

<style scoped>
.search-wrapper {
  position: relative;
  width: 98%;
}

.search-input {
  width: 95%;
  padding: 12px 16px;
  outline: none;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  border: none;
}
</style>