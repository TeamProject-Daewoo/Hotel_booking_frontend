<template>
  <div class="coupon-select-container">
   

    <!-- 선택된 쿠폰 정보 -->
    <div v-if="selectedCoupon" class="selected-coupon-info">
      <strong>쿠폰명: {{ selectedCoupon.coupon.name }}</strong><br/>
      할인: {{ selectedCoupon.coupon.displayDiscount }}<br/>
      만료일: {{ selectedCoupon.expireAt?.slice(0, 10) || '정보 없음' }}
    </div>

    <button @click="handleCouponButtonClick">
  {{ selectedCouponId ? '쿠폰 선택 취소' : '쿠폰 선택' }}
</button>


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

const selectCoupon = async (coupon) => {
  console.log("✅ 선택된 쿠폰 객체 확인:", coupon);

  // 1️⃣ 기존 UI 처리 그대로
  selectedCouponId.value = coupon.id;       
  emit('update:selectedCoupon', coupon);    
  showCouponList.value = false;

  // 2️⃣ 선택 즉시 서버에 사용 처리
  try {
    if (!coupon.isUsed) {
      await adminApi.patch(`/api/coupons/user/${coupon.id}/use`);
      coupon.isUsed = true;
      coupon.usedAt = new Date().toISOString();
      
    }
  } catch (error) {
    console.error("쿠폰 사용 처리 실패:", error);
    alert("❌ 쿠폰 처리 중 오류가 발생했습니다.");
  }
};

const handleCouponButtonClick = async () => {
  if (selectedCouponId.value) {
    try {
      // 서버 취소 요청
      await adminApi.patch(`/api/coupons/user/${selectedCouponId.value}/cancel`);
      
      // 로컬 myCouponsPage.content 업데이트
      const couponIndex = myCouponsPage.value.content.findIndex(c => c.id === selectedCouponId.value);
      if (couponIndex !== -1) {
        myCouponsPage.value.content[couponIndex].isUsed = false;
        myCouponsPage.value.content[couponIndex].usedAt = null;
      }

      // 선택 초기화
      selectedCouponId.value = null;
      emit('update:selectedCoupon', null);

    } catch (error) {
      console.error("쿠폰 취소 실패:", error);
      alert("❌ 쿠폰 취소 중 오류가 발생했습니다.");
      return;
    }
  }

  showCouponList.value = !showCouponList.value;
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
