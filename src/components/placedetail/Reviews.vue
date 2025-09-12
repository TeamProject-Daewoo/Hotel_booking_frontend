<template>
  <section class="reviews" v-if="(reviews?.length ?? 0) > 0 || reviewCountNum > 0">
    <!-- 헤더 -->
    <div class="reviews-head">
      <h2>리뷰</h2>
      <button class="write-btn" @click="$emit('write-review')">리뷰 쓰기</button>
    </div>

    <!-- 요약 -->
    <div class="summary">
      <div class="score-wrap">
        <div class="big-score">{{ ratingText }}</div>
        <div>
          <div class="score-label">{{ ratingLabelText }}</div>
          <div class="score-count">{{ countText }}</div>
        </div>
      </div>
    </div>

    <!-- 리스트 -->
    <ul class="review-list" v-if="pageItems.length">
      <li v-for="rv in pageItems" :key="rv.id ?? rv.createdAt ?? rv.author + (rv.comment || '').slice(0,10)">
        <img class="avatar" :src="rv.avatar || fallbackAvatar(rv.author)" alt="" />
        <div class="content">
          <div class="head">
            <span class="score-small">{{ formatScore(rv.score) }} <b>{{ titleFromScore(rv.score) }}</b></span>
            <span class="sep">|</span>
            <span class="author">{{ rv.author || '익명' }}</span>
          </div>
          <p class="body" v-if="rv.comment">{{ rv.comment }}</p>
        </div>
        <button class="flag-btn" aria-label="신고" @click="$emit('report', rv)">
          <i class="fa-solid fa-flag"></i>
        </button>
      </li>
    </ul>

    <!-- 페이지네이션 -->
    <div class="pager" v-if="totalPages > 1">
      <button class="nav" :disabled="page===1" @click="page--">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <span class="ptext">{{ page }} of {{ totalPages }}</span>
      <button class="nav" :disabled="page===totalPages" @click="page++">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  </section>

  <!-- 아무 리뷰도 없을 때 -->
  <section class="reviews empty" v-else>
    <div class="reviews-head">
      <h2>리뷰</h2>
      <button class="write-btn" @click="$emit('write-review')">리뷰 쓰기</button>
    </div>
    <div class="summary">
      <div class="score-wrap">
        <div class="big-score">0.0</div>
        <div>
          <div class="score-label"></div>
          <div class="score-count">0 verified reviews</div>
        </div>
      </div>
    </div>
    <p class="no-data">아직 등록된 리뷰가 없습니다.</p>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  rating: { type: [Number, String], default: null },
  reviewCount: { type: [Number, String], default: null },
  reviews: { type: Array, default: () => [] },
  pageSize: { type: Number, default: 5 }
})

defineEmits(['write-review', 'report', 'submit-review'])

const newReview = ref({ score: 5, comment: '' })
const toNum = v => Number(String(v ?? '').replace(/[^\d.]/g, ''))
const ratingNum = computed(() => toNum(props.rating) ?? 0)
const ratingText = computed(() => ratingNum.value.toFixed(1))
const reviewCountNum = computed(() => toNum(props.reviewCount) ?? 0)
const ratingLabelText = computed(() => ratingNum.value >= 4.6 ? 'Excellent' : ratingNum.value >= 4.0 ? 'Very good' : ratingNum.value >= 3.0 ? 'Good' : 'Fair')
const countText = computed(() => `${reviewCountNum.value} verified reviews`)

const page = ref(1)
const totalPages = computed(() => Math.max(1, Math.ceil((props.reviews?.length ?? 0) / props.pageSize)))
const pageItems = computed(() => {
  const start = (page.value - 1) * props.pageSize
  return (props.reviews || []).slice(start, start + props.pageSize)
})

const submitReview = () => {
  if (newReview.value.comment.trim() === '') {
    alert('리뷰를 작성해주세요.')
    return
  }
  const reviewData = {
    score: newReview.value.score,
    comment: newReview.value.comment,
    author: '사용자 이름',
    createdAt: new Date().toISOString()
  }
  emit('submit-review', reviewData)
  newReview.value.comment = ''
  newReview.value.score = 5
}
</script>

<style scoped>
.reviews { font-family: "Noto Sans KR", sans-serif; margin-top: 40px; }
.reviews-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.reviews h2 { margin: 0; font-size: 20px; }
.write-btn {
  padding: 10px 14px;
  border: 1px solid #cfe7df;
  background: #e9fbf5;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background .15s ease, transform .15s ease;
}
.write-btn:hover { background: #d7efe7; transform: translateY(-1px); }

.write-review-section {
  margin-top: 20px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.write-review-section h3 {
  margin-bottom: 10px;
  font-size: 18px;
  color: #333;
}

.write-review-section .rating {
  margin-bottom: 10px;
}

.write-review-section select {
  padding: 8px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.write-review-section textarea {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #ccc;
  resize: none;
}

.write-review-section button {
  margin-top: 12px;
  padding: 10px 14px;
  background-color: #2b7264;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.write-review-section button:hover {
  background-color: #1f5e4b;
}

/* 기존 스타일들 */
.summary { border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 12px 0; margin-bottom: 6px; }
.score-wrap { display: flex; align-items: center; gap: 16px; }
.big-score { font-size: 36px; font-weight: 800; color: #2b7264; min-width: 64px; }
.score-label { font-weight: 700; margin-bottom: 2px; }
.score-count { color: #6b7280; font-size: 14px; }

/* 리스트 스타일 */
.review-list { list-style: none; margin: 0; padding: 0; }
.review-list li { display: grid; grid-template-columns: 44px 1fr 28px; align-items: flex-start; gap: 12px; padding: 14px 0; border-bottom: 1px solid #f0f0f0; }
.avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; background: #eef4f1; }
.content .head { font-size: 14px; color: #333; display: flex; gap: 8px; align-items: center; margin-bottom: 6px; }
.score-small { color: #2b7264; }
.sep { color: #bbb; }
.author { color: #444; }
.body { margin: 0; color: #222; line-height: 1.6; }
.flag-btn { width: 28px; height: 28px; border: 0; background: transparent; color: #6b7280; cursor: pointer; border-radius: 6px; }
.flag-btn:hover { background: #f3f5f4; color: #2b7264; }

/* 페이지네이션 스타일 */
.pager { display: flex; justify-content: center; align-items: center; gap: 16px; margin: 16px 0 6px; }
.nav { width: 36px; height: 36px; border: 1px solid #dfe7e3; border-radius: 8px; background: #fff; cursor: pointer; }
.nav:disabled { opacity: .45; cursor: not-allowed; }
.ptext { color: #6b7280; }

.empty .no-data { color: #6b7280; margin: 12px 0 0; }
</style>
