<template>
  <main class="form-page-background">
    <div class="form-container">
      <h1 class="view-title">리뷰 작성하기</h1>
      <p class="hotel-name">{{ hotelName }}</p>

      <form @submit.prevent="submitReview" class="review-form">
        <div class="form-group">
          <label class="form-label">이번 숙박은 어떠셨나요?</label>
          <div class="star-rating">
            <span v-for="star in 5" :key="star" class="star"
                  :class="{ 'filled': star <= review.rating }"
                  @click="review.rating = star">
              ★
            </span>
          </div>
        </div>

        <div class="form-group">
          <label for="review-content" class="form-label">상세한 리뷰를 남겨주세요</label>
          <textarea id="review-content" v-model="review.content" class="form-textarea" rows="8" placeholder="다른 사람들을 위해 숙소에 대한 솔직한 리뷰를 작성해주세요." required></textarea>
        </div>

        <div class="form-group">
          <label for="review-photo" class="form-label">사진 첨부 (선택)</label>
          <label for="review-photo" class="file-upload-button">
            <i class="fa-solid fa-camera"></i> 파일 선택
          </label>
          <input type="file" id="review-photo" @change="handlePhotoUpload" accept="image/*">
          <p v-if="review.photoName" class="file-name">{{ review.photoName }}</p>
        </div>

        <div class="button-container">
          <button type="button" @click="cancel" class="button-secondary">취소</button>
          <button type="submit" class="button-primary">리뷰 제출</button>
        </div>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/axios';
import { useUiStore } from '@/store/commonUiStore';

const uiStore = useUiStore();
const route = useRoute();
const router = useRouter();

const hotelName = ref('');
const review = reactive({
  rating: 5,
  content: '',
  photo: null,
  photoName: ''
});

onMounted(() => {
  hotelName.value = route.query.hotelName || '호텔 정보';
});

const handlePhotoUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    review.photo = file;
    review.photoName = file.name;
  }
};

const submitReview = async () => {
  const formData = new FormData();
  formData.append('reservationId', route.params.reservationId);
  formData.append('rating', review.rating);
  formData.append('content', review.content);
  if (review.photo) {
    formData.append('photo', review.photo);
  }

  try {
    await api.post('/api/mypage/reviews', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    uiStore.openModal('리뷰가 성공적으로 제출되었습니다.');
    router.push('/mypage');
  } catch (error) {
    console.error('리뷰 제출 실패:', error);
    uiStore.openModal(error.response?.data?.message || '리뷰 제출 중 오류가 발생했습니다.');
  }
};

const cancel = () => {
  router.back();
};
</script>

<style scoped>
.form-page-background { background-color: #f8f9fa; padding: 40px 16px; min-height: 80vh; }
.form-container { max-width: 800px; margin: 2rem auto; padding: 2.5rem; background: #fff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.view-title { font-size: 1.75rem; font-weight: 700; text-align: center; }
.hotel-name { font-size: 1.1rem; color: #6b7280; text-align: center; margin-bottom: 2.5rem; }
.review-form { display: flex; flex-direction: column; gap: 2rem; }
.form-group { display: flex; flex-direction: column; }
.form-label { font-weight: 600; margin-bottom: 0.75rem; font-size: 1rem; color: #374151; }
.star-rating { font-size: 2.5rem; color: #e5e7eb; cursor: pointer; }
.star-rating .star.filled { color: #facc15; }
.form-textarea { padding: 0.8rem 1rem; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; width: 100%; resize: vertical; }
input[type="file"] { display: none; }
.file-upload-button {
  display: inline-block;
  padding: 0.7rem 1.2rem;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  width: fit-content;
}
.file-upload-button i { margin-right: 8px; }
.file-name { font-size: 0.8rem; color: #6b7280; margin-top: 0.75rem; }
.button-container { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; }
.button-primary, .button-secondary { padding: 0.7rem 1.5rem; border-radius: 0.375rem; font-weight: 600; border: 1px solid; cursor: pointer; }
.button-primary { background-color: #2563eb; color: white; border-color: #2563eb; }
.button-secondary { background-color: white; color: #374151; border-color: #d1d5db; }
</style>