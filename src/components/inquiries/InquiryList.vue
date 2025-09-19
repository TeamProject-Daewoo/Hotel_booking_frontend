<template>
  <div class="inquiry-list">
    <h2>내 문의 내역</h2>

    <!-- 문의하기 버튼 -->
    <div class="button-wrapper">
      <button class="create-button" @click="goToCreate">문의하기</button>
    </div>

    <div v-if="loading">로딩 중...</div>
    <div v-else>
      <div v-if="inquiries.length === 0">문의 내역이 없습니다.</div>
      <ul>
        <li
          v-for="inquiry in inquiries"
          :key="inquiry.id"
          class="inquiry-item"
          @click="goToDetail(inquiry.id)"
        >
          <strong>{{ inquiry.title }}</strong> — {{ inquiry.category }} — <em>{{ inquiry.status }}</em>
          <br />
          <small>{{ formatDate(inquiry.createdAt) }}</small>
        </li>
      </ul>
    </div>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "@/api/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const inquiries = ref([]);
const loading = ref(false);
const errorMessage = ref("");

// Axios 인스턴스
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

// 토큰 없으면 로그인 페이지로 이동
if (!authStore.accessToken) {
  router.push("/login");
}

const fetchInquiries = async () => {
  loading.value = true;
  errorMessage.value = "";
  try {
    const res = await api.get("/inquiries/user", {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });
    inquiries.value = res.data;
  } catch (error) {
    errorMessage.value = "문의 내역을 불러오는 중 오류가 발생했습니다.";
    if (error.response?.status === 401) {
      authStore.logout();
      router.push("/login");
    }
  } finally {
    loading.value = false;
  }
};

const goToDetail = (id) => {
  router.push(`/inquiries/${id}`);
};

const goToCreate = () => {
  router.push("/inquiries/new");
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString();
};

onMounted(() => {
  fetchInquiries();
});
</script>

<style scoped>
.inquiry-item {
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  transition: background-color 0.2s;
}
.inquiry-item:hover {
  background-color: #f5f5f5;
}
.error {
  color: red;
  margin-top: 20px;
  font-weight: bold;
}

.button-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
}

.create-button {
  padding: 8px 18px;
  font-size: 14px;
  font-weight: bold;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.create-button:hover {
  background-color: #369f6e;
}
</style>
