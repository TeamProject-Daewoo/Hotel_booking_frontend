<script setup>
import { ref, onMounted, computed } from 'vue';
import adminApi from '@/api/axios';
import { useAuthStore } from '@/api/auth';

const authStore = useAuthStore();
const couponCode = ref('');

// 페이징 구조 그대로 저장
const myCouponsPage = ref({
  content: [],
  totalPages: 0,
  totalElements: 0,
  number: 0,
  size: 0
});

// 만료되거나 사용된 쿠폰 제외
const availableCoupons = computed(() => {
  const now = new Date();
  return myCouponsPage.value.content.filter(coupon => {
    const expireAt = new Date(coupon.expireAt);
    return expireAt > now && !coupon.isUsed;
  });
});

// 내 쿠폰 목록 조회
const fetchUserCoupons = async (page = 0, size = 10) => {
  try {
    const res = await adminApi.get('/api/coupons/my', { params: { page, size } });
    myCouponsPage.value = res.data;
  } catch (e) {
    alert('쿠폰 목록 불러오기 실패');
    console.error(e);
  }
};

// 쿠폰 발급
const issueCoupon = async () => {
  if (!couponCode.value.trim()) {
    alert('쿠폰 코드를 입력하세요');
    return;
  }

  try {
    await adminApi.post('/api/coupons/issue/code', null, {
      params: { couponCode: couponCode.value.trim(), source: 'CODE_INPUT' }
    });
    alert('쿠폰이 발급되었습니다!');
    couponCode.value = '';
    fetchUserCoupons(myCouponsPage.value.number, myCouponsPage.value.size);
  } catch (e) {
    alert(e.response?.data?.message || '쿠폰 발급 실패');
    console.error(e);
  }
};

// 페이지 이동
const goToPage = (page) => fetchUserCoupons(page, myCouponsPage.value.size);

onMounted(() => fetchUserCoupons());
</script>

<template>
  <div class="coupon-container">
    <h2>쿠폰 등록</h2>
    <div class="coupon-form">
      <input v-model="couponCode" type="text" placeholder="쿠폰 코드를 입력하세요" />
      <button @click="issueCoupon">쿠폰 등록</button>
    </div>

    <h3>내 쿠폰함</h3>
    <div v-if="availableCoupons.length === 0" class="empty-msg">
      보유한 쿠폰이 없습니다.
    </div>
    <ul v-else class="coupon-list">
      <li v-for="coupon in availableCoupons" :key="coupon.id" class="coupon-item">
        <strong>{{ coupon.coupon.name }}</strong>
        <span>{{ coupon.coupon.displayDiscount }}</span>
        <div>만료일: {{ coupon.expireAt?.slice(0, 10) || '정보 없음' }}</div>
        <div>상태: {{ coupon.isUsed ? '사용됨' : '사용 가능' }}</div>
      </li>
    </ul>

    <div class="pagination" v-if="myCouponsPage.totalPages > 1">
      <button
        v-for="p in myCouponsPage.totalPages"
        :key="p"
        @click="goToPage(p-1)"
        :class="{ active: myCouponsPage.number === (p-1) }"
      >
        {{ p }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.coupon-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.coupon-form {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.coupon-form input {
  flex: 1;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.coupon-form button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.coupon-form button:hover {
  background-color: #0056b3;
}

.coupon-list {
  list-style: none;
  padding: 0;
}

.coupon-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.coupon-item strong {
  font-size: 16px;
}

.coupon-item span {
  color: #28a745;
  font-weight: 500;
}

.empty-msg {
  color: #999;
  font-style: italic;
}

.pagination {
  margin-top: 20px;
  display: flex;
  gap: 5px;
  justify-content: center;
}

.pagination button {
  padding: 5px 10px;
  border: 1px solid #ccc;
  background: #fff;
  cursor: pointer;
}

.pagination button.active {
  background: #007bff;
  color: #fff;
  border-color: #007bff;
}
</style>
