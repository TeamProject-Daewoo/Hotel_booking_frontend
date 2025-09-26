<template>
  <div class="coupon-select-container">
    <button @click="showCouponList = !showCouponList">
      {{ selectedCouponId ? '쿠폰 변경하기' : '쿠폰 선택' }}
    </button>

    <!-- 선택된 쿠폰 정보 -->
    <div v-if="selectedCoupon" class="selected-coupon-info">
      <strong>쿠폰명: {{ selectedCoupon.coupon.name }}</strong><br/>
      할인: {{ selectedCoupon.coupon.displayDiscount }}<br/>
      만료일: {{ selectedCoupon.expireAt?.slice(0, 10) || '정보 없음' }}
    </div>

    <!-- 쿠폰 목록 -->
    <div v-if="showCouponList" class="coupon-list-container">
      <h3>사용 가능한 쿠폰</h3>
      <div v-if="availableCoupons.length === 0" class="empty-msg">
        사용 가능한 쿠폰이 없습니다.
      </div>
      <ul v-else class="coupon-list">
        <li
          v-for="coupon in availableCoupons"
          :key="coupon.id"
          :class="{ selected: selectedCouponId === coupon.id }"
          class="coupon-item"
          @click="selectCoupon(coupon)"
        >
          <strong>{{ coupon.coupon.name }}</strong>
          <span>{{ coupon.coupon.displayDiscount }}</span>
          <div>만료일: {{ coupon.expireAt?.slice(0, 10) || '정보 없음' }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineEmits } from 'vue';
import adminApi from '@/api/axios';

const emit = defineEmits(['update:selectedCoupon']);

const myCouponsPage = ref({ content: [], totalPages: 0 });
const selectedCouponId = ref(null);
const showCouponList = ref(false);

const availableCoupons = computed(() => {
  const now = new Date();
  return myCouponsPage.value.content.filter(coupon => {
    const expireAt = new Date(coupon.expireAt);
    return expireAt > now && !coupon.isUsed;
  });
});

const selectedCoupon = computed(() => {
  return availableCoupons.value.find(c => c.id === selectedCouponId.value) || null;
});

const fetchUserCoupons = async () => {
  try {
    const res = await adminApi.get('/api/coupons/my', { params: { page: 0, size: 100 } });
    myCouponsPage.value = res.data;
  } catch (e) {
    alert('쿠폰 목록 불러오기 실패');
    console.error(e);
  }
};

const selectCoupon = (coupon) => {
  console.log("✅ 선택된 쿠폰 객체 확인:", coupon);
  selectedCouponId.value = coupon.id;       // ✅ DB id 사용
  emit('update:selectedCoupon', coupon);    // ✅ DB id 포함 쿠폰 객체 전달
  showCouponList.value = false;
};

onMounted(fetchUserCoupons);
</script>


<style scoped>
.coupon-select-container button {
  padding: 8px 16px;
  margin-bottom: 10px;
  cursor: pointer;
}

.selected-coupon-info {
  margin-bottom: 12px;
  padding: 10px;
  border: 1px solid #007bff;
  border-radius: 6px;
  background-color: #e9f5ff;
  font-weight: 600;
}

.coupon-list-container {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 6px;
  max-height: 300px;
  overflow-y: auto;
}

.coupon-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.coupon-item {
  padding: 12px;
  margin-bottom: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: background-color 0.2s ease;
}

.coupon-item:hover {
  background-color: #f0f8ff;
}

.selected {
  background-color: #cce5ff;
  border-color: #007bff;
}

.coupon-item strong {
  font-weight: 600;
}

.coupon-item span {
  color: #28a745;
}

.empty-msg {
  color: #999;
  font-style: italic;
}
</style>
