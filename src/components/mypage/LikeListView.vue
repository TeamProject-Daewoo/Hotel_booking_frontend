<template>
  <div class="view-container">
    <h1 class="view-title">찜 목록</h1>
    <div v-if="likes.length > 0" class="like-grid">
      <div v-for="like in likes" :key="like.id" class="like-card">
        <img :src="like.imageUrl" alt="숙소 이미지" class="hotel-image">
        <div class="card-content">
          <h3 class="hotel-name">{{ like.hotelName }}</h3>
          <p class="hotel-address">{{ like.address }}</p>
          <div class="rating-info">
            <span class="star filled">★</span>
            <span class="rating-score">{{ like.rating }}</span>
            <span class="review-count">({{ like.reviewCount }})</span>
          </div>
          <button class="book-button">예약하기</button>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">
      <h2 class="empty-title">찜한 숙소가 없습니다.</h2>
      <p class="empty-description">마음에 드는 숙소를 찜하고 목록에서 확인해보세요.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const likes = ref([]);

const fetchLikes = () => {
  likes.value = [
    { id: 1, hotelName: '강릉 씨마크 호텔', address: '강원도 강릉시', rating: 4.8, reviewCount: 1204, imageUrl: 'https://placehold.co/600x400/a3e635/ffffff?text=Hotel' },
    { id: 2, hotelName: '여수 베네치아 호텔', address: '전라남도 여수시', rating: 4.7, reviewCount: 982, imageUrl: 'https://placehold.co/600x400/67e8f9/ffffff?text=Hotel' },
    { id: 3, hotelName: '경주 힐튼 호텔', address: '경상북도 경주시', rating: 4.6, reviewCount: 856, imageUrl: 'https://placehold.co/600x400/f9a8d4/ffffff?text=Hotel' },
  ];
};

onMounted(fetchLikes);
</script>

<style scoped>
.view-container { background-color: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
.view-title { font-size: 1.5rem; font-weight: 700; color: #111827; margin-bottom: 1.5rem; }
.like-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
.like-card { border-radius: 0.5rem; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); }
.hotel-image { width: 100%; height: 180px; object-fit: cover; }
.card-content { padding: 1rem; }
.hotel-name { font-weight: 700; font-size: 1.1rem; color: #1f2937; }
.hotel-address { font-size: 0.8rem; color: #6b7280; margin: 0.25rem 0; }
.rating-info { display: flex; align-items: center; margin: 0.5rem 0; }
.star.filled { color: #f59e0b; }
.rating-score { font-weight: 600; margin-left: 0.25rem; }
.review-count { font-size: 0.8rem; color: #6b7280; margin-left: 0.25rem; }
.book-button { width: 100%; background-color: #1e40af; color: white; border: none; padding: 0.75rem; border-radius: 0.25rem; font-weight: 600; cursor: pointer; margin-top: 1rem; }
.empty-state { text-align: center; padding: 3rem 0; }
.empty-title { font-size: 1.25rem; font-weight: 700; }
.empty-description { margin-top: 0.5rem; color: #6b7280; }

@media (max-width: 1024px) { .like-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .like-grid { grid-template-columns: repeat(1, 1fr); } }
</style>