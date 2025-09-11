<template>
  <div class="booking-page" v-if="ready">
    <Breadcrumb :id="id" :title="base.title" />

    <RoomHero :base="base" :room="room" :building="building" />

    <div class="grid">
      <div class="left-col">
        <DatePicker
          v-model:checkIn="checkIn"
          v-model:checkOut="checkOut"
          :building="building"
        />
        <PaymentOptions v-model="payMode" />
        <LoginBox v-model="phone" @continue="onContinue" />
      </div>

      <aside class="right-col">
        <SummaryCard
          :base="base"
          :room="room"
          :checkIn="checkIn"
          :checkOut="checkOut"
          :nights="nights"
          :fare="baseFare"
          :discount="discount"
          :taxes="taxes"
          :serviceFee="serviceFee"
          :total="total"
        />
      </aside>
    </div>
  </div>

  <div v-else class="loading">불러오는 중...</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/axios';

import Breadcrumb     from '@/components/roomdetail/Breadcrumb.vue';
import RoomHero       from '@/components/roomdetail/RoomHero.vue';
import DatePicker     from '@/components/roomdetail/DatePicker.vue';
import PaymentOptions from '@/components/roomdetail/PaymentOptions.vue';
import LoginBox       from '@/components/roomdetail/LoginBox.vue';
import SummaryCard    from '@/components/roomdetail/SummaryCard.vue';

const route = useRoute()
const router = useRouter()
const id   = route.params.id
const idx  = Number(route.params.idx)

const base     = ref({})
const building = ref({})
const rooms    = ref([])
const room     = ref({})
const ready    = ref(false)

/* 날짜 초기화 */
const today = new Date()
const d = (x)=> new Date(today.getFullYear(), today.getMonth(), today.getDate() + x)
const toISO = (date)=> date.toISOString().slice(0,10)
const checkIn  = ref(toISO(d(1)))
const checkOut = ref(toISO(d(2)))
const nights   = computed(()=>{
  const s = new Date(checkIn.value), e = new Date(checkOut.value)
  const diff = Math.round((e - s) / 86400000)
  return diff > 0 ? diff : 0
})

onMounted(async () => {
  try {
    const [b, d, i] = await Promise.allSettled([
      api.get(`/accommodations/${id}`),
      api.get(`/tour/detail/${id}`),
      api.get(`/tour/intro/${id}`)
    ])
    if (b.status==='fulfilled') base.value = normalizeBase(b.value.data || {})
    if (d.status==='fulfilled') rooms.value = d.value.data?.response?.body?.items?.item || []
    if (i.status==='fulfilled') building.value = i.value.data || {}
    room.value = rooms.value[idx] || {}
  } finally { ready.value = true }
})

/* helpers */
function stripAngle(u){ return String(u||'').replace(/^<|>$/g,'') }
function normalizeBase(b){ return {...b, firstimage:stripAngle(b.firstimage), firstimage2:stripAngle(b.firstimage2)} }
function asNum(v){ return Number(String(v||'0').replace(/[^\d]/g,'')) || 0 }
function lowestPrice(r){
  const arr=[r.roomoffseasonminfee1,r.roomoffseasonminfee2,r.roompeakseasonminfee1,r.roompeakseasonminfee2].map(asNum).filter(n=>n>0)
  return arr.length ? Math.min(...arr) : 0
}

/* 결제 */
const payMode = ref('full')
const phone   = ref('')

const nightly = computed(()=> lowestPrice(room.value))
const baseFare = computed(()=> nightly.value * (nights.value || 1))
const discount = computed(()=> 0)
const taxes    = computed(()=> 0)
const serviceFee = computed(()=> 0)
const total = computed(()=> baseFare.value - discount.value + taxes.value + serviceFee.value)

function onContinue(){
  console.log('continue', { phone:phone.value, payMode:payMode.value })
  router.push({
    name: 'reserv', // router/index.js에 정의된 이름
    query: {
      contentid: id,
      roomcode: room.value.roomcode,
      hotelName: base.value.title,
      roomType: room.value.roomtitle,
      checkInDate: checkIn.value,
      checkOutDate: checkOut.value,
      nights: nights.value,
      numAdults: room.value.roombasecount, // 예시로 기본 인원수 전달
      numChildren: 0, // 예시로 아동 0명 전달
      totalPrice: total.value
    }
  });
}
</script>

<style scoped>
/* 상위에서 공통 그리드 및 폰트만 유지 */
.booking-page{max-width:1120px;margin:24px auto;padding:0 16px;font-family:"Noto Sans KR",system-ui,Arial}
.loading{padding:64px 0;text-align:center;color:#6b7280}
.grid{
  display:grid;
  grid-template-columns: 2fr 1fr;
  gap:18px;
  margin-top:18px;
  align-items:start;           /* ✅ 오른쪽 컬럼도 맨 위로 정렬 */
}
.left-col,.right-col{min-width:0;}
.left-col {
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items:stretch;   /* 기본값이지만 명시해두면 안전 */
}
.left-col > * {
  width:auto;            /* 또는 아예 이 규칙을 삭제 */
  /* width:100% 로 해도 됨 */
  box-sizing:border-box;
}
.right-col{
  position: sticky;
  top: 0;                     /* ✅ 헤더/히어로 바로 아래부터 붙게 */
  height: max-content;
  align-self: start;          /* ✅ 자신도 위로 정렬 */
  margin-top: 0;              /* 혹시 모를 마진 제거 */
}
@media (max-width: 960px){
  .grid{grid-template-columns:1fr}
  .right-col{position:static}
}
</style>
