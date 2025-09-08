<template>
  <div class="view-container">
    <div class="header-section">
      <h1 class="view-title">내가 작성한 리뷰</h1>
      <div class="filter-options">
        <select class="filter-select">
          <option>6개월</option>
          <option>1년</option>
          <option>전체</option>
        </select>
      </div>
    </div>

    <div class="review-count-bar">
      <span>리뷰 <strong>{{ reviews.length }}</strong></span>
    </div>

    <div v-if="reviews.length > 0" class="review-list">
      <div v-for="review in reviews" :key="review.id" class="review-card">
        <div class="hotel-info">
          <img :src="review.imageUrl" alt="호텔 이미지" class="hotel-thumbnail">
          <div class="hotel-details">
            <span class="hotel-provider">[여기어때] {{ review.hotelName }}</span>
            <p class="hotel-description">{{ review.roomType }}</p>
          </div>
          <button class="delete-button-icon">&times;</button>
        </div>
        <div class="rating-section">
          <div class="star-rating">
            <span v-for="n in 5" :key="n" class="star" :class="{ 'filled': n <= review.rating }">★</span>
          </div>
          <span class="rating-value">{{ review.rating }}</span>
          <button class="edit-button">수정</button>
        </div>
        <p class="review-text">
          <span class="helpful-badge">도움돼요</span>
          {{ review.reviewText }}
        </p>
      </div>
    </div>
    <div v-else class="empty-state">
      <h2 class="empty-title">작성한 리뷰가 없습니다.</h2>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const reviews = ref([]);

const fetchReviews = () => {
  reviews.value = [
    { id: 1, hotelName: '서울 신라호텔', roomType: '디럭스 더블룸 / 1박', imageUrl: 'https://placehold.co/100x100/e2e8f0/64748b?text=Hotel', rating: 5, reviewText: '부모님 모시고 다녀왔는데 너무 좋아하셨어요! 역시 신라호텔입니다. 룸 컨디션, 서비스, 조식 뭐하나 빠지는게 없네요.' },
    { id: 2, hotelName: '부산 파라다이스 호텔', roomType: '오션뷰 트윈룸 / 2박', imageUrl: 'https://placehold.co/100x100/e2e8f0/64748b?text=Hotel', rating: 4, reviewText: '해운대 바로 앞이라 위치가 정말 좋습니다. 수영장도 잘 되어있어서 아이들이 정말 좋아했어요. 재방문 의사 있습니다.' },
  ];
};

onMounted(fetchReviews);
</script>

<style scoped>
.view-container { background-color: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
.header-section { display: flex; justify-content: space-between; align-items: center; }
.view-title { font-size: 1.5rem; font-weight: 700; color: #111827; }
.filter-select { border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.5rem; font-size: 0.875rem; }
.review-count-bar { padding: 1rem 0; margin-top: 1.5rem; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; font-size: 0.9rem; color: #4b5563; }
.review-list { display: flex; flex-direction: column; }
.review-card { padding: 1.5rem 0; border-bottom: 1px solid #f3f4f6; }
.review-card:last-child { border-bottom: none; }
.hotel-info { display: flex; align-items: center; gap: 1rem; }
.hotel-thumbnail { width: 60px; height: 60px; border-radius: 0.25rem; }
.hotel-details { flex-grow: 1; }
.hotel-provider { font-size: 0.8rem; color: #6b7280; }
.hotel-description { font-size: 0.9rem; font-weight: 500; color: #1f2937; margin-top: 0.25rem; }
.delete-button-icon { background: none; border: none; font-size: 1.5rem; color: #9ca3af; cursor: pointer; }
.rating-section { display: flex; align-items: center; gap: 0.5rem; margin-top: 1rem; }
.star-rating { display: flex; }
.star-rating .star { font-size: 1.25rem; color: #d1d5db; }
.star-rating .star.filled { color: #facc15; }
.rating-value { font-weight: 700; font-size: 1rem; }
.edit-button { border: 1px solid #d1d5db; background-color: white; border-radius: 0.25rem; padding: 0.25rem 0.75rem; font-size: 0.8rem; cursor: pointer; margin-left: auto; }
.review-text { margin-top: 1rem; font-size: 0.9rem; color: #374151; line-height: 1.6; }
.helpful-badge { background-color: #eff6ff; color: #3b82f6; font-size: 0.75rem; font-weight: 500; padding: 0.2rem 0.5rem; border-radius: 0.25rem; margin-right: 0.5rem; }
.empty-state { text-align: center; padding: 3rem 0; }
.empty-title { font-size: 1.25rem; font-weight: 700; }
</style>