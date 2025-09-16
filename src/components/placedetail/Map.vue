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

    <!-- 주소가 있으면 하단에 보조 텍스트 -->
    <p v-if="displayAddress" class="addr">
      <span><i class="fa-solid fa-location-dot"></i> {{ displayAddress }}</span>
    </p>
  </section>
</template>

<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import api from '@/api/axios'

/** ====== Props ====== */
const props = defineProps({
  mapx: { type: [Number, String], default: null }, // lon
  mapy: { type: [Number, String], default: null }, // lat
  address: { type: String, default: '' },          // 주소(옵션)
  title:   { type: String, default: '' },          // 호텔명
  price:   { type: [Number, String], default: '' } // 가격 텍스트 (예: "₩120,000 ~")
})

/** ====== 상태 ====== */
const mapEl = ref(null)
let mapInstance = null
let markerInstance = null
let infoWindow = null

const hasCoords = computed(() =>
  props.mapy !== null && props.mapx !== null && props.mapy !== '' && props.mapx !== ''
)

// 링크 라벨: 호텔명이 우선, 없으면 주소
const resolvedAddress = ref('')
const displayAddress = computed(() => (props.address || resolvedAddress.value || '').trim())
const displayLabelForLink = computed(() => (props.title || displayAddress.value || '').trim())

/** 외부 링크 (카카오맵) */
const kakaoMapLink = computed(() => {
  const lat = Number(props.mapy), lon = Number(props.mapx)
  const label = displayLabelForLink.value.replaceAll(',', ' ')
  return `https://map.kakao.com/link/map/${encodeURIComponent(label)},${lat},${lon}`
})

/** 카카오 SDK 로더 (한 번만 로드) */
const KAKAO_APPKEY = import.meta.env.VITE_KAKAO_MAP_APPKEY
let kakaoSdkPromise
function loadKakaoSdk () {
  if (window.kakao && window.kakao.maps) return Promise.resolve()
  if (!kakaoSdkPromise) {
    kakaoSdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APPKEY}&autoload=false`
      script.async = true
      script.onload = () => {
        window.kakao.maps.load(() => resolve())
      }
      script.onerror = reject
      document.head.appendChild(script)
    })
  }
  return kakaoSdkPromise
}

/** 지도 초기화 / 업데이트 */
async function initMap () {
  if (!hasCoords.value || !mapEl.value) return
  const lat = Number(props.mapy), lon = Number(props.mapx)
  if (Number.isNaN(lat) || Number.isNaN(lon)) return

  await loadKakaoSdk()
  const center = new window.kakao.maps.LatLng(lat, lon)

  if (!mapInstance) {
    mapInstance = new window.kakao.maps.Map(mapEl.value, {
      center,
      level: 3
    })

    const zoomControl = new window.kakao.maps.ZoomControl()
    mapInstance.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT)

    markerInstance = new window.kakao.maps.Marker({
      position: center,
      map: mapInstance
    })

    infoWindow = new window.kakao.maps.InfoWindow({ removable: false })
    updateInfoWindow(center)
  } else {
    mapInstance.setCenter(center)
    markerInstance.setPosition(center)
    updateInfoWindow(center)
  }
}

/** 인포윈도우 내용 구성: 호텔명 + 가격 + 주소(옵션) */
function updateInfoWindow(centerLatLng){
  const name = escapeHtml(props.title || '')
  const price = String(props.price || '').trim()
  const addr = escapeHtml(displayAddress.value || '')

  const rows = [
    name ? `<div style="font-weight:700;font-size:13px;line-height:1.4;margin-bottom:4px;">${name}</div>` : '',
    price ? `<div style="font-size:12px;line-height:1.4;color:#0ea35a;margin-bottom:4px;">${escapeHtml(price)}</div>` : '',
    addr ? `<div style="font-size:12px;line-height:1.4;color:#4b5563;white-space:normal;word-break:break-word;max-width:240px;">${addr}</div>` : ''
  ].filter(Boolean).join('')

  if (!rows) { infoWindow.close(); return }

  infoWindow.setContent(`
    <div style="
      padding:8px 10px;background:#fff;border:1px solid #e5e7eb;border-radius:6px;
      box-shadow:0 2px 8px rgba(0,0,0,.12);max-width:260px;">
      ${rows}
    </div>
  `)
  infoWindow.open(mapInstance, markerInstance)
}

/** 주소 표시 로직 (역지오코딩은 기존 API 활용) */
async function fetchAddress () {
  if (props.address) return
  if (!hasCoords.value) return
  const lat = Number(props.mapy), lon = Number(props.mapx)
  if (Number.isNaN(lat) || Number.isNaN(lon)) return
  try {
    const { data } = await api.get('/geo/reverse', { params: { lat, lon } })
    resolvedAddress.value = data?.address || ''
  } catch {
    // 실패해도 조용히 무시
  }
}

/** 안전한 HTML 이스케이프 */
function escapeHtml (s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

/** 라이프사이클 & 반응 처리 */
onMounted(async () => {
  await fetchAddress()
  await initMap()
})

watch([() => props.mapy, () => props.mapx], async () => {
  await fetchAddress()
  await initMap()
})

watch(displayAddress, async () => {
  await initMap()
})

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
.addr{margin-top:10px;font-size:13px;color:#4b5563;display:flex;align-items:center;gap:6px}
.pin{font-size:14px;line-height:1}
@media (max-width:768px){
  .gmaps-btn{padding:9px 12px;font-size:14px}
  .map-header h2{font-size:20px}
}
</style>
