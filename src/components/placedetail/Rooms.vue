<template>
  <!-- 가격 있는 객실이 있으면 그 목록을, 없으면 첫 1개만 -->
  <section class="rooms" v-if="visibleRooms.length">
    <h2>객실 정보</h2>
    <ul class="room-list">
      <li v-for="(r,i) in visibleRooms" :key="i" class="room-card">
        <div class="room-img">
          <img :src="pickImage(r)" />
        </div>

        <div class="room-info">
          <h3>{{ r.roomtitle || '객실' }}</h3>
          <p class="sub" v-if="r.roomintro">{{ r.roomintro }}</p>

          <div class="meta">
            <span v-if="hasOccupancy(r)">
              기준/최대: {{ toNum(r.roombasecount) ?? '-' }}/{{ toNum(r.roommaxcount) ?? '-' }}
            </span>
            <span v-if="roomSize(r) !== null">크기: {{ roomSize(r) }}㎡</span>
          </div>

          <div class="flags" v-if="hasAnyFlags(r)">
            <span v-if="asBool(r.roomaircondition)">에어컨</span>
            <span v-if="asBool(r.roomtv)">TV</span>
            <span v-if="asBool(r.roominternet)">Wi-Fi</span>
            <span v-if="asBool(r.roomrefrigerator)">냉장고</span>
            <span v-if="asBool(r.roomtoiletries)">어메니티</span>
            <span v-if="asBool(r.roomhairdryer)">드라이어</span>
            <span v-if="asBool(r.roomtable)">테이블</span>
            <span v-if="asBool(r.roombathfacility)">욕실</span>
          </div>
        </div>

        <div class="room-price">
          <div class="price" :class="{ muted: !bookable(r) }">
            {{ priceText(r) }}<span v-if="bookable(r)">/박</span>
          </div>
          <button
            class="book-line"
            :disabled="!bookable(r)"
            :class="{ disabled: !bookable(r) }"
            @click="$emit('bookRoom', i)"
          >
            예약하기
          </button>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  rooms: { type: Array, default: () => [] },
  // ✅ 호텔 대표사진(들) 전달: [base.firstimage, base.firstimage2] 같은 배열
  fallbackImages: { type: Array, default: () => [] }
})
defineEmits(['bookRoom'])

/* ---------- utils ---------- */
function stripAngle(u){ return String(u||'').replace(/^<|>$/g,'') }
function firstNonEmpty(arr){
  const found = arr.find(v => v && String(v).trim() !== '')
  return stripAngle(found || '')
}
function asBool(v){ return String(v||'').toUpperCase() === 'Y' }

function toNum(v){
  const n = Number(String(v ?? '').replace(/[^\d]/g,''))
  return Number.isFinite(n) ? n : null
}

/* ✅ 객실 이미지 → 없으면 호텔 사진 → 없으면 placeholder */
function pickImage(r){
  const url = firstNonEmpty([
    r.roomimg1, r.roomimg2, r.roomimg3, r.roomimg4, r.roomimg5,
    ...(props.fallbackImages || [])
  ])
  return url || 'https://picsum.photos/400/300?blur=3'
}

function roomSize(r){
  return toNum(r.roomsize2) ?? toNum(r.roomsize1)
}
function hasOccupancy(r){
  return toNum(r.roombasecount) !== null || toNum(r.roommaxcount) !== null
}
function hasAnyFlags(r){
  return ['roomaircondition','roomtv','roominternet','roomrefrigerator','roomtoiletries','roomhairdryer','roomtable','roombathfacility']
    .some(k => asBool(r[k]))
}

/* 가격 관련 */
function minPositivePrice(r){
  const candidates = [
    r.roomoffseasonminfee1, r.roomoffseasonminfee2,
    r.roompeakseasonminfee1, r.roompeakseasonminfee2
  ]
  .map(toNum)
  .filter(n => n !== null && n > 0)

  return candidates.length ? Math.min(...candidates) : null
}
function bookable(r){ return minPositivePrice(r) !== null }
function priceText(r){
  const p = minPositivePrice(r)
  return p !== null ? '₩' + p.toLocaleString() : '문의'
}

/* ✅ 노출 로직: 가격>0 있는 방들 → 없으면 첫 1개만 */
const visibleRooms = computed(() => {
  const priced = props.rooms.filter(bookable)
  if (priced.length > 0) return priced
  return props.rooms.length ? [props.rooms[0]] : []
})
</script>

<style scoped>
.rooms h2{margin:24px 0 12px;font-size:20px}
.room-list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:16px}

.room-card{transition:.2s;display:grid;grid-template-columns:220px 1fr 180px;gap:16px;align-items:center;border:1px solid #eee;border-radius:12px;padding:12px;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.04)}
.room-card:hover{transform:translateY(-3px);box-shadow:0 10px 24px rgba(0,0,0,.10),0 2px 8px rgba(0,0,0,.06)}

.room-img img{width:220px;height:140px;object-fit:cover;border-radius:10px}

.room-info h3{margin:0 0 6px;font-size:18px;font-weight:600}
.room-info .sub{color:#666;font-size:14px;margin-bottom:6px}
.room-info .meta{font-size:13px;color:#444;margin-bottom:6px;display:flex;gap:16px;flex-wrap:wrap}

.flags{display:flex;flex-wrap:wrap;gap:6px}
.flags span{background:#f0f0f0;border-radius:6px;padding:4px 8px;font-size:12px;color:#444}

.room-price{text-align:right}
.price{font-size:20px;font-weight:700;color:#f36}
.price.muted{color:#888}
.price span{font-size:12px;color:#777;margin-left:4px}

.book-line{margin-top:10px;padding:10px 16px;background:#2ecc9a;color:#fff;border:none;border-radius:8px;font-weight:600;transition:background .2s ease;cursor:pointer}
.book-line:hover{background-color:#3aa38b}
.book-line.disabled,
.book-line:disabled{background:#cfcfcf;cursor:not-allowed}

@media(max-width:900px){
  .room-card{grid-template-columns:1fr;text-align:left}
  .room-price{text-align:left;margin-top:8px}
}
</style>
