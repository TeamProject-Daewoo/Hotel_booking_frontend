<template>
  <div v-if="isLoading" class="loading">
    <p>숙소 정보를 불러오는 중입니다...</p>
  </div>
  <div v-else-if="base.contentid" class="detail-page">
    <Hero
        :rooms="rooms"
        :base="base"
        :building="building"
        :hasRooms="rooms.length > 0"
        @book="goFirstRoom"
    />
    <Gallery :images="gallery" />
    <Overview :rooms="rooms" :base="base" :building="building" />
    <DateRangePicker 
      v-model:checkIn="localCheckIn" 
      v-model:checkOut="localCheckOut"
      :building="building"
    />
    <Rooms
        :rooms="rooms"
        :fallback-images="[base.firstimage, base.firstimage2]"
        :availability="processedAvailability"
        :checkIn="localCheckIn" 
        :checkOut="localCheckOut"
        @bookRoom="onBookRoom"
    />
    <Map :mapx="base.mapx" :mapy="base.mapy" :address="base.addr1" :title="base.title" :price="minPriceText" />
    <Reviews :reviews="reviews" :pageSize="5" @write-review="openReviewModal" @report="handleReport" />
  </div>
  <div v-else class="loading">
    <p>숙소 정보를 찾을 수 없습니다.</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/axios'
import { useSearchStore } from '@/api/searchRequestStore' // Pinia 스토어 임포트

import Hero     from '@/components/placedetail/Hero.vue'
import Gallery  from '@/components/placedetail/Gallery.vue'
import Overview from '@/components/placedetail/Overview.vue'
import Rooms    from '@/components/placedetail/Rooms.vue'
import Map      from '@/components/placedetail/Map.vue'
import Reviews  from '@/components/placedetail/Reviews.vue'
import DateRangePicker from '@/components/placedetail/DateRangePicker.vue';
import { useHistoryStore } from '@/store/recentHistoryStore'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const searchStore = useSearchStore() // Pinia 스토어 사용

const base = ref({})
const building = ref({})
const rooms = ref([])
const reviews = ref([])
const availabilityData = ref({})
const isLoading = ref(true);

console.log(id);


function onBookRoom(idx){ router.push({ 
  name: 'room-detail', 
  params: { id: String(id), idx: String(idx ?? 0) },
  query: {
      checkIn: localCheckIn.value,
      checkOut: localCheckOut.value,
      totalPrice: idx.price
    }
}) }
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

const localCheckIn = ref(searchStore.checkInDateISO);
const localCheckOut = ref(searchStore.checkOutDateISO);

// 1. 페이지 최초 로딩 시 한 번만 호출할 함수 (날짜와 무관한 정보)
async function fetchStaticDetails() {
  try {
    const [baseRes, introRes, reviewsRes] = await Promise.all([
      api.get(`/accommodations/${id}`),
      api.get(`/tour/intro/db/${id}`),
      api.get(`/api/reviews/hotel/${id}`)
    ]);
    base.value = normalizeBase(baseRes.data);
    building.value = introRes.data || {};
    reviews.value = reviewsRes.data;
    // ** 방문 히스토리 추가 **
    const historyStore = useHistoryStore();
    historyStore.addViewHistory(baseRes.data);
  } catch (e) {
    console.error('숙소 기본 정보 조회 실패:', e);
  }
}

// 2. 객실 잔여 수량
async function fetchAvailability(checkIn, checkOut) {
  try {
    const response = await api.post('/api/reservations/availability', {
      contentId: id,
      startDate: checkIn,
      endDate: checkOut
    });
    availabilityData.value = response.data.availability || {};
  } catch (error) {
    console.error("객실 잔여 수량 조회 실패:", error);
    availabilityData.value = {};
  }
}

async function fetchDynamicDetails(checkIn, checkOut) {
  if (!checkIn || !checkOut) return;
  try {
    // 객실 정보와 가격을 새로운 날짜 기준으로 다시 조회
    const roomsRes = await api.get(`/tour/detail/db/content/${id}`, {
      params: { checkIn, checkOut }
    });
    rooms.value = Array.isArray(roomsRes.data) ? roomsRes.data : [];

    // (선택) 객실 잔여 수량도 다시 조회
    await fetchAvailability(checkIn, checkOut);

  } catch (e) {
    console.error('객실 동적 정보 조회 실패:', e);
  }
}

onMounted(async () => {
  isLoading.value = true;
  // 두 종류의 데이터를 병렬로 함께 호출
  await Promise.all([
    fetchStaticDetails(),
    fetchDynamicDetails(localCheckIn.value, localCheckOut.value)
  ]);
  isLoading.value = false;
});

// 날짜가 변경될 때마다 객실 정보만 다시 조회
watch([localCheckIn, localCheckOut], (newDates) => {
  const [newCheckIn, newCheckOut] = newDates;
  fetchDynamicDetails(newCheckIn, newCheckOut);
});

function goFirstRoom(){
  if (!rooms.value.length) return
  router.push({ name: 'room-detail', params: { id: String(id), idx: 0 } })
}

const krw = new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 })
const minPriceText = computed(() => {
  if (!rooms.value || rooms.value.length === 0) return '';

  // 백엔드에서 계산해 준 finalPrice들만 모아서 최소값을 찾음
  const prices = rooms.value
    .map(r => r.finalPrice)
    .filter(p => p != null && p > 0);

  if (prices.length === 0) return '가격 문의';
  
  const min = Math.min(...prices);
  return krw.format(min) + ' ~'; // "₩1,234,567 ~" 형태로 표시
});

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