<template>
  <div class="view-container">
    <!-- 페이지 제목 -->
    <h1 class="view-title">내 포인트</h1>

    <!-- 현재 포인트 카드 -->
    <div class="point-card">
      <div class="current-point">{{ currentPoint.toLocaleString() }} P</div>
      <div class="point-expire">180일 뒤 포인트 소멸</div>
    </div>

    <!-- 필터 버튼 -->
    <div class="point-filters">
      <button :class="{ active: filter === 'all' }" @click="filter = 'all'">전체</button>
      <button :class="{ active: filter === 'earned' }" @click="filter = 'earned'">적립</button>
      <button :class="{ active: filter === 'used' }" @click="filter = 'used'">사용</button>
      <button :class="{ active: filter === 'expired' }" @click="filter = 'expired'">소멸</button>
    </div>

    <!-- 포인트 내역 리스트 -->
    <div v-if="filteredList.length" class="point-list">
      <div v-for="item in filteredList" :key="item.reservationId" class="point-item">
        <div class="point-info">
          <span class="point-date">{{ item.date }}</span>
          <span class="point-hotel">{{ item.hotelName }}</span>
        </div>
        <div class="point-amount" :class="item.type">
          {{ item.usedPoints.toLocaleString() }} P
        </div>
      </div>
    </div>

    <!-- 항목 없을 때 -->
    <div v-else class="empty-state">
      <h2>포인트 내역이 없습니다.</h2>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/api/axios';
import { useAuthStore } from '@/api/auth';

const authStore = useAuthStore();
const currentPoint = ref(authStore.points || 0);
const pointList = ref([]);
const filter = ref('all');

onMounted(async () => {
  try {
    // DB PK(user_name)와 맞는 값으로 API 호출
    const usernameForApi = authStore.userName || authStore.userName;
    const res = await api.get(`/api/reservations/user/${usernameForApi}`);
    pointList.value = res.data; // 이미 사용 포인트만 리턴되도록 백엔드에서 처리됨
  } catch (error) {
    console.error('포인트 내역 불러오기 실패', error);
  }
});

// 필터 적용
const filteredList = computed(() => {
  if (filter.value === 'all') return pointList.value;
  return pointList.value.filter(p => p.type === filter.value);
});
</script>

<style scoped>
.view-container {
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgb(0 0 0 / 5%);
}

.view-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.5rem;
  text-align: left;
}

.point-card {
  background-color: #f3f4f6;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: left;
  margin-bottom: 2rem;
}

.current-point {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 0.25rem;
}

.point-expire {
  font-size: 0.85rem;
  color: #6b7280;
}

.point-filters {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.point-filters button {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: #f9fafb;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.point-filters button.active {
  background-color: #1e40af;
  color: white;
  border-color: #1e40af;
}

.point-filters button:hover {
  background-color: #e5e7eb;
}

.point-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.point-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background-color: #f9fafb;
  align-items: center;
}

.point-info {
  display: flex;
  flex-direction: column;
}

.point-date {
  font-size: 0.85rem;
  color: #6b7280;
}

.point-hotel {
  font-size: 0.95rem;
  font-weight: 500;
  color: #374151;
}

.point-amount {
  font-weight: 600;
  font-size: 1rem;
}

.point-amount.used {
  color: #dc2626;
}

.empty-state {
  text-align: center;
  color: #6b7280;
  font-size: 1rem;
  padding: 3rem 0;
}
</style>
