<template>
  <div class="coupon-select-container">
    <div
      v-if="selectedCoupon"
      class="selected-coupon-info"
      @click="toggleCouponSelection(selectedCoupon)"
      style="cursor: pointer;"
      title="클릭하면 선택 취소됩니다"
    >
      <div>
        <strong>쿠폰명: {{ selectedCoupon.coupon.name }}</strong><br />
        할인: {{ selectedCoupon.coupon.displayDiscount }}<br />
        만료일: {{ selectedCoupon.expireAt?.slice(0, 10) || '정보 없음' }}
      </div>

      <div style="color: #dc3545; font-weight: bold; white-space: nowrap; font-size: 14px;">
        👉 쿠폰 취소
      </div>
    </div>

    <div class="coupon-list-container">
      <h3>사용 가능한 쿠폰</h3>
      <div v-if="availableCoupons.length === 0" class="empty-msg">
        사용 가능한 쿠폰이 없습니다.
      </div>
      <ul v-else class="coupon-list">
        <li
          v-for="coupon in availableCoupons"
          :key="coupon.id"
          :ref="el => couponRefs[coupon.id] = el"
          :class="{ selected: selectedCouponId === coupon.id }"
          class="coupon-item"
          @click="toggleCouponSelection(coupon)"
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
import { ref, computed, onMounted, nextTick, defineEmits } from 'vue';
import adminApi from '@/api/axios';

const emit = defineEmits(['update:selectedCoupon']);

const myCouponsPage = ref({ content: [], totalPages: 0 });
const selectedCouponId = ref(null);
const couponRefs = ref({}); // 쿠폰 DOM 참조 객체

const availableCoupons = computed(() => {
  const now = new Date();
  return myCouponsPage.value.content.filter(coupon => {
    const expireAt = new Date(coupon.expireAt);
    return expireAt > now && !coupon.isUsed;
  });
});

const selectedCoupon = computed(() => {
  return myCouponsPage.value.content.find(c => c.id === selectedCouponId.value) || null;
});

const fetchUserCoupons = async () => {
  try {
    const res = await adminApi.get('/api/coupons/my', { params: { page: 0, size: 100 } });
    myCouponsPage.value = res.data;
  } catch (e) {
    console.error(e);
  }
};

const toggleCouponSelection = async (coupon) => {
  // 선택된 쿠폰을 다시 클릭하면 취소
  if (selectedCouponId.value === coupon.id) {
    try {
      await adminApi.patch(`/api/coupons/user/${coupon.id}/cancel`);
      coupon.isUsed = false;
      coupon.usedAt = null;
      selectedCouponId.value = null;
      emit('update:selectedCoupon', null);

      // DOM 업데이트 후 스크롤 복원
      await nextTick();
      const el = couponRefs.value[coupon.id];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

    } catch (error) {
      console.error("쿠폰 취소 실패:", error);
      alert("❌ 쿠폰 취소 중 오류가 발생했습니다.");
    }
    return;
  }

  // 다른 쿠폰이 이미 선택되어 있으면 먼저 취소
  if (selectedCouponId.value) {
    try {
      await adminApi.patch(`/api/coupons/user/${selectedCouponId.value}/cancel`);
      const prevIndex = myCouponsPage.value.content.findIndex(c => c.id === selectedCouponId.value);
      if (prevIndex !== -1) {
        myCouponsPage.value.content[prevIndex].isUsed = false;
        myCouponsPage.value.content[prevIndex].usedAt = null;
      }
    } catch (error) {
      console.error("이전 쿠폰 취소 실패:", error);
      alert("❌ 이전 쿠폰 취소 중 오류가 발생했습니다.");
    }
  }

  // 새 쿠폰 사용 처리
  try {
    await adminApi.patch(`/api/coupons/user/${coupon.id}/use`);
    coupon.isUsed = true;
    coupon.usedAt = new Date().toISOString();
    selectedCouponId.value = coupon.id;
    emit('update:selectedCoupon', coupon);
  } catch (error) {
    console.error("쿠폰 사용 처리 실패:", error);
    alert("❌ 쿠폰 사용 처리 중 오류가 발생했습니다.");
  }
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

.selected-coupon-info {
  margin-bottom: 12px;
  padding: 10px;
  border: 1px solid #007bff;
  border-radius: 6px;
  background-color: #e9f5ff;
  font-weight: 600;
  
  /* --- 추가된 스타일 --- */
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
