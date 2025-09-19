<template>
  <div class="detail-page">
    <Hero
      :rooms="rooms"
      :base="base"
      :building="building"
      :hasRooms="rooms.length > 0"
      @book="goFirstRoom"
    />
    <Gallery :images="gallery" />
    <Overview :rooms="rooms" :base="base" :building="building" />
    <Rooms
      :rooms="rooms"
      :fallback-images="[base.firstimage, base.firstimage2]"
      @bookRoom="onBookRoom"
    />
    <Map
      :mapx="base.mapx"
      :mapy="base.mapy"
      :address="base.addr1"
      :title="base.title"
      :price="minPriceText"
    />
    <Reviews
        :reviews="reviews"
        :pageSize="5"
        @write-review="openReviewModal"
        @report="handleReport"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/axios'

import Hero     from '@/components/placedetail/Hero.vue'
import Gallery  from '@/components/placedetail/Gallery.vue'
import Overview from '@/components/placedetail/Overview.vue'
import Rooms    from '@/components/placedetail/Rooms.vue'
import Map      from '@/components/placedetail/Map.vue'
import Reviews  from '@/components/placedetail/Reviews.vue'

/** ---------- 라우터 & 상태 ---------- */
const route = useRoute()
const router = useRouter()
const id = route.params.id

const base = ref({})
const building = ref({})
const rooms = ref([])
const reviews = ref([])

// (이미 사용 중인 이벤트 핸들러들을 외부에서 쓰고 있다면 아래 정의 필요)
function onBookRoom(idx){ router.push({ name: 'room-detail', params: { id: String(id), idx: String(idx ?? 0) } }) }
function openReviewModal(){ /* 구현부 */ }
function handleReport(){ /* 구현부 */ }

/** ---------- 유틸 ---------- */
function stripAngle(u){ return String(u||'').replace(/^<|>$/g,'') }
function normalizeBase(b){
  return {
    ...b,
    firstimage: stripAngle(b?.firstimage),
    firstimage2: stripAngle(b?.firstimage2),
  }
}
function toArray(v){ return !v ? [] : (Array.isArray(v) ? v : [v]) }

/** ---------- 데이터 로딩 ---------- */
onMounted(async () => {
  try {
    const [b, d, i, r] = await Promise.allSettled([
      api.get(`/accommodations/${id}`),
      api.get(`/tour/detail/db/content/${id}`),
      api.get(`/tour/intro/db/${id}`),
      api.get(`/api/reviews/hotel/${id}`)
    ])
    if (b.status === 'fulfilled') base.value = normalizeBase(b.value.data)
    if (d.status === 'fulfilled') {
      rooms.value = Array.isArray(d.value.data) ? d.value.data : []
    }
    if (i.status === 'fulfilled') building.value = i.value.data || {}
    if (r.status === 'fulfilled') reviews.value = r.value.data
  } catch (e) {
    console.error('PlaceDetailView fetch error:', e)
  }
})

/** ---------- 네비게이션 ---------- */
function goFirstRoom(){
  if (!rooms.value.length) return
  router.push({ name: 'room-detail', params: { id: String(id), idx: 0 } })
}
function goRoom(idx){
  router.push({ name: 'room-detail', params: { id: String(id), idx: String(idx) } })
}

/** ---------- 최저가 계산 ---------- */
const krw = new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 })
const minPriceText = computed(() => {
  const nums = []
  for (const r of rooms.value) {
    ;['roomoffseasonminfee1','roomoffseasonminfee2','roompeakseasonminfee1','roompeakseasonminfee2']
      .forEach(k => {
        const v = Number(r?.[k])
        if (!Number.isNaN(v) && v > 0) nums.push(v)
      })
  }
  if (nums.length === 0) return ''
  const min = Math.min(...nums)
  return krw.format(min) + ' ~'
})

/** ---------- 갤러리 ---------- */
const gallery = computed(() => {
  const imgs = new Set()
  if (base.value.firstimage) imgs.add(base.value.firstimage)
  if (base.value.firstimage2) imgs.add(base.value.firstimage2)
  rooms.value.forEach(r => [r.roomimg1,r.roomimg2,r.roomimg3,r.roomimg4,r.roomimg5]
    .forEach(u => u && imgs.add(stripAngle(u))))
  const arr = [...imgs]
  if (arr.length === 0) arr.push('https://picsum.photos/1200/700?blur=2')
  while (arr.length < 5) arr.push(arr[0])
  return arr.slice(0,5)
})
</script>

<style scoped>
.detail-page{max-width:1100px;margin:24px auto;padding:0 16px;font-family:"Noto Sans KR",sans-serif}
.loading{text-align:center;padding:64px 0}
</style>
