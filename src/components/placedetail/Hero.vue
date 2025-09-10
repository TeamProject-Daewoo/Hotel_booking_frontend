<!-- src/components/placedetail/Hero.vue -->
<template>
  <div class="hero-wrap">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
      <span class="crumb country">{{ countryLabel }}</span>
      <span class="sep">›</span>
      <span v-if="regionLabel" class="crumb region">{{ regionLabel }}</span>
      <span v-if="regionLabel" class="sep">›</span>
      <span class="current">{{ base.title || '숙소' }}</span>
    </nav>

    <!-- Header -->
    <header class="hero">
      <div class="title-box">
        <h1>{{ base.title }}</h1>
        <div class="meta-inline">
          <span><i class="fa-solid fa-location-dot"></i> {{ base.addr1 || '-' }}</span>
          <span v-if="building.checkintime || building.checkouttime" class="dot">•</span>
          <span v-if="building.checkintime || building.checkouttime">
            체크인 {{ building.checkintime || '-' }} / 체크아웃 {{ building.checkouttime || '-' }}
          </span>
        </div>
      </div>

      <div class="cta-box">
        <!-- ✅ 가격: hasRooms 조건 제거 + 문자열도 숫자 변환 + rooms에서 자동 추출 -->
        <div v-if="showPrice" class="price-chip" aria-label="가격 정보">
          <div class="price-row">
            <span v-if="strikeValue != null" class="strike">{{ formattedStrike }}</span>
            <strong class="price">{{ formattedPrice }}</strong>
            <span class="per">/ {{ perLabel }}</span>
          </div>
          <div v-if="priceNote" class="note">{{ priceNote }}</div>
        </div>

        <button
          class="book-btn"
          :class="{ disabled: !hasRoomsLocal }"
          :disabled="!hasRoomsLocal"
          @click="$emit('book')"
        >
          예약하기
        </button>
      </div>
    </header>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  rooms: { type: Array, default: () => [] },
  base: { type: Object, required: true },
  building: { type: Object, required: true },

  /* ✅ 가격 관련 props (문자열/숫자 모두 허용) */
  price: { type: [Number, String], default: null },       // 표시용 판매가
  strikePrice: { type: [Number, String], default: null }, // 원가(취소선)
  per: { type: String, default: 'night' },                   // '박' | 'night' 등
  currency: { type: String, default: 'KRW' },
  priceNote: { type: String, default: '' },

  /* 기존 hasRooms 대신 내부에서 rooms로도 판별 (넘겨주면 그대로 활용) */
  hasRooms: { type: Boolean, default: undefined }
})

/* 국가/지역 라벨 */
const countryLabel = computed(() => 'South Korea')
const areaMap = {
  '1':'Seoul','2':'Incheon','3':'Daejeon','4':'Daegu','5':'Gwangju','6':'Busan','7':'Ulsan','8':'Sejong',
  '31':'Gyeonggi','32':'Gangwon','33':'Chungbuk','34':'Chungnam','35':'Gyeongbuk','36':'Gyeongnam',
  '37':'Jeonbuk','38':'Jeonnam','39':'Jeju'
}
function pickRegionFromAddr(addr) {
  if (!addr) return ''
  const tokens = String(addr).trim().split(/\s+/)
  if (tokens.length >= 2) return tokens[1].replace(/(시|군|구)$/, '')
  if (tokens.length >= 1) return tokens[0]
  return ''
}
const regionLabel = computed(() => {
  const byAddr = pickRegionFromAddr(props.base?.addr1)
  if (byAddr) return byAddr
  const byCode = areaMap[String(props.base?.areaCode || '')]
  return byCode || 'Anywhere'
})

/* ✅ 숫자 파싱: "240,000원" 같은 문자열도 안전 변환 */
const toNum = (v) => {
  if (v === null || v === undefined || v === '') return null
  const n = Number(v)
  if (Number.isFinite(n)) return n
  const stripped = Number(String(v).replace(/[^\d.-]/g, ''))
  return Number.isFinite(stripped) ? stripped : null
}

/* ✅ rooms에서 최저가 자동 계산 (price 미전달 시) */
const minRoomPrice = computed(() => {
  const fees = (props.rooms || []).flatMap(r => [
    r.roomoffseasonminfee1, r.roomoffseasonminfee2,
    r.roompeakseasonminfee1, r.roompeakseasonminfee2
  ].map(toNum))
  const vals = fees.filter(v => v != null)
  return vals.length ? Math.min(...vals) : null
})

/* ✅ 최종 표시 가격/원가 */
const priceValue = computed(() => toNum(props.price) ?? minRoomPrice.value)
const strikeValue = computed(() => toNum(props.strikePrice))

/* ✅ 가격 표시 여부 */
const showPrice = computed(() => priceValue.value != null)

/* ✅ 예약 가능 여부: prop 우선, 없으면 rooms 기준 */
const hasRoomsLocal = computed(() =>
  typeof props.hasRooms === 'boolean'
    ? props.hasRooms
    : Array.isArray(props.rooms) && props.rooms.length > 0
)

/* 포맷팅 */
const formatMoney = (n) => {
  try {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: props.currency || 'KRW',
      maximumFractionDigits: 0
    }).format(n)
  } catch { return String(n) }
}
const formattedPrice = computed(() => showPrice.value ? formatMoney(priceValue.value) : '')
const formattedStrike = computed(() => strikeValue.value != null ? formatMoney(strikeValue.value) : '')
const perLabel = computed(() => props.per || '박')
</script>

<style scoped>
.hero-wrap{margin-top:6px}

/* Breadcrumb */
.breadcrumb{display:flex;align-items:center;gap:10px;font-size:14px;margin-bottom:8px}
.breadcrumb .crumb{color:#ff8f93;font-weight:600}
.breadcrumb .country{opacity:.95}
.breadcrumb .region{opacity:.9}
.breadcrumb .sep{color:#c9d3cc;font-weight:700}
.breadcrumb .current{color:#6b7280;font-weight:700}

/* Header */
.hero{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;padding:8px 0 12px;border-bottom:1px solid #eee}
.title-box h1{margin:0 0 6px;font-size:28px;font-weight:700}
.meta-inline{color:#555;display:flex;flex-wrap:wrap;gap:8px;font-size:14px}
.meta-inline .dot{color:#bbb}

/* CTA */
.cta-box{display:flex;flex-direction:column;align-items:flex-end;gap:8px}
.price-chip{text-align:right}
.price-row{display:flex;align-items:baseline;gap:8px}
.price-row .strike{ text-decoration:line-through;color:#a8b0a8;font-size:13px }
.price-row .price{ font-size:30px;line-height:1;font-weight:800 }
.price-row .per{ font-size:16px;color:#6b7280 }
.price-chip .note{ margin-top:2px;font-size:12px;color:#9aa39c }

.book-btn{
  padding:15px 50px;background:#2ecc9a;color:#fff;border:none;border-radius:8px;font-weight:600;
  transition:transform .2s ease, box-shadow .2s ease, background-color .2s ease;
}
.book-btn:hover{background-color:#3aa38b;transform:translateY(-1px);
  box-shadow:0 10px 24px rgba(0,0,0,.10),0 2px 8px rgba(0,0,0,.06)}
.book-btn.disabled{background:#ccc;cursor:not-allowed;transform:none;box-shadow:none}
</style>
