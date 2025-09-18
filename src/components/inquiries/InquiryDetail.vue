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

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

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
      `http://localhost:8888/api/inquiries/${route.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      }
    );
    inquiry.value = res.data;
  } catch (error) {
    alert('문의 상세를 불러오는 중 오류가 발생했습니다.');
    router.push('/inquiries');
  }
};

onMounted(() => {
  fetchInquiry();
});
</script>

<style scoped>
.inquiry-detail {
  max-width: 700px;
  margin: 40px auto;
  padding: 20px 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fafafa;
  font-family: "Noto Sans KR", sans-serif;
}

h2 {
  margin-bottom: 10px;
  color: #2c3e50;
}

p {
  margin: 6px 0;
  color: #34495e;
}

a {
  color: #42b983;
  word-break: break-all;
}
</style>
