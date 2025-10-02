<template>
  <div class="inquiry-container">
    <div class="header">
      <h1 class="title">내 문의 내역</h1>
      <button class="create-button" @click="goToCreate">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="icon">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
        <span>1:1 문의하기</span>
      </button>
    </div>

    <div v-if="loading" class="state-container">
      <div class="spinner"></div>
      <p>문의 내역을 불러오는 중입니다...</p>
    </div>

    <div v-else-if="inquiries.length === 0" class="state-container">
      <p class="empty-message">아직 작성한 문의 내역이 없습니다.</p>
      <p class="empty-submessage">궁금한 점이 있다면 언제든지 문의해주세요.</p>
    </div>

    <div v-else class="inquiry-table">
      <div class="table-header">
        <div class="col-status">상태</div>
        <div class="col-category">분류</div>
        <div class="col-title">제목</div>
        <div class="col-date">작성일</div>
      </div>
      <div
          v-for="inquiry in inquiries"
          :key="inquiry.id"
          class="table-row"
          @click="goToDetail(inquiry.id)"
      >
        <div class="col-status">
          <span class="status-badge" :class="getStatusClass(inquiry.status)">
            {{ inquiry.status === 'ANSWERED' ? '답변 완료' : '답변 대기' }}
          </span>
        </div>
        <div class="col-category">{{ inquiry.category }}</div>
        <div class="col-title">{{ inquiry.title }}</div>
        <div class="col-date">{{ formatDate(inquiry.createdAt) }}</div>
      </div>
    </div>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/api/auth";
import { useRouter } from "vue-router";
// [참고] 기존 코드와 동일하게, 전역 axios 인스턴스를 사용하는 것이 좋습니다.
import api from "@/api/axios";

const authStore = useAuthStore();
const router = useRouter();

const inquiries = ref([]);
const loading = ref(true);
const errorMessage = ref("");

const fetchInquiries = async () => {
  if (!authStore.accessToken) {
    router.push("/login");
    return;
  }

  loading.value = true;
  errorMessage.value = "";
  try {
    const res = await api.get("/api/inquiries/user", {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });
    // 최신 문의가 위로 오도록 정렬
    inquiries.value = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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

// 날짜 형식을 'YYYY.MM.DD'로 변경
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

// 답변 상태에 따라 다른 CSS 클래스를 반환
const getStatusClass = (status) => {
  return status === 'ANSWERED' ? 'status-answered' : 'status-pending';
};

onMounted(fetchInquiries);
</script>

<style scoped>
/* --- 전체 UI 디자인 시스템 재설계 --- */

.inquiry-container {
  max-width: 900px;
  min-height: 700px;
  margin: 2rem auto;
  padding: 2.5rem;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  font-family: 'Pretendard', sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
}

.create-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.4rem;
  font-size: 0.95rem;
  font-weight: 600;
  background-color: #308c84; /* 요청하신 메인 색상 적용 */
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(48, 140, 132, 0.2);
}

.create-button:hover {
  transform: translateY(-2px);
  background-color: #287a70; /* 호버 시 약간 더 어둡게 */
  box-shadow: 0 6px 20px rgba(48, 140, 132, 0.3);
}

.create-button .icon {
  width: 1.25rem;
  height: 1.25rem;
}

.state-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5rem 0;
  text-align: center;
  color: #888;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f0f0f0;
  border-top-color: #308c84; /* 메인 색상 적용 */
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-message {
  font-size: 1.2rem;
  font-weight: 500;
  color: #555;
}
.empty-submessage {
  margin-top: 0.5rem;
  color: #aaa;
}

.inquiry-table {
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: flex;
  background-color: #f8f9fa;
  color: #868e96;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table-row {
  display: flex;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f3f5;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background-color: #d7d8da;
  transform: scale(1.01);
}

.col-status { width: 15%; text-align: center; }
.col-category { width: 15%; text-align: center; color: #868e96; font-size: 0.9rem;}
.col-title { flex-grow: 1; font-weight: 600; color: #343a40; }
.col-date { width: 20%; text-align: right; color: #868e96; font-size: 0.9rem;}

.status-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-answered {
  background-color: #e6fcf5; /* 메인 색상 계열의 밝은 색 */
  color: #087f5b;
}

.status-pending {
  background-color: #f1f3f5;
  color: #868e96;
}

.error-message {
  margin-top: 1rem;
  color: #fa5252;
  text-align: center;
  font-weight: 500;
}
</style>

