<template>
  <div class="notice-list">
    <h2>공지사항</h2>

    <div class="filter-bar">
      <button :class="{ active: selectedCategory === '' }" @click="selectedCategory = ''; fetchNoticesPaged(0)">전체</button>
      <button :class="{ active: selectedCategory === 'notice' }" @click="selectedCategory = 'notice'; fetchNoticesPaged(0)">공지</button>
      <button :class="{ active: selectedCategory === 'patch' }" @click="selectedCategory = 'patch'; fetchNoticesPaged(0)">패치</button>
      <button :class="{ active: selectedCategory === 'event' }" @click="selectedCategory = 'event'; fetchNoticesPaged(0)">이벤트</button>

      <input type="text" v-model="searchTerm" placeholder="제목" @input="fetchNoticesPaged(0)" />
       
    </div>

    <ul class="notice-items">
      <li
        v-for="notice in filteredNotices"
        :key="notice.id"
        class="notice-item"
        @click="goDetail(notice.id)"
      >
        <span class="category" :class="notice.category">{{ categoryLabel(notice.category) }}</span>
        <span class="title">{{ notice.title }}</span>
        <span class="date">{{ formatDate(notice.createdAt) }}</span>
      </li>
    </ul>

    <div class="pagination" v-if="totalPages > 1">
      <button @click="goPrev" :disabled="currentPage === 0">이전</button>

      <button
        v-for="page in totalPages"
        :key="page"
        :class="{ active: page - 1 === currentPage }"
        @click="goPage(page - 1)"
      >
        {{ page }}
      </button>

      <button @click="goNext" :disabled="currentPage === totalPages - 1">다음</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
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

// 필터링된 데이터 (카테고리와 제목 검색 필터링)
const filteredNotices = computed(() => {
  return notices.value.filter(n => {
    const matchCategory = selectedCategory.value === '' || n.category === selectedCategory.value;
    const matchSearch = n.title.toLowerCase().includes(searchTerm.value.toLowerCase());
    return matchCategory && matchSearch;
  });
});

// 카테고리 라벨 표시 함수
const categoryLabel = (cat) => {
  switch (cat) {
    case 'notice':
      return '공지';
    case 'patch':
      return '점검';
    case 'event':
      return '이벤트';
    default:
      return '';
  }
};

// 날짜 포맷팅
const formatDate = (dateStr) => {
  return new Date(dateStr).toISOString().split('T')[0];
};

const goDetail = async (id) => {
  try {
    // 상세 데이터 조회 API 호출 (예: /api/notices/{id})
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notices/${id}`);
    // 정상적으로 데이터 있으면 상세 페이지로 이동
    router.push({ name: 'NoticeDetail', params: { id } });
  } catch (error) {
    // 404나 기타 에러면 삭제된 글로 간주하고 알림 띄우기
    if (error.response && error.response.status === 404) {
      uiStore.openModal('이 게시물은 삭제되었습니다.');
    } else {
      console.error('공지사항 상세 조회 실패:', error);
      uiStore.openModal('공지사항 상세 조회 중 오류가 발생했습니다.');
    }
  }
};

// 공지사항 페이징 API 호출
const fetchNoticesPaged = async (page = 0) => {
  try {
    // API 요청 파라미터로 카테고리, 검색어 포함하려면 백엔드 쪽도 수정 필요
    // 지금은 페이징만 적용되어 있음
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notices/paged?page=${page}&size=${pageSize}`);
    notices.value = res.data.content;
    totalPages.value = res.data.totalPages;
    currentPage.value = res.data.pageNumber;
  } catch (error) {
    console.error('공지사항 불러오기 실패:', error);
  }
};

// 페이징 버튼 함수들
const goPage = (page) => {
  if (page < 0 || page >= totalPages.value) return;
  fetchNoticesPaged(page);
};

const goNext = () => {
  if (currentPage.value < totalPages.value - 1) {
    fetchNoticesPaged(currentPage.value + 1);
  }
};

const goPrev = () => {
  if (currentPage.value > 0) {
    fetchNoticesPaged(currentPage.value - 1);
  }
};


// 최초 데이터 로드
fetchNoticesPaged(0);

// 검색어나 카테고리 바뀌면 첫 페이지로 다시 조회 (필터링은 백엔드로 구현해야 정확)
watch([selectedCategory, searchTerm], () => {
  fetchNoticesPaged(0);
});
</script>

<style scoped>

.notice-list {
  max-width: 900px;
  margin: 40px auto;
  font-family: "Noto Sans KR", sans-serif;
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 20px;
  text-align: left;
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.filter-bar button {
  padding: 8px 15px;
  border: none;
  border-radius: 20px;
  background-color: #e0e0e0;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.filter-bar button.active {
  background-color: #42b983;
  color: white;
}

.filter-bar input {
  margin-left: auto;
  padding: 8px 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 200px;
}

.notice-items {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notice-items li {
  display: flex;
  align-items: center;
  padding: 12px 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}

.notice-items li:hover {
  background-color: #f0f9f5;
}

.category {
  display: inline-block;
  width: 50px;
  font-weight: 600;
  text-align: center;
  margin-right: 10px;
  border-radius: 6px;
  padding: 4px 6px;
  color: white;
  font-size: 0.9rem;
}

.category.notice {
  background-color: #3498db;
}
.category.patch {
  background-color: #27ae60;
}
.category.event {
  background-color: #9b59b6;
}

.title {
  flex: 1;
  color: #42b983;
}

.date {
  font-size: 0.85rem;
  color: #888;
}

/* 페이징 버튼 스타일 */
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 6px;
}

.pagination button {
  padding: 6px 12px;
  border: none;
  background-color: #eee;
  cursor: pointer;
  border-radius: 4px;
}

.pagination button.active {
  background-color: #42b983;
  color: white;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
