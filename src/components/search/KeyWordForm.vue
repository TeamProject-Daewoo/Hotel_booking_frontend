<template>
  <div class="search-wrapper" :class="{ 'is-focused': isInputFocused }">
    <input
      type="text"
      ref="inputRef"
      autocomplete="off"
      :value="inputData"
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
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import _ from 'lodash';
import { useSearchStore } from '@/api/searchRequestStore';
import axios from '@/api/axios';
import { useHistoryStore } from '@/store/recentHistoryStore';
import SearchSuggestions from './SearchSuggestions.vue';
import { storeToRefs } from 'pinia';
import router from '@/router';
import { useRoute } from 'vue-router';
import { useUiStore } from '@/store/commonUiStore';

const searchStore = useSearchStore();
const historyStore = useHistoryStore();
const route = useRoute();

const isInputFocused = ref(false);
const inputRef = ref(null);
const { inputData } = storeToRefs(searchStore);

const searchKeyword = computed(() => {
  // 문자열 끝에 있는 완성되지 않은 한글 자음/모음을 찾아서 반환
  return inputData.value.replace(/[ㄱ-ㅎㅏ-ㅣ]$/, '');
});
onMounted(() => {
  if (route.query.from === 'search') {
    inputRef.value.focus();
  }
  const newQuery = { ...route.query };
  delete newQuery.from;
  router.replace({ query: newQuery }); 
});

// --- API 호출 로직 ---
const callSuggestionAPI = async (newKeyword) => {
  // console.log(newKeyword)
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
const debouncedFetch = _.debounce(callSuggestionAPI, 100);
watch(inputData, (newKeyword) => {
  // if(newKeyword.length > 1) newKeyword = newKeyword.replace(/[ㄱ-ㅎㅏ-ㅣ]$/, '')
  debouncedFetch(newKeyword);
});


const handleInput = (event) => {
  const value = event.target.value;
  const regex = /[^a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣\s]/g;
  // 정규식에 해당하는 문자를 빈 문자열('')로 대체하여 제거
  const sanitizedValue = value.replace(regex, '').trim();
  searchStore.inputData = sanitizedValue;
  inputData.value = sanitizedValue;
  // console.log(searchStore.keyword)
  debouncedFetch(sanitizedValue);
};

const handleFocus = () => {
  isInputFocused.value = true;
  if (inputData.value && inputData.value.trim() !== '') {
    debouncedFetch(inputData.value);
  }
};

//검색 확정
const finalizeSearch = () => {
  if(inputData.value.trim() !== '') {
    searchStore.keyword = inputData.value;
    // isInputFocused.value = false;
    historyStore.addRecentSearch(inputData.value);
    //결과 화면 랜더링
    searchStore.fetchInitialSearch();

    inputRef.value?.blur();
  }
  else {
    const uiStore = useUiStore();
    uiStore.openModal({title: '검색 실패', message: '호텔명 또는 지역명을 입력해주세요'});
  }
};

const selectSuggestion = (suggestion) => {
  inputData.value = suggestion;
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