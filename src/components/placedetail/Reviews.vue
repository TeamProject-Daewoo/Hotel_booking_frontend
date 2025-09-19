<template>
  <section class="reviews-section">
    <div class="reviews-head">
      <h2>리뷰</h2>
    </div>

    <div v-if="reviews.length > 0" class="rating-summary">
      <span class="summary-star">★</span>
      <span class="summary-score">{{ averageRatingText }} / 5</span>
      <span class="summary-count">({{ reviews.length }}명 참여)</span>
    </div>

    <div v-if="reviews.length > 0">
      <ul class="review-list">
        <li v-for="review in reviews" :key="review.reviewId" class="review-card">
          <div class="author-profile">
            <img class="avatar" src="https://placehold.co/60x60/e2e8f0/64748b?text=U" alt="User Avatar" />
            <div class="author-info">
              <span class="author-name">{{ review.userName }}</span>
              <span v-if="review.visitCount > 1" class="visit-count">{{ review.visitCount }}번째 방문</span>
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
              <img :src="getImageUrl(review.imageUrl)" class="review-photo" />
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
import { ref, computed } from 'vue';

const props = defineProps({
  reviews: { type: Array, default: () => [] },
});

const getImageUrl = (imagePath) => {
  const backendUrl = import.meta.env.VITE_API_URL;
  return `${backendUrl}${imagePath}`;
};

const expandedReviews = ref({});

const averageRating = computed(() => {
  if (!props.reviews || props.reviews.length === 0) return 0;
  const total = props.reviews.reduce((acc, review) => acc + review.rating, 0);
  return total / props.reviews.length;
});

const averageRatingText = computed(() => averageRating.value.toFixed(1));

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
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}
.reviews h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}
.rating-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 1rem 0;
}
.summary-star {
  font-size: 1.5rem;
  color: #2ecc9a;
}
.summary-score {
  font-size: 1.1rem;
  font-weight: 700;
}
.summary-count {
  font-size: 0.9rem;
  color: #6b7280;
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
  flex: 0 0 25%;
  padding-right: 2rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}
.author-info {
  display: flex;
  flex-direction: column;
  margin-top: 0.25rem;
}
.author-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1f2937;
}
.visit-count {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 4px;
}
.review-content {
  flex: 1 1 75%;
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
  max-width: 400px;
  max-height: 400px;
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