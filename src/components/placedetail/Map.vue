<template>
  <section class="map">
    <div class="map-header">
      <h2>지도보기</h2>
      <a v-if="hasCoords" class="gmaps-btn" :href="googleMapsLink" target="_blank" rel="noopener">
        구글 맵 보기
      </a>
    </div>

    <div class="map-frame">
      <iframe
        v-if="hasCoords"
        :src="mapEmbedUrl"
        allowfullscreen
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
      <div v-else class="map-placeholder">좌표 정보가 없습니다.</div>
    </div>

    <!-- ✅ 주소 있을 때만 표시 (좌표 폴백 제거) -->
    <p v-if="displayAddress" class="addr">
      <span><i class="fa-solid fa-location-dot"></i> {{ displayAddress }}</span>
    </p>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import api from '@/api/axios'

const props = defineProps({
  mapx: { type: [Number, String], default: null }, // lon
  mapy: { type: [Number, String], default: null }, // lat
  address: { type: String, default: '' }           // 바로 넘겨주면 역지오코딩 스킵
})

const hasCoords = computed(() =>
  props.mapy !== null && props.mapx !== null && props.mapy !== '' && props.mapx !== ''
)

const mapEmbedUrl = computed(() =>
  `https://www.google.com/maps?q=${props.mapy},${props.mapx}&hl=ko&output=embed`
)
const googleMapsLink = computed(() =>
  `https://www.google.com/maps?q=${props.mapy},${props.mapx}&hl=ko`
)

/* 역지오코딩으로 채울 주소 */
const resolvedAddress = ref('')

/* ✅ 화면에 찍을 주소(있을 때만 노출) */
const displayAddress = computed(() => (props.address || resolvedAddress.value || '').trim())

async function fetchAddress () {
  // address prop이 이미 있으면 역지오코딩 안 함
  if (props.address) return
  if (!hasCoords.value) return
  const lat = Number(props.mapy), lon = Number(props.mapx)
  if (Number.isNaN(lat) || Number.isNaN(lon)) return
  try {
    const { data } = await api.get('/geo/reverse', { params: { lat, lon } })
    resolvedAddress.value = data?.address || ''
  } catch {}
}

/* 좌표가 바뀌면 다시 주소 조회 */
watch([() => props.mapy, () => props.mapx, () => props.address], () => fetchAddress(), { immediate: true })
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
.map-frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
.map-placeholder{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#777;background:repeating-linear-gradient(45deg,#fafafa,#fafafa 10px,#f3f3f3 10px,#f3f3f3 20px)}
.addr{margin-top:10px;font-size:13px;color:#4b5563;display:flex;align-items:center;gap:6px}
.pin{font-size:14px;line-height:1}
@media (max-width:768px){
  .gmaps-btn{padding:9px 12px;font-size:14px}
  .map-header h2{font-size:20px}
}
</style>
