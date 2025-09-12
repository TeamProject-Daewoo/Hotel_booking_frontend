<template>
  <div class="detail-page" v-if="ready">
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
       @bookRoom="goRoom"
    />
    <Map :mapx="base.mapx" :mapy="base.mapy" :address="base.addr1" ></Map>
    <Reviews       
      :reviews="reviewsFromApi"     
      :pageSize="5"
      @write-review="openReviewModal"
      @report="handleReport"
      @submit-review="handleReviewSubmit"
    />
  </div>

  <div v-else class="loading">불러오는 중...</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/axios';

import Hero     from '@/components/placedetail/Hero.vue';
import Gallery  from '@/components/placedetail/Gallery.vue';
import Overview from '@/components/placedetail/Overview.vue';
import Rooms    from '@/components/placedetail/Rooms.vue';
import Map      from '@/components/placedetail/Map.vue';
import Reviews  from '@/components/placedetail/Reviews.vue';

/** ---------- 라우터 & 상태 ---------- */
const route = useRoute()
const router = useRouter()
const id = route.params.id

const base = ref({})
const building = ref({})
const rooms = ref([])
const ready = ref(false)
const reviews = ref([])


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
    const [b, d, i] = await Promise.allSettled([
      api.get(`/accommodations/${id}`),
      api.get(`/tour/detail/${id}`),
      api.get(`/tour/intro/${id}`)
    ])
    if (b.status === 'fulfilled') base.value = normalizeBase(b.value.data)
    if (d.status === 'fulfilled') rooms.value = toArray(d.value.data?.response?.body?.items?.item)
    if (i.status === 'fulfilled') building.value = i.value.data || {}
  } catch (e) {
    console.error('PlaceDetailView fetch error:', e)
  } finally {
    ready.value = true
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
