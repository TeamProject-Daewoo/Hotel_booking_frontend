<template>
  <section class="card summary">
    <!-- 상단 (호텔 + 객실 이미지/정보) -->
    <div class="sum-head">
      <img
        :src="firstNonEmpty([
          room.roomimg1,
          room.roomimg2,
          room.roomimg3,
          room.roomimg4,
          room.roomimg5,
          base.firstimage,
          base.firstimage2
        ])"
        alt="room"
      />
      <div class="sum-title">
        <div class="hotel">{{ base.title || '-' }}</div>
        <div class="room">{{ room.roomtitle || '객실' }}</div>
        <div class="meta" v-if="nights>0">{{ nights }}박 · {{ checkIn }} → {{ checkOut }}</div>
      </div>
    </div>

    <!-- 리뷰 / 보호 메시지 -->
    <div class="guard">
      Your booking is protected by <b>golobe</b>
    </div>

    <!-- 가격 요약 -->
    <div class="rows">
      <!-- 기본 금액 -->
      <div class="row">
        <span>기본금액</span><b>{{ currency(fare) }}</b>
      </div>

      <!-- 총 할인 금액 -->
      <div class="row" v-if="discount > 0">
        <span>총 할인가</span><b>-{{ currency(discount) }}</b>
      </div>

      <!-- 할인 상세 내역 -->
      <div class="rows details" v-if="discount > 0">
        <div class="row" v-if="couponDiscount > 0">
          <span>ㄴ쿠폰</span><b>{{ currency(couponDiscount) }}</b>
        </div>
        <div class="row" v-if="pointDiscount > 0">
          <span>ㄴ포인트</span><b>{{ currency(pointDiscount) }}</b>
        </div>
        <div class="row" v-if="taxes > 0">
          <span>ㄴ수수료</span><b>{{ currency(taxes) }}</b>
        </div>
        <div class="row" v-if="serviceFee > 0">
          <span>ㄴService Fee</span><b>{{ currency(serviceFee) }}</b>
        </div>
      </div>

      <!-- 구분선 -->
      <div class="divider"></div>

      <!-- 총 결제 금액 -->
      <div class="row total">
        <span>총 결제금액</span><b>{{ currency((total < 0 ? 0 : total)) }}</b>
      </div>
    </div>
  </section>
</template>

<script setup>
function stripAngle(u){ return String(u||'').replace(/^<|>$/g,'') }
function firstNonEmpty(arr){ return stripAngle(arr.find(Boolean)) || 'https://picsum.photos/400/300?blur=3' }
function currency(n){ return '₩' + (Number(n||0)).toLocaleString() }

defineProps({
  base: Object,
  room: Object,
  checkIn: String,
  checkOut: String,
  nights: Number,
  fare: Number,
  discount: Number,
  taxes: Number,
  serviceFee: Number,
  total: Number,
  couponDiscount: Number,
  pointDiscount: Number
})
</script>

<style scoped>
.card {
  background:#fff;
  border:1px solid #e5e7eb;
  border-radius:14px;
  box-shadow:0 8px 24px rgba(0,0,0,.04);
  padding:16px;
}

.summary .sum-head {
  display:flex;
  gap:12px;
  align-items:center;
}
.summary img {
  width:72px;
  height:72px;
  object-fit:cover;
  border-radius:12px;
  border:1px solid #e5e7eb;
}
.summary .hotel { font-weight:800; }
.summary .room  { color:#555; font-size:13px; }
.summary .meta  { color:#888; font-size:12px; margin-top:2px; }

.guard {
  margin:10px 0 6px;
  color:#64748b;
  font-size:12px;
}

.rows {
  font-family: "Noto Sans KR", sans-serif;
  color: #333;
}

.rows .row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
}

.rows .row span {
  font-weight: 500;
}

.rows .row b {
  font-weight: 600;
}

.rows.details {
  margin-left: 10px;            /* 전체 들여쓰기 */
  border-left: 2px solid #eee;  /* 옆에 라인으로 구분 */
  padding-left: 10px;
  margin-top: 4px;
}

.rows.details .row span,
.rows.details .row b {
  font-size: 0.9em;     /* 좀 더 작게 */
  color: #666;          /* 고급진 회색 */
}

.divider {
  border-top: 1px dashed #ccc;  /* 점선으로 구분 */
  margin: 12px 0;
}

.row.total {
  font-size: 1.05em;
  font-weight: 700;
  color: #222;
}

.row.total span {
  font-weight: 700;
}

</style>
