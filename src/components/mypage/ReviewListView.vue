<template>
  <div class="view-container">
    <h1 class="view-title">내가 작성한 리뷰</h1>
    <div class="review-count-bar">
      <span>리뷰 <strong>{{ reviews.length }}</strong></span>
    </div>

    <div v-if="isLoading" class="loading-state">
      <p>리뷰를 불러오는 중입니다...</p>
    </div>
    <div v-else-if="reviews.length > 0" class="review-list">
      <div v-for="review in reviews" :key="review.reviewId" class="review-card">
        <div class="info-section">
          <div class="hotel-details">
            <span class="hotel-name">{{ review.hotelName }}</span>
            <p class="review-date">{{ formatDate(review.reviewDate) }}</p>
          </div>
          <div class="rating-section">
            <div class="star-rating">
              <span v-for="n in 5" :key="n" class="star" :class="{ 'filled': n <= review.rating }">★</span>
            </div>
          </div>
        </div>

        <div class="content-section">
          <p class="review-text">{{ review.reviewText }}</p>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">
      <h2 class="empty-title">작성한 리뷰가 없습니다.</h2>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';

const reviews = ref([]);
const isLoading = ref(true);

const fetchReviews = async () => {
  try {
    const response = await api.get('/api/mypage/reviews');
    reviews.value = response.data;
  } catch (error) {
    console.error("리뷰를 불러오는 데 실패했습니다.", error);
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('ko-KR');
};

onMounted(fetchReviews);
</script>

<style scoped>
.view-container { background-color: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
.view-title { font-size: 1.5rem; font-weight: 700; color: #111827; }
.review-count-bar { padding: 1rem 0; margin-top: 1.5rem; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; font-size: 0.9rem; color: #4b5563; }
.review-list { display: flex; flex-direction: column; }
.review-card {
  display: flex;
  padding: 1.5rem 0;
  border-bottom: 1px solid #f3f4f6;
}
.review-card:last-child {
  border-bottom: none;
}
.info-section {
  flex: 0 0 30%;
  padding-right: 1.5rem;
  border-right: 1px solid #f3f4f6;
}
.hotel-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}
.review-date {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 0.25rem;
}
.rating-section {
  margin-top: 0.75rem;
}
.star-rating { display: flex; }
.star-rating .star { font-size: 1.25rem; color: #d1d5db; }
.star-rating .star.filled { color: #facc15; }
.content-section {
  flex: 1 1 70%;
  padding-left: 1.5rem;
}
.review-text {
  font-size: 0.9rem;
  color: #374151;
  line-height: 1.7;
}
.empty-state, .loading-state {
  text-align: center;
  padding: 3rem 0;
}
.empty-title {
  font-size: 1.25rem;
  font-weight: 700;
}
</style>