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

    <div v-if="loading" class="loading-state">
      <h2>포인트 내역을 불러오는 중입니다...</h2>
    </div>

    <div v-else-if="filteredList.length === 0" class="empty-state">
      <h2>선택하신 내역이 없습니다.</h2>
    </div>

    <div v-else class="point-list">
      <div v-for="item in filteredList" :key="item.id" class="point-item">
        <div class="point-info">
          <div class="point-date-time-wrapper">
            <span class="day-part">{{ formatDate(item.transactionDate) }}</span>
            <span class="time-part">{{ formatTime(item.transactionDate) }}</span>
          </div>
          <span class="point-description">{{ item.hotelName || item.description }}</span>
        </div>
        <div class="point-amount" :class="item.type.toLowerCase()">
          {{ item.points > 0 ? '+' : '' }}{{ item.points.toLocaleString() }} P
        </div>
      </div>
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
const loading = ref(true);

const currentPoint = computed(() => authStore.points);

onMounted(async () => {
  try {
    await authStore.fetchAndUpdatePoints();
    const res = await api.get('/api/mypage/points');
    pointList.value = res.data;
  } catch (error) {
    console.error('포인트 내역 불러오기 실패', error);
  } finally {
    loading.value = false;
  }
});

const filteredList = computed(() => {
  if (filter.value === 'all') {
    return pointList.value;
  }
  return pointList.value.filter(p => p.type.toLowerCase() === filter.value);
});

// [수정] 어떤 형식의 날짜든 완전한 Date 객체로 변환하는 함수
const parseDate = (dateValue) => {
  if (!dateValue) return null;

  // 1. 이미 Date 객체인 경우
  if (dateValue instanceof Date) {
    return dateValue;
  }
  // 2. 배열 형식인 경우 (e.g., [2025, 10, 8, ...])
  if (Array.isArray(dateValue)) {
    const [year, month, day, hour = 0, minute = 0, second = 0] = dateValue;
    // 월(month)은 0부터 시작하므로 1을 빼줍니다.
    const date = new Date(year, month - 1, day, hour, minute, second);
    return isNaN(date.getTime()) ? null : date;
  }
  // 3. 문자열 또는 숫자 형식인 경우
  const date = new Date(dateValue);
  return isNaN(date.getTime()) ? null : date;
};

// [수정] 날짜 포맷 함수 (YYYY-MM-DD)
const formatDate = (dateValue) => {
  const date = parseDate(dateValue);
  if (!date) return '';
  return date.toISOString().split('T')[0];
};

// [수정] 시간 포맷 함수 (오전/오후 HH:MM)
const formatTime = (dateValue) => {
  const date = parseDate(dateValue);
  if (!date) return '';

  const minutes = String(date.getMinutes()).padStart(2, '0');
  let hours = date.getHours();
  const ampm = hours >= 12 ? '오후' : '오전';
  hours = hours % 12 || 12; // 0시는 12시로 표시

  return `${ampm} ${String(hours).padStart(2, '0')}:${minutes}`;
};
</script>


<style scoped>
.view-container { min-height: 600px; background-color: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 1px 2px rgb(0 0 0 / 5%); }
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
.point-info { display: flex; align-items: center; gap: 1.5rem; flex-grow: 1; }
.point-date-time-wrapper { display: flex; align-items: center; gap: 1.2rem; width: 250px; flex-shrink: 0; font-size: 0.9rem; color: #000000; }
.point-description { font-size: 0.95rem; font-weight: 500; color: #374151; text-align: left; }
.day-part{ font-size: 1rem; font-weight: bold; }
.time-part{ font-size: 0.8rem; color: #3e3e40; }
.point-amount { font-weight: 600; font-size: 1rem; min-width: 90px; text-align: right; }
.empty-state, .loading-state { text-align: center; color: #6b7280; font-size: 1rem; padding: 3rem 0; }
.point-amount.earned { color: #1e40af; }
.point-amount.used { color: #dc2626; }
</style>