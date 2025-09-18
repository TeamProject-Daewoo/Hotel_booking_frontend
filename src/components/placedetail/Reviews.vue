<template>
  <section class="reviews-section">
    <div class="reviews-head">
      <h2>리뷰 <span class="review-count">{{ reviews.length }}</span></h2>
    </div>

    <div v-if="reviews.length > 0">
      <ul class="review-list">
        <li v-for="review in reviews" :key="review.reviewId" class="review-card">
          <div class="author-profile">
            <img class="avatar" src="https://placehold.co/60x60/e2e8f0/64748b?text=U" alt="User Avatar" />
            <div class="author-info">
              <span class="author-name">{{ review.userName }}</span>
            </div>
          </div>

          <div class="review-content">
            <div class="review-meta">
              <div class="star-rating">
                <span v-for="n in 5" :key="n" class="star" :class="{ 'filled': n <= review.rating }">★</span>
              </div>
              <span class="review-date">{{ formatRelativeDate(review.reviewDate) }}</span>
            </div>

            <div v-if="review.imageUrl" class="review-photo-wrapper">
              <img :src="'http://localhost:8888' + review.imageUrl" class="review-photo" />
            </div>

            <p class="review-text" :class="{ collapsed: !isExpanded(review.reviewId) && isLong(review.reviewText) }">
              {{ review.reviewText }}
            </p>
            <button v-if="isLong(review.reviewText)" @click="toggleExpand(review.reviewId)" class="more-button">
              {{ isExpanded(review.reviewId) ? '접기' : '더보기' }}
            </button>
          </div>
        </li>
      </ul>
    </div>

    <div v-else class="empty-state">
      <p>아직 등록된 리뷰가 없습니다.</p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  reviews: { type: Array, default: () => [] },
});

const expandedReviews = ref({});

const isLong = (text) => {
  if (!text) return false;
  return text.split('\n').length > 4 || text.length > 150;
};

const isExpanded = (reviewId) => {
  return !!expandedReviews.value[reviewId];
};

const toggleExpand = (reviewId) => {
  expandedReviews.value[reviewId] = !expandedReviews.value[reviewId];
};

const formatRelativeDate = (dateString) => {
  const now = new Date();
  const reviewDate = new Date(dateString);
  const diff = now - reviewDate;
  const diffMinutes = Math.floor(diff / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMonths > 0) return `${diffMonths}개월 전`;
  if (diffDays > 0) return `${diffDays}일 전`;
  if (diffHours > 0) return `${diffHours}시간 전`;
  if (diffMinutes > 0) return `${diffMinutes}분 전`;
  return '방금 전';
};
</script>

<style scoped>
.reviews-section {
  font-family: "Noto Sans KR", sans-serif;
  margin-top: 40px;
  padding: 1.5rem;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.reviews-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1rem;
}
.reviews h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}
.review-count {
  font-size: 1.2rem;
  color: #3b82f6;
}
.review-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.review-card {
  display: flex;
  padding: 1.5rem 0;
  border-bottom: 1px solid #f3f4f6;
}
.review-card:last-child {
  border-bottom: none;
}
.author-profile {
  flex: 0 0 25%; /* 왼쪽 영역 25% 차지 */
  padding-right: 2rem;
  display: flex;
  align-items: flex-start; /* 상단 정렬 */
  gap: 0.75rem;
}
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}
.author-name {
  margin-top: 0.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1f2937;
}
.review-content {
  flex: 1 1 75%; /* 오른쪽 영역 75% 차지 */
}
.review-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}
.star-rating { display: flex; }
.star-rating .star { font-size: 1.1rem; color: #d1d5db; }
.star-rating .star.filled { color: #f59e0b; }
.review-date {
  font-size: 0.8rem;
  color: #6b7280;
}
.review-photo-wrapper {
  margin-top: 1rem;
}
.review-photo {
  max-width: 250px;
  max-height: 250px;
  border-radius: 8px;
  object-fit: cover;
}
.review-text {
  font-size: 0.95rem;
  color: #374151;
  line-height: 1.8;
  white-space: pre-wrap;
  margin: 1rem 0 0.5rem;
}
.review-text.collapsed {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.more-button {
  background: none;
  border: none;
  color: #6b7280;
  font-weight: 600;
  cursor: pointer;
  padding: 0.25rem 0;
}
.empty-state {
  text-align: center;
  padding: 3rem 0;
  color: #6b7280;
}
</style>