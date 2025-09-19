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
      <div class="row">
        <span>Base Fare</span><b>{{ currency(fare) }}</b>
      </div>
      <div class="row" v-if="discount>0">
        <span>Discount</span><b>-{{ currency(discount) }}</b>
      </div>
      <div class="row" v-if="taxes>0">
        <span>Taxes</span><b>{{ currency(taxes) }}</b>
      </div>
      <div class="row" v-if="serviceFee>0">
        <span>Service Fee</span><b>{{ currency(serviceFee) }}</b>
      </div>
      <div class="divider"></div>
      <div class="row total">
        <span>Total</span><b>{{ currency(total) }}</b>
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
  total: Number
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

.rows { margin-top:6px; }
.row {
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin:8px 0;
}
.row b {
  font-feature-settings:"tnum";
  font-variant-numeric:tabular-nums;
}
.divider {
  border-top:1px solid #e5e7eb;
  margin:8px 0;
}
.row.total { font-weight:800; }
</style>
