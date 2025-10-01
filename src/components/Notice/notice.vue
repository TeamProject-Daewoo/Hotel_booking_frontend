<template>
  <div class="notice-container">
    <div class="header-section">
      <h2>NOTICE</h2>
      <p>호텔의 새로운 소식을 확인해보세요.</p>
    </div>

    <div class="filter-bar">
      <div class="categories">
        <button :class="{ active: selectedCategory === '' }" @click="selectCategory('')">ALL</button>
        <button :class="{ active: selectedCategory === 'notice' }" @click="selectCategory('notice')">공지</button>
        <button :class="{ active: selectedCategory === 'patch' }" @click="selectCategory('patch')">패치</button>
        <button :class="{ active: selectedCategory === 'event' }" @click="selectCategory('event')">이벤트</button>
      </div>
      <div class="search-wrapper">
        <input type="text" v-model="searchTerm" placeholder="Search..." @input="debouncedFetch" />
      </div>
    </div>

    <div v-if="isLoading" class="loading-spinner"></div>

    <div v-if="!isLoading && notices.length === 0" class="no-results">
      <p>검색 결과가 없습니다.</p>
    </div>

    <div v-if="!isLoading && notices.length > 0" class="notice-table">
      <div class="table-header">
        <div class="header-item category-col">분류</div>
        <div class="header-item title-col">제목</div>
        <div class="header-item date-col">작성일</div>
      </div>
      <div
          v-for="(notice, index) in notices"
          :key="notice.id"
          class="notice-row"
          :style="{ animationDelay: `${index * 0.07}s` }"
          @click="goDetail(notice.id)"
      >
        <div class="row-item category-col">
          <span class="category" :class="notice.category">{{ categoryLabel(notice.category) }}</span>
        </div>
        <div class="row-item title-col">{{ notice.title }}</div>
        <div class="row-item date-col">{{ formatDate(notice.createdAt) }}</div>
      </div>
    </div>

    <div class="pagination" v-if="totalPages > 1 && !isLoading">
      <button @click="goPrev" :disabled="currentPage === 0">‹</button>
      <button
          v-for="page in totalPages"
          :key="page"
          :class="{ active: page - 1 === currentPage }"
          @click="goPage(page - 1)"
      >
        {{ page }}
      </button>
      <button @click="goNext" :disabled="currentPage === totalPages - 1">›</button>
    </div>
  </div>
</template>

<script setup>

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useUiStore } from '@/store/commonUiStore';

const router = useRouter();
const uiStore = useUiStore();

const notices = ref([]);
const selectedCategory = ref('');
const searchTerm = ref('');
const totalPages = ref(0);
const currentPage = ref(0);
const pageSize = 10;
const isLoading = ref(true);

const categoryLabel = (cat) => ({ notice: '공지', patch: '점검', event: '이벤트' }[cat] || '');
const formatDate = (dateStr) => dateStr ? new Date(dateStr).toISOString().split('T')[0] : '';

const goDetail = async (id) => {
  try {
    await axios.get(`${import.meta.env.VITE_API_URL}/api/notices/${id}`);
    router.push({ name: 'NoticeDetail', params: { id } });
  } catch (error) {
    uiStore.openModal(error.response?.status === 404 ? '삭제되었거나 존재하지 않는 게시물입니다.' : '게시물을 불러오는 중 오류가 발생했습니다.');
  }
};

function debounce(func, delay = 400) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

const fetchNoticesPaged = async (page = 0) => {
  isLoading.value = true;
  if(page === 0) notices.value = []; // 첫 페이지 로드 시에만 초기화하여 깜빡임 최소화

  try {
    const params = { page, size: pageSize, category: selectedCategory.value || null, title: searchTerm.value || null };
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notices/paged`, { params });
    notices.value = res.data.content;
    totalPages.value = res.data.totalPages;
    currentPage.value = res.data.pageNumber;
  } catch (error) {
    console.error('공지사항 불러오기 실패:', error);
    uiStore.openModal('공지사항을 불러오는 데 실패했습니다.');
  } finally {
    isLoading.value = false;
  }
};

const debouncedFetch = debounce(() => fetchNoticesPaged(0));

const selectCategory = (category) => {
  selectedCategory.value = category;
  fetchNoticesPaged(0);
};

const goPage = (page) => fetchNoticesPaged(page);
const goNext = () => currentPage.value < totalPages.value - 1 && fetchNoticesPaged(currentPage.value + 1);
const goPrev = () => currentPage.value > 0 && fetchNoticesPaged(currentPage.value - 1);

fetchNoticesPaged(0);
</script>

<style scoped>
/* CSS 변수를 사용해 테마 색상을 쉽게 변경할 수 있습니다. */
:root {
  --bg-color: #1a1a1d;
  --surface-color: #2c2c31;
  --primary-color: #c3a177; /* 고급스러운 골드 컬러 */
  --text-primary: #f0f0f0;
  --text-secondary: #a9a9b3;
  --border-color: #404046;
}

.notice-container {
  max-width: 1000px;
  margin: 40px auto;
  padding: 40px;
  font-family: 'Noto Sans KR', sans-serif;
  background-color: var(--bg-color);
  border-radius: 10px;
  color: var(--text-primary);
}

.header-section {
  text-align: center;
  margin-bottom: 40px;
}
.header-section h2 {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--primary-color);
  margin-bottom: 5px;
}
.header-section p {
  color: var(--text-secondary);
  font-size: 1rem;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.categories button {
  padding: 8px 18px;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  background: none;
  color: var(--text-secondary);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 10px;
}

.categories button:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.categories button.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: var(--bg-color);
  font-weight: 700;
}

.search-wrapper input {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 10px 20px;
  width: 280px;
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.search-wrapper input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 10px rgba(195, 161, 119, 0.3);
}

.loading-spinner {
  border: 4px solid var(--surface-color);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 80px auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.no-results {
  text-align: center;
  padding: 80px 0;
  color: var(--text-secondary);
  background-color: var(--surface-color);
  border-radius: 8px;
  font-size: 1.1rem;
}

/* --- 모던 테이블 레이아웃 --- */
.notice-table {
  background-color: var(--surface-color);
  border-radius: 8px;
  overflow: hidden;
}

.table-header, .notice-row {
  display: grid;
  grid-template-columns: 120px 1fr 150px;
  align-items: center;
  padding: 0 25px;
}

.table-header {
  padding: 18px 25px;
  background-color: rgba(0,0,0,0.2);
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 0.9rem;
  border-bottom: 2px solid var(--border-color);
}

.notice-row {
  border-bottom: 1px solid var(--border-color);
  padding: 20px 25px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  opacity: 0; /* 애니메이션 시작 전 숨김 */
  animation: slideUp 0.5s ease-out forwards;
}

.notice-row:last-child {
  border-bottom: none;
}

.notice-row:hover {
  background-color: rgba(195, 161, 119, 0.08); /* 골드 색상으로 은은하게 */
  transform: scale(1.015);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.title-col { font-weight: 500; color: var(--text-primary); }
.date-col { text-align: right; color: var(--text-secondary); font-size: 0.9rem; }

.category {
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 15px;
  color: #fff;
  font-size: 0.8rem;
  text-align: center;
}

.category.notice { background-color: #17a2b8; }
.category.patch { background-color: #28a745; }
.category.event { background-color: #6f42c1; }

/* 페이지네이션 */
.pagination {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.pagination button {
  background: none;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination button:hover:not(:disabled) {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.pagination button.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: var(--bg-color);
  font-weight: 700;
}

.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>