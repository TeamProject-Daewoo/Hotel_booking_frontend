<template>
  <section class="rooms" v-if="rooms.length">
    <h2>객실 정보</h2>
    <ul class="room-list">
      <li v-for="(r,i) in rooms" :key="i" class="room-card">
        <div class="room-img">
          <img :src="firstNonEmpty([r.roomimg1,r.roomimg2,r.roomimg3,r.roomimg4,r.roomimg5])" />
        </div>

        <div class="room-info">
          <h3>{{ r.roomtitle || '객실' }}</h3>
          <p class="sub">{{ r.roomintro }}</p>
          <div class="meta">
            <span>기준/최대: {{ r.roombasecount }}/{{ r.roommaxcount }}</span>
            <span>크기: {{ r.roomsize2 || r.roomsize1 || '-' }}㎡</span>
          </div>
          <div class="flags">
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
          <div class="price" :class="{muted:isZeroPrice(r)}">
            {{ displayPrice(r) }}<span>/박</span>
          </div>
          <button class="book-line" @click="$emit('bookRoom', i)">예약하기</button>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
const props = defineProps({
  rooms: { type: Array, default: () => [] }
})
defineEmits(['bookRoom'])

function stripAngle(u){ return String(u||'').replace(/^<|>$/g,'') }
function firstNonEmpty(arr){ return stripAngle(arr.find(Boolean)) || 'https://picsum.photos/400/300?blur=3' }
function asBool(v){ return String(v||'').toUpperCase() === 'Y' }
function isZeroPrice(r){
  const nums = [r.roomoffseasonminfee1,r.roomoffseasonminfee2,r.roompeakseasonminfee1,r.roompeakseasonminfee2]
    .map(x => Number(String(x||'0').replace(/[^\d]/g,'')) || 0)
  return nums.every(n => n === 0)
}
function displayPrice(r){
  if (isZeroPrice(r)) return '문의'
  const pri = [r.roomoffseasonminfee1,r.roompeakseasonminfee1,r.roomoffseasonminfee2,r.roompeakseasonminfee2]
    .map(x => Number(String(x||'0').replace(/[^\d]/g,'')) || 0)
    .filter(n => n > 0).sort((a,b)=>a-b)[0]
  return '₩' + pri.toLocaleString()
}
</script>

<style scoped>
.rooms h2{margin:24px 0 12px;font-size:20px}
.room-list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:16px}
.room-card:hover{transform:translateY(-3px);box-shadow:0 10px 24px rgba(0,0,0,.10),
  0 2px 8px rgba(0,0,0,.06);}
.room-card{transition:.2s;display:grid;grid-template-columns:220px 1fr 180px;gap:16px;align-items:center;border:1px solid #eee;border-radius:12px;padding:12px;background:#fff;box-shadow: 0 2px 6px rgba(0,0,0,.04);}
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
.book-line{margin-top:10px;padding:10px 16px;background:#2ecc9a;color:#fff;border:none;border-radius:8px;font-weight:600;text-decoration:none;
  transition: background 0.2s ease;
}
.book-line:hover{background-color: #3aa38b;}
@media(max-width:900px){
  .room-card{grid-template-columns:1fr;text-align:left}
  .room-price{text-align:left;margin-top:8px}
}
</style>
