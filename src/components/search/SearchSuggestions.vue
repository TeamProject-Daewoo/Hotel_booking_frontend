<template>
  <div class="search-wrapper">
      <div class="suggestions-container">
        <div v-if="!props.keyword">
          <h5 class="suggestions-heading">최근 검색어</h5>
          <div v-if="historyStore.recentSearches.length > 0" class="recent-searches-horizontal">
            <div class="tags-container">
              <span
                v-for="keyword in historyStore.recentSearches" :key="keyword"
                class="recent-search-item"
                @mousedown="onSelect(keyword)"
              >
                <span>{{ keyword }}</span><button @mousedown.prevent.stop="onDelete(keyword)" class="history-delete-btn"><i class="fa-solid fa-xmark"></i></button>
              </span>
            </div>
          </div>
          <div v-if="(historyStore.recentSearches.length === 0)" class="no-results">
            최근 검색어가 없습니다.
          </div>
        </div>
        <div v-else>
        <h5 class="suggestions-heading">추천 검색어</h5>
        <div v-if="searchStore.suggestions.value && searchStore.suggestions.value.length > 0">
          <ul class="suggestions-list">
            <li
              v-for="(suggestion, index) in searchStore.suggestions.value"
              :key="index"
              class="suggestion-item"
              @mousedown="onSelect(suggestion)"
              v-html="highlightMatch(suggestion)"
            ></li>
          </ul>
        </div>
        <div v-if="(!searchStore.suggestions.value || searchStore.suggestions.value.length === 0)" class="no-results">
          추천 검색어가 없습니다.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSearchStore } from '@/api/searchRequestStore';
import { useRecentHistory } from '@/store/recentHistoryStore';
import { computed } from 'vue';

const props = defineProps({
  keyword: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['select-suggestion', 'delete-history']);

const searchStore = useSearchStore();
const historyStore = useRecentHistory();

const shouldShow = computed(() => {
  return historyStore.recentSearches.length > 0 || searchStore.suggestions?.length > 0;
});

const onSelect = (suggestion) => {
  emit('select-suggestion', suggestion);
};

const onDelete = (keyword) => {
  emit('delete-history', keyword);
};

const highlightMatch = (suggestion) => {
  if (!props.keyword) {
    return suggestion;
  }
  const regex = new RegExp(`(${props.keyword})`, 'gi');
  return suggestion.replace(regex, '<strong>$1</strong>');
};
</script>

<style scoped>
.suggestions-container {
  position: absolute;
  top: 110%; /* input 바로 아래에 위치 */
  left: 0;
  width: 100%;
  border: 1px solid #e5e5e5;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  padding: 8px;
  z-index: 10; /* 다른 요소 위에 보이도록 z-index 추가 */
}

.suggestions-heading {
  font-size: 12px;
  color: #6b7280; /* 회색 계열 */
  font-weight: bold;
  padding: 8px 12px;
  margin: 0;
}

.suggestions-divider {
  border: none;
  border-top: 1px solid #f3f4f6; /* 연한 회색 구분선 */
  margin: 8px 0;
}

.history-delete-btn {
  border: none;
  border-radius: 20px;
  background: none;
}
.history-delete-btn:hover {
  background: rgb(221, 221, 221);
}
.recent-searches-horizontal {
  padding: 8px 12px;
}
.search-input {
  width: 100%;
}
.search-wrapper {
  position: relative;
  transition: width 0.3s ease;
}
.search-wrapper.is-focused {
  width: 500px;
}

.tags-container {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 최근 검색어 태그 스타일 */
.recent-search-item {
  display: inline-flex;
  background-color: #f3f4f6; /* 연한 회색 배경 */
  align-items: center;
  color: #4b5563;
  padding: 6px 12px;
  border-radius: 16px; /* 둥근 모서리 */
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.recent-search-item:hover {
  background-color: #e5e7eb; /* 호버 시 약간 더 진한 회색 */
}

.suggestion-item:hover {
  background-color: #f9fafb; /* 호버 효과 */
}
/* 추천 검색어 컨테이너 스타일 */
.suggestions-container {
  position: absolute;
  width: 100%;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-top: none; 
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 900;
  max-height: 300px;
  overflow-y: auto;
}
::-webkit-scrollbar {
  display: none;
}

/*특정 부분 스크롤바 없애기*/

.box{
   -ms-overflow-style: none;
}
.box::-webkit-scrollbar{
  display:none;
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