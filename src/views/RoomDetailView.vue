<template>
  <div class="booking-page" v-if="reservation">
    <Breadcrumb
        v-if="reservation?.hotel"
        :id="reservation.hotel.contentid"
        :title="reservation.hotel.title"
    />
    <div class="grid">
      <div class="left-col">
        <div class="info-section">
          <h2>예약 정보 확인</h2>
          <div class="info-item">
            <span class="label">예약자 이름</span>
            <span class="value">{{ reservation.customerName }}</span>
          </div>
          <div class="info-item">
            <span class="label">연락처</span>
            <span class="value">{{ reservation.phone }}</span>
          </div>
          <div class="info-item">
            <span class="label">체크인</span>
            <span class="value">{{ formatDate(reservation.checkInDate) }}</span>
          </div>
          <div class="info-item">
            <span class="label">체크아웃</span>
            <span class="value">{{ formatDate(reservation.checkOutDate) }}</span>
          </div>
        </div>

        <Coupon
            @update:selectedCoupon="handleCouponSelection"
            :currentCoupon="selectedCoupon"
        />

        <PointUsage
            v-model="pointsToUse"
            :totalPrice="finalPriceAfterCoupon"
            :disabled="!selectedCoupon"
            @apply-points="applyPoints"
        />

        <button @click="goToPayment" class="reservation-button">
          결제하기
        </button>
      </div>

      <aside class="right-col">
        <SummaryCard
            :base="reservation.hotel"
            :room="reservation.room"
            :checkIn="reservation.checkInDate"
            :checkOut="reservation.checkOutDate"
            :nights="nights"
            :fare="reservation.basePrice"
            :couponDiscount="couponDiscountAmount"
            :pointDiscount="appliedPoints"
            :total="finalPrice"
        />
      </aside>
    </div>
  </div>

  <div v-else class="loading-container">
    <div class="spinner"></div>
    <p>예약 정보를 불러오는 중입니다...</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { onBeforeRouteLeave } from 'vue-router';
import api from '@/api/axios';

import Breadcrumb from '@/components/roomdetail/Breadcrumb.vue';
import PointUsage from '@/components/point/PointUsage.vue';
import SummaryCard from '@/components/roomdetail/SummaryCard.vue';
import Coupon from '@/components/coupon/Coupon.vue'

const route = useRoute();
const router = useRouter();

const reservation = ref(null);
const selectedCoupon = ref(null);
const pointsToUse = ref(0);
const appliedPoints = ref(0);

// 쿠폰 할인 금액 계산
const couponDiscountAmount = computed(() => {
  if (!reservation.value || !selectedCoupon.value) return 0;

  const basePrice = reservation.value.basePrice;
  const coupon = selectedCoupon.value.coupon;

  if (!coupon) return 0;

  if (coupon.discountPercent > 0) {
    return Math.floor(basePrice * coupon.discountPercent / 100);
  } else {
    return coupon.discountAmount || 0;
  }
});

// 쿠폰 적용 후 가격
const finalPriceAfterCoupon = computed(() => {
  if (!reservation.value) return 0;
  return reservation.value.basePrice - couponDiscountAmount.value;
});

// 최종 가격 (쿠폰 + 포인트)
const finalPrice = computed(() => {
  return finalPriceAfterCoupon.value - appliedPoints.value;
});

// 쿠폰 선택 핸들러
const handleCouponSelection = (coupon) => {
  selectedCoupon.value = coupon;
  // 쿠폰 변경시 포인트 초기화
  if (!coupon) {
    pointsToUse.value = 0;
    appliedPoints.value = 0;
  }
};

// 페이지 떠나기 전 확인 (결제 페이지 이동만 체크)
onBeforeRouteLeave((to, from, next) => {
  // 결제 페이지로 가는 경우는 통과
  if (to.name === 'Payment') {
    next();
    return;
  }

  // 브라우저 뒤로가기나 다른 페이지로 이동 시 확인
  const answer = window.confirm('예약을 취소하시겠습니까? 선택한 쿠폰과 포인트 정보가 초기화됩니다.');
  if (answer) {
    // 쿠폰 사용 취소 처리
    if (selectedCoupon.value) {
      cancelCoupon();
    }
    // 예약 삭제 API 호출 (PENDING 상태인 경우)
    if (reservation.value?.reservationId) {
      api.delete(`/api/reservations/pending/${reservation.value.reservationId}`).catch(() => {});
    }
    next();
  } else {
    next(false);
  }
});

// 쿠폰 취소 처리
const cancelCoupon = async () => {
  if (selectedCoupon.value && selectedCoupon.value.id) {
    try {
      await api.patch(`/api/coupons/user/${selectedCoupon.value.id}/cancel`);
    } catch (error) {
      console.error("쿠폰 취소 실패:", error);
    }
  }
};

onMounted(async () => {
  const reservationId = route.query.reservationId;
  if (!reservationId) {
    alert("잘못된 접근입니다.");
    router.push('/');
    return;
  }

  try {
    const response = await api.get(`/api/reservations/${reservationId}`);
    reservation.value = response.data;
  } catch (error) {
    console.error("예약 정보를 불러오는 데 실패했습니다.", error);
    alert("예약 정보를 불러오는 데 실패했습니다.");
    router.push('/');
  }
});

// 브라우저 뒤로가기 감지
window.addEventListener('popstate', handleBrowserBack);

function handleBrowserBack(event) {
  event.preventDefault();
  const answer = window.confirm('예약을 취소하시겠습니까? 입력하신 정보가 저장되지 않습니다.');
  if (answer) {
    if (selectedCoupon.value) {
      cancelCoupon();
    }
    router.push('/');
  } else {
    window.history.pushState(null, '', window.location.href);
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('popstate', handleBrowserBack);
});

const nights = computed(() => {
  if (!reservation.value) return 0;
  const s = new Date(reservation.value.checkInDate);
  const e = new Date(reservation.value.checkOutDate);
  const diff = Math.round((e - s) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' };
  return new Date(dateString).toLocaleString('ko-KR', options);
};

const goToPayment = async () => {
  if (!reservation.value) return;

  try {
    // 서버에 최종 가격 업데이트 요청
    const updateData = {
      reservationId: reservation.value.reservationId,
      totalPrice: finalPrice.value,
      discountPrice: couponDiscountAmount.value + appliedPoints.value,
      userCouponId: selectedCoupon.value?.id || null,
      usedPoints: appliedPoints.value
    };

    // 예약 정보 업데이트 API 호출
    await api.patch(`/api/reservations/${reservation.value.reservationId}/update-price`, updateData);

    // 결제 페이지로 이동
    router.push({
      name: 'Payment',
      params: { reservationId: reservation.value.reservationId },
      query: { userCouponId: selectedCoupon.value?.id || null }
    });
  } catch (error) {
    console.error("예약 정보 업데이트 실패:", error);
    alert("결제 정보 업데이트에 실패했습니다.");
  }
};

const applyPoints = async () => {
  if (!pointsToUse.value || pointsToUse.value <= 0) {
    alert("사용할 포인트를 입력해주세요.");
    return;
  }

  // 쿠폰이 선택되지 않았을 때
  if (!selectedCoupon.value) {
    alert("쿠폰을 먼저 선택해주세요.");
    pointsToUse.value = 0;
    return;
  }

  // 포인트가 쿠폰 적용 후 가격보다 큰 경우
  if (pointsToUse.value > finalPriceAfterCoupon.value) {
    alert(`최대 ${finalPriceAfterCoupon.value.toLocaleString()}원까지 사용 가능합니다.`);
    pointsToUse.value = finalPriceAfterCoupon.value;
    return;
  }

  appliedPoints.value = pointsToUse.value;
  alert("✅ 포인트가 적용되었습니다.");
};
</script>

<style scoped>
.booking-page { max-width: 1120px; margin: 24px auto; padding: 0 16px; }
.grid { display: grid; grid-template-columns: 2fr 1fr; gap: 18px; margin-top: 18px; align-items: start; }
.left-col { display: flex; flex-direction: column; gap: 18px; }
.right-col { position: sticky; top: 80px; }
@media (max-width: 960px) { .grid { grid-template-columns: 1fr } .right-col { position: static } }

.info-section { border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; }
.info-section h2 { font-size: 1.25rem; font-weight: 600; margin: 0 0 16px; padding-bottom: 16px; border-bottom: 1px solid #e5e7eb; }
.info-item { display: flex; justify-content: space-between; font-size: 1rem; margin-bottom: 12px; }
.info-item .label { color: #6b7280; }
.info-item .value { font-weight: 500; }

.reservation-button { width: 100%; padding: 15px; background-color: #2ecc9a; color: white; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: background-color 0.2s; }
.reservation-button:hover { background-color: #2ecc9a; }

.loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 70vh; }
.spinner { width: 48px; height: 48px; border: 5px solid #f3f4f6; border-bottom-color: #4f46e5; border-radius: 50%; display: inline-block; animation: rotation 1s linear infinite; margin-bottom: 16px; }
@keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>