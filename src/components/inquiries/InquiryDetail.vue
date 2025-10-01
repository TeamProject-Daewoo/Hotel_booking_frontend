<template>
  <div class="inquiry-detail" v-if="inquiry">
    <h2>{{ inquiry.title }}</h2>
    <p><strong>카테고리:</strong> {{ inquiry.category }}</p>
    <p><strong>상태:</strong> {{ inquiry.status }}</p>
    <p><strong>작성일:</strong> {{ formatDate(inquiry.createdAt) }}</p>
    <hr />
    <p>{{ inquiry.content }}</p>
    <div v-if="inquiry.attachmentUrl">
      <p><strong>첨부파일:</strong></p>
      <a :href="inquiry.attachmentUrl" target="_blank">{{ inquiry.attachmentUrl }}</a>
    </div>

    <!-- 관리자 답변 추가 -->
    <div v-if="inquiry.answer">
      <hr />
      <h3>관리자 답변</h3>
      <p>{{ inquiry.answer.answerContent }}</p>
      <p><small>답변일: {{ formatDate(inquiry.answer.answeredAt) }}</small></p>
    </div>
  </div>

  <div v-else>
    로딩 중...
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '@/api/auth';
import { useUiStore } from '@/store/commonUiStore';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const uiStore = useUiStore();

const inquiry = ref(null);

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

const fetchInquiry = async () => {
  if (!authStore.accessToken) {
    router.push('/login');
    return;
  }
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/inquiries/${route.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      }
    );
    inquiry.value = res.data;
  } catch (error) {
    uiStore.openModal('문의 상세를 불러오는 중 오류가 발생했습니다.');
    router.push('/inquiries');
  }
};

onMounted(() => {
  fetchInquiry();
});
</script>

<style scoped>

.inquiry-detail {
  max-width: 800px;
  min-height: 700px;
  margin: 2rem auto;
  padding: 2.5rem;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  font-family: 'Pretendard', sans-serif;
}

h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

/* 카테고리, 상태, 작성일 등 메타 정보 스타일 */
p {
  margin: 0.5rem 0;
  color: #868e96;
  font-size: 0.9rem;
}

p > strong {
  color: #495057;
  font-weight: 600;
  margin-right: 0.5rem;
}

/* 본문 내용 스타일 */
.content-body {
  margin: 2rem 0;
  font-size: 1rem;
  line-height: 1.8;
  color: #343a40;
  white-space: pre-wrap;
}

hr {
  border: none;
  border-top: 1px solid #f1f3f5;
  margin: 2rem 0;
}

/* 첨부파일 섹션 */
.attachment-section {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}
.attachment-section p {
  margin-top: 0;
}
.attachment-section a {
  color: #308c84;
  text-decoration: none;
  word-break: break-all;
  font-weight: 500;
}
.attachment-section a:hover {
  text-decoration: underline;
}

/* 답변 섹션 */
.answer-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #308c84; /* 메인 색상으로 강조 */
}

.answer-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #308c84;
  margin-top: 0;
  margin-bottom: 1rem;
}

.answer-section small {
  display: block;
  text-align: right;
  color: #adb5bd;
  margin-top: 1rem;
}

.loading-state {
  text-align: center;
  padding: 5rem;
  color: #888;
}
</style>
