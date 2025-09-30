<template>
  <div class="view-container">
    <h1 class="view-title">내 포인트</h1>

    <div class="point-card">
      <div class="current-point">{{ currentPoint.toLocaleString() }} P</div>
      <div class="point-expire">180일 뒤 첫 포인트가 소멸됩니다.</div>
    </div>

    <div class="point-filters">
      <button :class="{ active: filter === 'all' }" @click="filter = 'all'">전체</button>
      <button :class="{ active: filter === 'earned' }" @click="filter = 'earned'">적립</button>
      <button :class="{ active: filter === 'used' }" @click="filter = 'used'">사용</button>
    </div>

    <div v-if="filteredList.length" class="point-list">
      <div v-for="item in filteredList" :key="item.id" class="point-item">
        <div class="point-info">
          <span class="point-date">{{ formatDate(item.transactionDate) }}</span>
          <span class="point-hotel">{{ item.description }}</span>
        </div>
        <div class="point-amount" :class="item.type.toLowerCase()">
          {{ item.type === 'EARNED' ? '+' : '-' }} {{ item.points.toLocaleString() }} P
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <h2>포인트 내역이 없습니다.</h2>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/api/axios';
import { useAuthStore } from '@/api/auth.js';

const authStore = useAuthStore();
const pointList = ref([]);
const filter = ref('all');

// 보유 포인트는 authStore와 실시간 연동
const currentPoint = computed(() => authStore.points);

onMounted(async () => {
  try {
    // 1. 최신 포인트 정보 가져오기
    await authStore.fetchAndUpdatePoints();

    // 2. 새로운 포인트 내역 API 호출
    const res = await api.get('/api/mypage/points');
    pointList.value = res.data;

  } catch (error) {
    console.error('포인트 내역 불러오기 실패', error);
  }
});

// 3. 필터 로직을 새로운 데이터 구조에 맞게 수정
const filteredList = computed(() => {
  if (filter.value === 'all') {
    return pointList.value;
  }
  // 'EARNED' 또는 'USED' 타입으로 필터링
  return pointList.value.filter(p => p.type.toLowerCase() === filter.value);
});

// 4. 날짜 포맷팅 함수 추가
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};
</script>

<style scoped>
/* 기존 스타일은 그대로 유지 */
.view-container { height: 600px;background-color: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 1px 2px rgb(0 0 0 / 5%); }
.view-title { font-size: 1.5rem; font-weight: 700; color: #111827; margin-bottom: 1.5rem; text-align: left; }
.point-card { background-color: #f3f4f6; padding: 1.5rem; border-radius: 12px; text-align: left; margin-bottom: 2rem; }
.current-point { font-size: 1.5rem; font-weight: 700; color: #1e40af; margin-bottom: 0.25rem; }
.point-expire { font-size: 0.85rem; color: #6b7280; }
.point-filters { display: flex; justify-content: center; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.point-filters button { padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 6px; background-color: #f9fafb; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; }
.point-filters button.active { background-color: #1e40af; color: white; border-color: #1e40af; }
.point-filters button:hover { background-color: #e5e7eb; }
.point-list { display: flex; flex-direction: column; gap: 1rem; }
.point-item { display: flex; justify-content: space-between; padding: 0.75rem 1rem; border-radius: 8px; background-color: #f9fafb; align-items: center; }
.point-info { display: flex; flex-direction: column; }
.point-date { font-size: 0.85rem; color: #6b7280; }
.point-hotel { font-size: 0.95rem; font-weight: 500; color: #374151; }
.point-amount { font-weight: 600; font-size: 1rem; }
.empty-state { text-align: center; color: #6b7280; font-size: 1rem; padding: 3rem 0; }

/* ✨ 적립/사용에 따라 색상을 다르게 표시하기 위한 스타일 추가 */
.point-amount.earned {
  color: #1e40af; /* 적립: 파란색 */
}
.point-amount.used {
  color: #dc2626; /* 사용: 빨간색 */
}
</style>