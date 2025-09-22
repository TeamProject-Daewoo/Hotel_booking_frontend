<template>
  <div v-if="isLoading" class="loading-container">
    <div class="spinner"></div>
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
    <DateRangePicker
        v-model:checkIn="localCheckIn"
        v-model:checkOut="localCheckOut"
        :building="building"
    />
    <Overview :rooms="rooms" :base="base" :building="building" />
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
  <div v-else class="loading-container">
    <p>숙소 정보를 찾을 수 없습니다.</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/axios'
import { useSearchStore } from '@/api/searchRequestStore'
import { useHistoryStore } from '@/store/recentHistoryStore'

import Hero     from '@/components/placedetail/Hero.vue'
import Gallery  from '@/components/placedetail/Gallery.vue'
import Overview from '@/components/placedetail/Overview.vue'
import Rooms    from '@/components/placedetail/Rooms.vue'
import Map      from '@/components/placedetail/Map.vue'
import Reviews  from '@/components/placedetail/Reviews.vue'
import DateRangePicker from '@/components/placedetail/DateRangePicker.vue';

const route = useRoute()
const router = useRouter()
const id = route.params.id
const searchStore = useSearchStore()

const base = ref({})
const building = ref({})
const rooms = ref([])
const reviews = ref([])
const availabilityData = ref({})
const isLoading = ref(true);

function onBookRoom(roomInfo){
  router.push({
    name: 'room-detail',
    params: { id: String(id), idx: String(roomInfo.idx) },
    query: {
      checkIn: localCheckIn.value,
      checkOut: localCheckOut.value,
      totalPrice: roomInfo.price
    }
  })
}
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
      if (dailyAvail && dailyAvail[String(room.id)] !== undefined) {
        minCount = Math.min(minCount, dailyAvail[String(room.id)]);
      }
    }
    result[String(room.id)] = minCount === Infinity ? null : minCount;
  });
  return result;
});

const localCheckIn = ref(searchStore.checkInDateISO);
const localCheckOut = ref(searchStore.checkOutDateISO);

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
    const historyStore = useHistoryStore();
    historyStore.addViewHistory(baseRes.data);
  } catch (e) {
    console.error('숙소 기본 정보 조회 실패:', e);
  }
}

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
    const roomsRes = await api.get(`/tour/detail/db/content/${id}`, {
      params: { checkIn, checkOut }
    });
    rooms.value = Array.isArray(roomsRes.data) ? roomsRes.data : [];
    await fetchAvailability(checkIn, checkOut);
  } catch (e) {
    console.error('객실 동적 정보 조회 실패:', e);
  }
}

onMounted(async () => {
  isLoading.value = true;
  await Promise.all([
    fetchStaticDetails(),
    fetchDynamicDetails(localCheckIn.value, localCheckOut.value)
  ]);
  isLoading.value = false;
});

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
  const prices = rooms.value
      .map(r => r.finalPrice)
      .filter(p => p != null && p > 0);
  if (prices.length === 0) return '가격 문의';
  const min = Math.min(...prices);
  return krw.format(min) + ' ~';
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

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  color: #6b7280;
}
.spinner {
  width: 48px;
  height: 48px;
  border: 5px solid #f3f4f6;
  border-bottom-color: #4f46e5;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
  margin-bottom: 16px;
}
@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.loading-container p {
  font-size: 1rem;
  font-weight: 500;
}
</style>