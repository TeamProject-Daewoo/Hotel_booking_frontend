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
        <Userinfo 
          v-model:name="guestName"
          v-model:phone="phone"
          @continue="onContinue" 
        />
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/axios';

import Breadcrumb     from '@/components/roomdetail/Breadcrumb.vue';
import RoomHero       from '@/components/roomdetail/RoomHero.vue';
import DatePicker     from '@/components/roomdetail/DatePicker.vue';
import PaymentOptions from '@/components/roomdetail/PaymentOptions.vue';
import Userinfo       from '@/components/roomdetail/Userinfo.vue';
import SummaryCard    from '@/components/roomdetail/SummaryCard.vue';
import { useSearchStore } from '@/api/searchRequestStore';

const route = useRoute()
const router = useRouter()
const searchStore = useSearchStore();

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
const checkIn  = ref(toISO(searchStore.checkInDate))
const checkOut = ref(toISO(searchStore.checkOutDate))
console.log(checkIn.value, checkOut.value)
const nights   = computed(()=>{
  const s = new Date(checkIn.value), e = new Date(checkOut.value)
  const diff = Math.round((e - s) / 86400000)
  return diff > 0 ? diff : 0
})

onMounted(async () => {
  try {
    const [b, dRes, i] = await Promise.allSettled([
      api.get(`/accommodations/${id}`),
      api.get(`/tour/detail/db/content/${id}`),  // ✅ DB 기반으로 통일
      api.get(`/tour/intro/db/${id}`)
    ])
    if (b.status==='fulfilled') base.value = normalizeBase(b.value.data || {})
    if (dRes.status==='fulfilled') rooms.value = Array.isArray(dRes.value.data) ? dRes.value.data : []
    if (i.status==='fulfilled') building.value = i.value.data || {}

    // ✅ idx 범위 체크 후 적용
    const validIdx = idx >= 0 && idx < rooms.value.length ? idx : 0
    room.value = rooms.value[validIdx] || {}
  } finally { ready.value = true }
})

/* helpers */
function stripAngle(u){ return String(u||'').replace(/^<|>$/g,'') }
function normalizeBase(b){ return {...b, firstimage:stripAngle(b.firstimage), firstimage2:stripAngle(b.firstimage2)} }
function asNum(v){ return Number(String(v||'0').replace(/[^\d]/g,'')) || 0 }
function lowestPrice(r){
  const arr=[r.roomoffseasonminfee1,r.roomoffseasonminfee2,r.roompeakseasonminfee1,r.roompeakseasonminfee2]
    .map(asNum).filter(n=>n>0)
  return arr.length ? Math.min(...arr) : 0
}

/* 결제/예약자 입력 */
const payMode   = ref('full')   // 'full' | 'partial'
const guestName = ref('')
const phone     = ref('')

/* ✅ 전화번호 자동 포맷 (3-4-4) */
function formatPhone(value){
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 3) return digits
  if (digits.length <= 7) return digits.slice(0,3) + '-' + digits.slice(3)
  return digits.slice(0,3) + '-' + digits.slice(3,7) + '-' + digits.slice(7,11)
}
watch(phone, (val) => {
  if (val === undefined || val === null) return
  const formatted = formatPhone(val)
  if (val !== formatted) {
    phone.value = formatted
  }
})

/* 요금 계산 */
const nightly    = computed(()=> lowestPrice(room.value))
const baseFare   = computed(()=> nightly.value * (nights.value || 1))
const discount   = computed(()=> 0)
const taxes      = computed(()=> 0)
const serviceFee = computed(()=> 0)
const total      = computed(()=> baseFare.value - discount.value + taxes.value + serviceFee.value)

/* 다음 페이지로 이동 */
function onContinue(){
  // ✅ 예약자 입력 검증
  if (!guestName.value.trim()) {
    alert("예약자 이름을 입력해주세요.")
    return
  }
  if (phone.value.replace(/\D/g,'').length < 10) {
    alert("전화번호를 올바르게 입력해주세요.")
    return
  }

  const phoneDigits = phone.value.replace(/\D/g,'') // 서버에는 숫자만 전달

  router.push({
    name: 'reserv', // 또는 'payment'
    query: {
      contentid: id,
      roomcode: room.value.id,
      hotelName: base.value.title,
      roomType: room.value.roomtitle,
      checkInDate: checkIn.value,
      checkOutDate: checkOut.value,
      nights: String(nights.value),
      numAdults: String(room.value.roombasecount ?? 2),
      numChildren: '0',
      totalPrice: String(total.value ?? 0),

      // ✅ 예약자/결제 정보 추가
      guestName: guestName.value,
      phone: phoneDigits,
      payMode: payMode.value
    }
  });
}
</script>

<style scoped>
.booking-page {
  max-width: 1120px;
  margin: 24px auto;
  padding: 0 16px;
  font-family: "Noto Sans KR", system-ui, Arial;
}
.loading {
  padding: 64px 0;
  text-align: center;
  color: #6b7280;
}
.grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 18px;
  margin-top: 18px;
  align-items: start;
}
.left-col, .right-col { min-width: 0; }
.left-col {
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: stretch;
}
.left-col > * {
  width: auto;
  box-sizing: border-box;
}
.right-col {
  position: sticky;
  top: 80px;  /* ✅ 헤더 높이에 맞게 */
  height: max-content;
  align-self: start;
  margin-top: 0;
}
@media (max-width: 960px) {
  .grid { grid-template-columns: 1fr }
  .right-col { position: static }
}
</style>
