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
        :availability="processedAvailability"
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
import { useSearchStore } from '@/api/searchRequestStore' // Pinia 스토어 임포트

import Hero     from '@/components/placedetail/Hero.vue'
import Gallery  from '@/components/placedetail/Gallery.vue'
import Overview from '@/components/placedetail/Overview.vue'
import Rooms    from '@/components/placedetail/Rooms.vue'
import Map      from '@/components/placedetail/Map.vue'
import Reviews  from '@/components/placedetail/Reviews.vue'
import { useHistoryStore } from '@/store/recentHistoryStore'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const searchStore = useSearchStore() // Pinia 스토어 사용
const historyStore = useHistoryStore();

const base = ref({})
const building = ref({})
const rooms = ref([])
const reviews = ref([])
const availabilityData = ref({})

// Date 객체를 YYYY-MM-DD 형식의 문자열로 변환하는 함수
const toISO = (date) => date.toISOString().slice(0, 10);

// 스토어에서 날짜 정보를 가져옴
const startDate = computed(() => toISO(searchStore.checkInDate));
const endDate = computed(() => toISO(searchStore.checkOutDate));

const formattedDateRange = computed(() => {
  return `${startDate.value} ~ ${endDate.value}`;
});

function onBookRoom(idx){ router.push({ name: 'room-detail', params: { id: String(id), idx: String(idx ?? 0) } }) }
function openReviewModal(){ /* 구현부 */ }
function handleReport(){ /* 구현부 */ }

function stripAngle(u){ return String(u||'').replace(/^<|>$/g,'') }
function normalizeBase(b){
  return {
    ...b,
    firstimage: stripAngle(b?.firstimage),
    firstimage2: stripAngle(b?.firstimage2),
  }
}

async function fetchAvailability() {
  if (!id) return;
  try {
    const response = await api.post('/api/reservations/availability', {
      contentId: id,
      startDate: startDate.value, // 스토어의 날짜 사용
      endDate: endDate.value      // 스토어의 날짜 사용
    });
    availabilityData.value = response.data.availability;
  } catch (error) {
    console.error("객실 잔여 수량 조회 실패:", error);
    availabilityData.value = {};
  }
}

const processedAvailability = computed(() => {
  const result = {};
  if (!rooms.value.length || !Object.keys(availabilityData.value).length) {
    return result;
  }

  rooms.value.forEach(room => {
    let minCount = Infinity;
    for (const date in availabilityData.value) {
      const dailyAvail = availabilityData.value[date];
      if (dailyAvail && dailyAvail[room.id] !== undefined) {
        minCount = Math.min(minCount, dailyAvail[room.id]);
      }
    }
    result[room.id] = minCount === Infinity ? null : minCount;
  });
  return result;
});

onMounted(async () => {
  //메인에서 상세 이동 시 스크롤 위로
  if (route.query.from === 'main') {
    window.scrollTo({top: 0, behavior: 'smooth'});
     const newQuery = { ...route.query };
    delete newQuery.from;
    router.replace({ query: newQuery }); 
  }
  try {
    const [b, d, i, r] = await Promise.allSettled([
      api.get(`/accommodations/${id}`),
      api.get(`/tour/detail/db/content/${id}`),
      api.get(`/tour/intro/db/${id}`),
      api.get(`/api/reviews/hotel/${id}`)
    ])
    if (b.status === 'fulfilled') {
      base.value = normalizeBase(b.value.data)
      //방문 목록에 추가
      historyStore.addViewHistory(b.value.data);
      // console.log(historyStore.recentlyViewed)
    }
    if (d.status === 'fulfilled') {
      rooms.value = Array.isArray(d.value.data) ? d.value.data : []
    }
    if (i.status === 'fulfilled') building.value = i.value.data || {}
    if (r.status === 'fulfilled') reviews.value = r.value.data

    await fetchAvailability();

  } catch (e) {
    console.error('PlaceDetailView fetch error:', e)
  }
})

function goFirstRoom(){
  if (!rooms.value.length) return
  router.push({ name: 'room-detail', params: { id: String(id), idx: 0 } })
}

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

.info-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 14px;
  padding: 16px;
  margin: 24px 0;
  text-align: center;
}
.info-card h2 {
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 8px;
}
.info-card p {
  font-size: 16px;
  font-weight: 500;
  color: #2b7264;
  margin: 0 0 4px 0;
}
.info-card span {
  font-size: 12px;
  color: #6c757d;
}
</style>