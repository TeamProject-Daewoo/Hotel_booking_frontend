<template>
  <div v-if="shouldShowSuggestions" class="suggestions-container">
    <li v-if="searchStore.suggestions.value && searchStore.suggestions.value.length === 0" class="no-results">
        추천 검색어가 없습니다.
    </li>
    <ul class="suggestions-list">
      <li
        v-for="(suggestion, index) in searchStore.suggestions.value"
        :key="index"
        class="suggestion-item"
        @mousedown.prevent="selectSuggestion(suggestion)"
        v-html="highlightMatch(suggestion)"
      >
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useSearchStore } from '@/api/searchRequestStore';
import { computed } from 'vue';

const searchStore = useSearchStore();

const shouldShowSuggestions = computed(() => {
  return searchStore.keyword && searchStore.keyword.length > 0;
});

const selectSuggestion = (suggestion) => {
  // 1. 스토어의 키워드를 선택한 검색어로 업데이트
  searchStore.keyword = suggestion;
  
  // 2. 추천 검색어 목록을 비워서 창을 닫음
  searchStore.suggestions = [];
  searchStore.fetchSearchResult();
};

const highlightMatch = (suggestion) => {
  if (!searchStore.keyword) {
    return suggestion;
  }
  const regex = new RegExp(`(${searchStore.keyword})`, 'gi');
  return suggestion.replace(regex, '<strong>$1</strong>');
};
</script>

<style scoped>
/* 추천 검색어 컨테이너 스타일 */
.suggestions-container {
  position: absolute; /* 부모 요소를 기준으로 위치를 잡습니다. */
  width: 100%;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-top: none; /* 검색창과 맞닿는 위쪽 테두리는 제거 */
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 900; /* 다른 요소들 위에 보이도록 z-index 설정 */
  max-height: 300px;
  overflow-y: auto;
}

/* 추천 검색어 목록 ul 태그 초기화 */
.suggestions-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* 각 추천 아이템 스타일 */
.suggestion-item {
  padding: 12px 16px;
  cursor: pointer;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.suggestion-item:last-child {
  border-bottom: none;
}

/* 아이템에 마우스를 올렸을 때 배경색 변경 */
.suggestion-item:hover {
  background-color: #f5f5f5;
}

/* 검색 결과가 없을 때 표시되는 메시지 스타일 */
.no-results {
  padding: 12px 16px;
  color: #888;
  text-align: center;
}

/* 하이라이팅 스타일 (v-html 내부의 strong 태그에 적용) */
.suggestion-item :deep(strong) {
  color: #007bff; /* 원하는 하이라이트 색상 */
  font-weight: bold;
}
</style>