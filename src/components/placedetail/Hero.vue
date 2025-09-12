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

        <!-- 주소/체크인아웃 -->
        <div class="meta-inline">
          <span><i class="fa-solid fa-location-dot"></i> {{ base.addr1 || '-' }}</span>
          <span v-if="building.checkintime || building.checkouttime" class="dot">•</span>
          <span v-if="building.checkintime || building.checkouttime">
            체크인 {{ building.checkintime || '-' }} / 체크아웃 {{ building.checkouttime || '-' }}
          </span>
        </div>

        <!-- ⭐ 평점/리뷰수 -->
        <div v-if="hasReviewInfo" class="review-inline">
          <span class="rate-badge">{{ ratingText }}</span>
          <b class="rate-label">{{ ratingLabelText }}</b>
          <span class="rate-reviews">{{ reviewCountNum }} reviews</span>
        </div>
      </div>

      <div class="cta-box">
        <!-- 가격 -->
        <div v-if="showPrice" class="price-chip" aria-label="가격 정보">
          <div class="price-row">
            <span v-if="strikeValue != null" class="strike">{{ formattedStrike }}</span>
            <strong class="price">{{ formattedPrice }}</strong>
            <span class="per">/ {{ perLabel }}</span>
          </div>
          <div v-if="priceNote" class="note">{{ priceNote }}</div>
        </div>
        <div v-else class="price-chip" aria-label="가격 정보">
          <div class="price-row">
            <strong class="price">문의</strong>
          </div>
          <div class="note">요금 정보가 제공되지 않았습니다</div>
        </div>

        <!-- 액션: 찜 / 공유 / 예약 -->
        <div class="cta-actions">
          <button class="icon-btn" :aria-pressed="liked" aria-label="찜하기" @click="toggleLike">
            <i :class="liked ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
          </button>

          <button class="icon-btn" aria-label="공유하기" @click="onShare">
            <i class="fa-solid fa-share-nodes"></i>
          </button>

          <!-- 예약 버튼 -->
          <button
            class="book-btn"
            :class="{ disabled: !canBook }"
            :disabled="!canBook"
            @click="$emit('book')"
          >
            예약하기
          </button>
        </div>
      </div>
    </header>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  rooms: { type: Array, default: () => [] },
  base:  { type: Object, required: true },
  building: { type: Object, required: true },

  // 가격 관련
  price: { type: [Number, String], default: null },
  strikePrice: { type: [Number, String], default: null },
  per: { type: String, default: 'night' },
  currency: { type: String, default: 'KRW' },
  priceNote: { type: String, default: '' },

  // 평점/리뷰 (없으면 0으로 표기)
  rating: { type: [Number, String], default: null },
  reviewCount: { type: [Number, String], default: null },
  ratingLabel: { type: String, default: '' },

  // 국가 라벨(선택)
  country: { type: String, default: '' },

  // 예약 가능 여부(선택)
  hasRooms: { type: Boolean, default: undefined }
})

// 지역 관련 맵
const areaMap = {
  '1': 'Seoul', '2': 'Incheon', '3': 'Daejeon', '4': 'Daegu', '5': 'Gwangju', '6': 'Busan', '7': 'Ulsan', '8': 'Sejong',
  '31': 'Gyeonggi', '32': 'Gangwon', '33': 'Chungbuk', '34': 'Chungnam', '35': 'Gyeongbuk', '36': 'Gyeongnam',
  '37': 'Jeonbuk', '38': 'Jeonnam', '39': 'Jeju'
}

const sigunguMap = {
  '1': 'Gangnam-gu', '2': 'Jung-gu', // 예시
}

const regionLabel = computed(() => {
  const areaName = areaMap[props.base?.areaCode]
  const sigunguName = sigunguMap[props.base?.sigunguCode]
  return areaName && sigunguName ? `${areaName} - ${sigunguName}` : areaName || 'Anywhere'
})

function pickCountryFromAddr(addr) {
  if (!addr) return ''
  if (/[가-힣]/.test(addr)) return 'South Korea'
  return ''
}

const countryLabel = computed(() => {
  if (props.country) return props.country
  if (props.base?.countryName) return props.base.countryName
  if (props.base?.areaCode) return 'South Korea'
  const byAddr = pickCountryFromAddr(props.base?.addr1)
  return byAddr || 'Anywhere'
})

// 숫자 파싱
const toNum = (v) => {
  if (v === null || v === undefined || v === '') return null
  const n = Number(v)
  if (Number.isFinite(n)) return n
  const stripped = Number(String(v).replace(/[^\d.-]/g, ''))
  return Number.isFinite(stripped) ? stripped : null
}

// 가격 계산
const minRoomPrice = computed(() => {
  const fees = (props.rooms || []).flatMap(r => [
    r.roomoffseasonminfee1, r.roomoffseasonminfee2,
    r.roompeakseasonminfee1, r.roompeakseasonminfee2
  ].map(toNum))
  const vals = fees.filter(v => v != null && v > 0)
  return vals.length ? Math.min(...vals) : null
})

const priceValue = computed(() => {
  const p = toNum(props.price)
  return p != null && p > 0 ? p : minRoomPrice.value
})

const strikeValue = computed(() => {
  const s = toNum(props.strikePrice)
  return s != null && s > 0 ? s : null
})

const showPrice = computed(() => priceValue.value != null && priceValue.value > 0)

// 예약 가능 여부
const canBook = computed(() => priceValue.value != null && priceValue.value > 0)

// 포맷
const formatMoney = (n) => {
  try {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: props.currency || 'KRW',
      maximumFractionDigits: 0
    }).format(n)
  } catch { return String(n) }
}

const formattedPrice  = computed(() => showPrice.value ? formatMoney(priceValue.value) : '')
const formattedStrike = computed(() => strikeValue.value != null ? formatMoney(strikeValue.value) : '')
const perLabel = computed(() => props.per || '박')

// 평점/리뷰수
const ratingNum = computed(() => {
  const n = toNum(props.rating)
  return n != null ? Number(n.toFixed(1)) : 0
})

const ratingText = computed(() => ratingNum.value.toFixed(1))

const reviewCountNum = computed(() => {
  const n = toNum(props.reviewCount)
  return n != null ? n : 0
})

const ratingLabelText = computed(() => {
  if (props.ratingLabel) return props.ratingLabel
  const r = ratingNum.value
  if (r >= 4.6) return 'Excellent'
  if (r >= 4.0) return 'Very Good'
  if (r >= 3.0) return 'Good'
  return r > 0 ? 'Fair' : ''
})

const hasReviewInfo = computed(() => ratingNum.value != null || reviewCountNum.value > 0)

// 찜/공유
const liked = ref(false)
const toggleLike = () => { liked.value = !liked.value }

const onShare = async () => {
  const shareData = {
    title: props.base?.title || '숙소',
    text: props.base?.addr1 || '',
    url: typeof window !== 'undefined' ? window.location.href : ''
  }
  try {
    if (navigator.share) {
      await navigator.share(shareData)
      return
    }
    if (window.isSecureContext && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareData.url)
      return
    }
    const ta = document.createElement('textarea')
    ta.value = shareData.url
    ta.setAttribute('readonly', '')
    ta.style.position = 'absolute'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  } catch {
    // 무시 또는 별도 토스트로 처리 가능
  }
}
</script>

<style scoped>
.hero-wrap { margin-top: 6px; }

/* Breadcrumb */
.breadcrumb { display: flex; align-items: center; gap: 10px; font-size: 14px; margin-bottom: 8px; }
.breadcrumb .crumb { color: #ff8f93; font-weight: 600; }
.breadcrumb .country { opacity: .95; }
.breadcrumb .region { opacity: .9; }
.breadcrumb .sep { color: #c9d3cc; font-weight: 700; }
.breadcrumb .current { color: #6b7280; font-weight: 700; }

/* Header */
.hero { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; padding: 8px 0 12px; border-bottom: 1px solid #eee; }
.title-box h1 { margin: 0 0 6px; font-size: 28px; font-weight: 700; }
.meta-inline { color: #555; display: flex; flex-wrap: wrap; gap: 8px; font-size: 14px; }
.meta-inline .dot { color: #bbb; }

/* 리뷰 배지 */
.review-inline { align-items: center; gap: 10px; margin-top: 8px; font-size: 14px; color: #2a2a2a; }
.rate-badge {
  display: inline-block; min-width: 36px; padding: 4px 8px; border: 1px solid #d7ebe5; border-radius: 8px;
  font-weight: 700; text-align: center; line-height: 1;
}
.rate-label { margin-left: 2px; margin-right: 4px; }
.rate-reviews { color: #6b7280; }

/* CTA */
.cta-box { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }
.price-chip { text-align: right; }
.price-row { display: flex; align-items: baseline; gap: 8px; }
.price-row .strike { text-decoration: line-through; color: #a8b0a8; font-size: 13px; }
.price-row .price { font-size: 30px; line-height: 1; font-weight: 800; color: #f89489; }
.price-row .per { font-size: 16px; color: #6b7280; }
.price-chip .note { margin-top: 2px; font-size: 12px; color: #9aa39c; }

/* 액션 버튼 묶음 */
.cta-actions { display: flex; align-items: center; gap: 8px; }
.icon-btn {
  width: 40px; height: 40px; display: inline-flex; align-items: center; justify-content: center;
  background: #fff; border: 1px solid #3aa38b; border-radius: 8px; cursor: pointer;
  transition: background .15s ease, transform .15s ease, box-shadow .15s ease;
}
.icon-btn:hover {
  background: #d7ebe5; transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, .08), 0 2px 6px rgba(0, 0, 0, .04);
}
.icon-btn i { font-size: 16px; color: #2b7264; }

.book-btn {
  padding: 12px 20px; background: #5acab2; color: #0c2c2b; border: none; border-radius: 8px; font-weight: 700;
  transition: transform .2s ease, box-shadow .2s ease, background-color .2s ease;
}
.book-btn:hover {
  background-color: #3aa38b; transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, .10), 0 2px 8px rgba(0, 0, 0, .06);
}
.book-btn.disabled { background: #ccc; color: #555; cursor: not-allowed; transform: none; box-shadow: none; }
</style>
