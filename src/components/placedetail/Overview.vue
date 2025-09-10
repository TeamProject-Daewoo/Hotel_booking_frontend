<template>
  <section class="overview">
    <h2>숙소 개요</h2>
    <ul class="facts">
      <li><b>객실 수 : </b> {{ roomUnits ?? '-' }}</li>
      <li><b>객실 타입 : </b> {{ building.roomtype || '-' }}</li>
      <li><b>규모 : </b> {{ scaleText }}</li>
      <li><b>주차 : </b> {{ building.parkinglodging || '-' }}</li>
      <li><b>문의 : </b> {{ contact }}</li>
    </ul>

    <div class="chips" v-if="subfacilities.length">
      <span v-for="(s,idx) in subfacilities" :key="idx" class="chip">{{ s }}</span>
    </div>

    <div class="chips gray" v-if="foodplaces.length">
      <span v-for="(s,idx) in foodplaces" :key="idx" class="chip">{{ s }}</span>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  rooms: { type: Array, default: () => [] },
  base: { type: Object, required: true },
  building: { type: Object, required: true }
})

// 숫자 파싱 유틸(문자/공백 섞여도 안전)
const toNum = v => {
  const n = Number(String(v ?? '').replace(/[^\d.]/g, ''))
  return Number.isFinite(n) ? n : null
}

// 객실 수: roomcount 합계(없으면 rooms.length)
const roomUnits = computed(() => {
  const counts = props.rooms
    .map(r => toNum(r.roomcount))
    .filter(n => n !== null)
  if (counts.length) return counts.reduce((a, b) => a + b, 0)
  return props.rooms.length || null
})

// 면적(㎡) 범위: roomsize2 우선, 없으면 roomsize1
const areaRange = computed(() => {
  const arr = props.rooms
    .map(r => toNum(r.roomsize2) ?? toNum(r.roomsize1))
    .filter(n => n !== null)
  if (!arr.length) return null
  const min = Math.min(...arr)
  const max = Math.max(...arr)
  return min === max ? `${min}㎡` : `${min}–${max}㎡`
})

// 인원 합계(기준/최대)
const baseTotal = computed(() => {
  const arr = props.rooms.map(r => toNum(r.roombasecount)).filter(n => n !== null)
  return arr.length ? arr.reduce((a, b) => a + b, 0) : null
})
const maxTotal = computed(() => {
  const arr = props.rooms.map(r => toNum(r.roommaxcount)).filter(n => n !== null)
  return arr.length ? arr.reduce((a, b) => a + b, 0) : null
})

// 규모 텍스트 조합(면적 · 기준/최대 인원). 없으면 기존 값/대시.
const scaleText = computed(() => {
  const parts = []
  if (areaRange.value) parts.push(areaRange.value)
  if (baseTotal.value !== null && maxTotal.value !== null) {
    parts.push(`기준 ${baseTotal.value}명 / 최대 ${maxTotal.value}명`)
  }
  return parts.length ? parts.join(' · ') : (props.building.scalelodging || '-')
})

// 기타 표시값
const contact = computed(() =>
  props.building.infocenterlodging || props.base.tel || '-'
)

// 칩 데이터
const subfacilities = computed(() =>
  String(props.building.subfacility || '')
    .split(/[,，]/).map(s => s.trim()).filter(Boolean)
)
const foodplaces = computed(() =>
  String(props.building.foodplace || '')
    .split(/[,，]/).map(s => s.trim()).filter(Boolean)
)
</script>

<style scoped>
.overview h2{margin:16px 0 8px;font-size:20px}
.facts{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(2,1fr);gap:8px;color:#444}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.chip{background:#eaf8f2;border-radius:999px;padding:6px 12px;font-size:13px}
.chips.gray .chip{background:#f5f5f5}
@media(max-width:900px){ .facts{grid-template-columns:1fr} }
</style>
