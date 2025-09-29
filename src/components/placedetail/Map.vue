<template>
  <section class="map">
    <div class="map-header">
      <h2>지도보기</h2>
      <a
        v-if="hasCoords"
        class="gmaps-btn"
        :href="kakaoMapLink"
        target="_blank"
        rel="noopener"
      >
        카카오맵 열기
      </a>
    </div>

    <div class="map-frame">
      <div v-if="hasCoords" ref="mapEl" class="kakao-map"></div>
      <div v-else class="map-placeholder">좌표 정보가 없습니다.</div>
    </div>

    <p v-if="displayAddress" class="addr">
      <span><i class="fa-solid fa-location-dot"></i> {{ displayAddress }}</span>
    </p>

    <!-- 리뷰 요약 표시 -->
    <div v-if="reviews.length > 0" class="rating-summary">
      <span class="summary-star">★</span>
      <span class="summary-score">{{ averageRatingText }} / 5</span>
      <span class="summary-count">({{ reviews.length }}명 참여)</span>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import api from '@/api/axios'

onMounted(() => {
  console.log("map.vue props.reviews:", props.reviews)
})

const props = defineProps({
  mapx: { type: [Number, String], default: null },
  mapy: { type: [Number, String], default: null },
  address: { type: String, default: '' },
  title: { type: String, default: '' },
  price: { type: [Number, String], default: '' },
  reviews: { type: Array, default: () => [] }
})

const mapEl = ref(null)
let mapInstance = null
let markerInstance = null
let infoWindow = null

const hasCoords = computed(() =>
  props.mapy !== null && props.mapx !== null && props.mapy !== '' && props.mapx !== ''
)

const resolvedAddress = ref('')
const displayAddress = computed(() => (props.address || resolvedAddress.value || '').trim())
const displayLabelForLink = computed(() => (props.title || displayAddress.value || '').trim())

const kakaoMapLink = computed(() => {
  const lat = Number(props.mapy), lon = Number(props.mapx)
  const label = displayLabelForLink.value.replaceAll(',', ' ')
  return `https://map.kakao.com/link/map/${encodeURIComponent(label)},${lat},${lon}`
})

const KAKAO_APPKEY = import.meta.env.VITE_KAKAO_MAP_APPKEY
let kakaoSdkPromise
function loadKakaoSdk () {
  if (window.kakao && window.kakao.maps) return Promise.resolve()
  if (!kakaoSdkPromise) {
    kakaoSdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APPKEY}&autoload=false`
      script.async = true
      script.onload = () => window.kakao.maps.load(() => resolve())
      script.onerror = reject
      document.head.appendChild(script)
    })
  }
  return kakaoSdkPromise
}

/** 평균 리뷰 점수 계산 */
const averageRating = computed(() => {
  if (!props.reviews || props.reviews.length === 0) return 0
  return props.reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0) / props.reviews.length
})
const averageRatingText = computed(() => averageRating.value.toFixed(1))

/** 지도 초기화 / 업데이트 */
async function initMap () {
  if (!hasCoords.value || !mapEl.value) return
  const lat = Number(props.mapy), lon = Number(props.mapx)
  if (Number.isNaN(lat) || Number.isNaN(lon)) return

  await loadKakaoSdk()
  const center = new window.kakao.maps.LatLng(lat, lon)

  if (!mapInstance) {
    mapInstance = new window.kakao.maps.Map(mapEl.value, { center, level: 3 })
    const zoomControl = new window.kakao.maps.ZoomControl()
    mapInstance.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT)

    markerInstance = new window.kakao.maps.Marker({ position: center, map: mapInstance })
    infoWindow = new window.kakao.maps.InfoWindow({ removable: false })
  } else {
    mapInstance.setCenter(center)
    markerInstance.setPosition(center)
  }

  updateInfoWindow(center)
}

/** 인포윈도우 내용 구성 */
function updateInfoWindow(centerLatLng){
  if(!infoWindow || !markerInstance) return
  const name = escapeHtml(props.title || '호텔명 없음')
  const price = String(props.price || '가격 없음').trim()
  const addr = escapeHtml(displayAddress.value || '주소 없음')

  const ratingHtml = `<div style="display:flex;align-items:center;gap:4px;font-size:12px;margin-bottom:4px;">
         <span style="color:#f59e0b;">★</span>
         <span style="font-weight:700;">${averageRatingText.value} / 5</span>
         <span style="color:#6b7280;">(${props.reviews.length}명 참여)</span>
       </div>`

  const rows = [
    `<div style="font-weight:700;font-size:13px;line-height:1.4;margin-bottom:4px;">${name}</div>`,
    `<div style="font-size:12px;line-height:1.4;color:#0ea35a;margin-bottom:4px;">${price}</div>`,
    ratingHtml,
    `<div style="font-size:12px;line-height:1.4;color:#4b5563;white-space:normal;word-break:break-word;max-width:240px;">${addr}</div>`
  ].join('')

  infoWindow.setContent(`
    <div style="
      padding:8px 10px;background:#fff;border:1px solid #e5e7eb;border-radius:6px;
      box-shadow:0 2px 8px rgba(0,0,0,.12);max-width:260px;">
      ${rows}
    </div>
  `)
  infoWindow.open(mapInstance, markerInstance)
}

/** 주소 표시 (역지오코딩) */
async function fetchAddress () {
  if (props.address) return
  if (!hasCoords.value) return
  const lat = Number(props.mapy), lon = Number(props.mapx)
  if (Number.isNaN(lat) || Number.isNaN(lon)) return
  try {
    const { data } = await api.get('/geo/reverse', { params: { lat, lon } })
    resolvedAddress.value = data?.address || ''
  } catch {}
}

/** HTML 안전 이스케이프 */
function escapeHtml (s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

/** 라이프사이클 */
onMounted(async () => {
  await fetchAddress()
  await initMap()
})

// 좌표 변경 시 지도 갱신
watch([() => props.mapy, () => props.mapx], async () => {
  await fetchAddress()
  await initMap()
})

// 리뷰 데이터 변경 시 지도와 인포윈도우 갱신
watch(() => props.reviews, async () => {
  if(markerInstance && infoWindow) updateInfoWindow(markerInstance.getPosition())
}, { deep: true })

onBeforeUnmount(() => {
  mapInstance = null
  markerInstance = null
  infoWindow = null
})
</script>

<style scoped>
.map{margin-top:24px}
.map-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.map-header h2{font-size:22px;font-weight:800;letter-spacing:-0.2px}
.gmaps-btn{transition:.2s;display:inline-flex;align-items:center;gap:8px;padding:10px 14px;border-radius:10px;background:#1bb56b;color:#fff;font-weight:600;text-decoration:none;box-shadow:0 1px 0 rgba(0,0,0,.05)}
.gmaps-btn:hover{filter:brightness(.95);transform:translateY(-1px)}
.gmaps-btn:active{transform:translateY(1px)}
.map-frame{border-radius:12px;overflow:hidden;box-shadow:0 1px 0 rgba(0,0,0,.04);border:1px solid #e9ecef;position:relative;background:#f8f9fa}
.map-frame::before{content:"";display:block;padding-top:43%}
.kakao-map{position:absolute;inset:0;width:100%;height:100%}
.map-placeholder{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#777;background:repeating-linear-gradient(45deg,#fafafa,#fafafa 10px,#f3f3f3 10px,#f3f3f3 20px)}
.addr{margin-top:10px;font-size:13px;color:#4b5563}

/* 리뷰 요약 */
.rating-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 1rem 0;
}
.summary-star { font-size: 1.5rem; color: #2ecc9a; }
.summary-score { font-size: 1.1rem; font-weight: 700; }
.summary-count { font-size: 0.9rem; color: #6b7280; }

@media (max-width:768px){
  .gmaps-btn{padding:9px 12px;font-size:14px}
  .map-header h2{font-size:20px}
}
</style>
