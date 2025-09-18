<template>
  <div v-if="notice" class="notice-detail">
    <h2 class="title">{{ notice.title }}</h2>
    <div class="meta">
      <span class="category" :class="notice.category">{{ categoryLabel(notice.category) }}</span>
      <span class="date">작성일: {{ formatDate(notice.createdAt) }}</span>
    </div>
    <hr />
    <div class="content" v-html="notice.content"></div>
  </div>
  <div v-else class="loading">
    로딩 중...
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const notice = ref(null);

const categoryLabel = (cat) => {
  switch (cat) {
    case 'notice': return '공지';
    case 'patch': return '패치';
    case 'event': return '이벤트';
    default: return '';
  }
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString();
};

onMounted(async () => {
  const id = route.params.id;
  try {
    const res = await axios.get(`http://localhost:8888/api/notices/${id}`);
    notice.value = res.data;
  } catch (error) {
    console.error('공지 상세 조회 실패:', error);
  }
});
</script>

<style scoped>
.notice-detail {
  max-width: 700px;
  margin: 40px auto;
  font-family: "Noto Sans KR", sans-serif;
  background: #fff;
  padding: 30px 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 15px;
  color: #333;
}

.meta {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.category {
  padding: 5px 12px;
  border-radius: 20px;
  font-weight: 600;
  color: white;
  font-size: 0.9rem;
  user-select: none;
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

.date {
  color: #666;
  font-size: 0.9rem;
}

hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 25px 0;
}

.content {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #444;
  white-space: pre-wrap; /* 줄바꿈 유지 */
}

.loading {
  max-width: 700px;
  margin: 80px auto;
  font-size: 1.3rem;
  color: #999;
  text-align: center;
  font-family: "Noto Sans KR", sans-serif;
}
</style>
