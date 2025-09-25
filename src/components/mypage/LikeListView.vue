<template>
  <div class="view-container">
    <h1 class="view-title">찜 목록</h1>
    <div v-if="wishlistItems.length > 0" class="like-grid">
      <div v-for="like in wishlistItems" :key="like.id" class="like-card">
        <div class="like-delete-btn"><i @click="deleteWishlist(like.contentId)" class="fa-solid fa-xmark"></i></div>
        <img :src="like.imageUrl" alt="숙소 이미지" class="hotel-image">
        <div class="card-content">
          <h3 class="hotel-name">{{ like.hotelName }}</h3>
          <p class="hotel-address">{{ like.address }}</p>
          <div class="rating-info">
            <span class="star filled">★</span>
            <span class="rating-score">{{ like.rating.toFixed(1) }}</span>
            <span class="review-count">({{ like.reviewCount }})</span>
          </div>
          <button class="book-button" @click="$router.push({ name: 'place-detail', params: { id: like.contentId }})">예약하기</button>
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
import { onMounted, computed } from 'vue';
import { useWishlistStore } from '@/store/wishlistStore';
import { storeToRefs } from 'pinia';

const wishlistStore = useWishlistStore();

onMounted(() => {
  wishlistStore.fetchWishlist();
})
const { wishlistItems } = storeToRefs(wishlistStore);
const deleteWishlist = async (contentId) => {
  await wishlistStore.delete(contentId);
}
</script>

<style scoped>
.view-container { background-color: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);}
.view-title { font-size: 1.5rem; font-weight: 700; color: #111827; margin-bottom: 1.5rem; }
.like-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
.like-card { position: relative; height: 500px; border-radius: 0.5rem; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); }
.like-delete-btn { text-shadow: 2px 2px 2px black; position: absolute; top: 0; right: 6px; color: white; font-size: 16pt; cursor: pointer;}
.hotel-image { width: 100%; height: 50%; object-fit: cover; margin: 0;}
.card-content { height: 50%; margin: 0; display: flex; flex-direction: column; padding: 1rem; box-sizing: border-box;}
.book-button { margin-top: auto; width: 100%; background-color: #1e40af; color: white; border: none; padding: 0.75rem; border-radius: 0.25rem; font-weight: 600; cursor: pointer;}
.hotel-name { font-weight: 700; font-size: 1.1rem; color: #1f2937; }
.hotel-address { font-size: 0.8rem; color: #6b7280; margin: 0.25rem 0; }
.rating-info { display: flex; align-items: center; margin: 0.5rem 0; }
.star.filled { color: #f59e0b; }
.rating-score { font-weight: 600; margin-left: 0.25rem; }
.review-count { font-size: 0.8rem; color: #6b7280; margin-left: 0.25rem; }
.empty-state { text-align: center; padding: 3rem 0; }
.empty-title { font-size: 1.25rem; font-weight: 700; }
.empty-description { margin-top: 0.5rem; color: #6b7280; }

@media (max-width: 1024px) { .like-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .like-grid { grid-template-columns: repeat(1, 1fr); } }
</style>