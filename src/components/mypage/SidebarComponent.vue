<template>
  <aside class="sidebar-container">
    <nav class="sidebar-nav">
      <a v-for="item in menuItems"
         :key="item.key"
         href="#"
         @click.prevent="$emit('navigate', item.key)"
         :class="['menu-item', { 'active': currentPage === item.key }]">
        {{ item.name }}
      </a>
    </nav>
  </aside>
</template>

<script setup>
import { ref } from 'vue';

defineProps(['currentPage']);
defineEmits(['navigate']);

const menuItems = ref([
  { key: 'profile', name: '내 정보 관리' },
  { key: 'bookings', name: '예약 내역' },
  { key: 'reviews', name: '리뷰 목록' },
  { key: 'likes', name: '찜 목록' },
  { key: 'points', name: '포인트 현황' },
  { key: 'settings', name: '설정' }

]);
</script>

<style scoped>
.sidebar-container {
  width: 240px;
  flex-shrink: 0;
}
.sidebar-nav {
  background-color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
.menu-item {
  display: block;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  color: #4b5563;
  border-radius: 0.375rem;
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
}
.menu-item:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}
.menu-item.active {
  background-color: #f3f4f6;
  font-weight: 600;
  color: #1e40af;
}

@media (max-width: 768px) {
  .sidebar-container {
    width: 100%;
    margin-bottom: 2rem;
  }
}
</style>