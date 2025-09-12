<template>
  <section class="overview">
    <h2>숙소 개요</h2>
    <ul class="facts facts-grid" role="list" aria-label="숙소 정보">
      <li class="fact-card">
        <b>객실 수</b>
        <span>{{ roomUnits ?? '-' }}</span>
      </li>
      <li class="fact-card">
        <b>객실 타입</b>
        <span>{{ building.roomtype || '-' }}</span>
      </li>
      <li class="fact-card">
        <b>규모</b>
        <span>{{ scaleText }}</span>
      </li>
      <li class="fact-card">
        <b>주차</b>
        <span>{{ building.parkinglodging || '-' }}</span>
      </li>
      <li class="fact-card">
        <b>문의</b>
        <span>{{ contact }}</span>
      </li>
    </ul>

    <!-- 부대시설: 값이 있을 때 카드로 표시 -->
    <div v-if="building.subfacility" class="fact-row">
      <b>부대시설</b>
      <div class="fact-cards">
        <div v-for="(facility, index) in building.subfacility?.split(',')" :key="index" class="fact-card">
          <i class="fa-solid fa-cogs"></i>  <!-- 예시 아이콘 -->
          <span>{{ facility.trim() }}</span>
        </div>
      </div>
    </div>

    <!-- 식사 장소: 값이 있을 때 카드로 표시 -->
    <div v-if="building.foodplace" class="fact-row">
      <b>식사 장소</b>
      <div class="fact-cards">
        <div v-for="(place, index) in building.foodplace?.split(',')" :key="index" class="fact-card">
          <i class="fa-solid fa-utensils"></i> <!-- 예시 아이콘 -->
          <span>{{ place.trim() }}</span>
        </div>
      </div>
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

const toNum = v => {
  const n = Number(String(v ?? '').replace(/[^\d.]/g, ''))
  return Number.isFinite(n) ? n : null
}

const roomUnits = computed(() => {
  const counts = props.rooms
    .map(r => toNum(r.roomcount))
    .filter(n => n !== null)
  if (counts.length) return counts.reduce((a, b) => a + b, 0)
  return props.rooms.length || null
})

const areaRange = computed(() => {
  const arr = props.rooms
    .map(r => toNum(r.roomsize2) ?? toNum(r.roomsize1))
    .filter(n => n !== null)
  if (!arr.length) return null
  const min = Math.min(...arr)
  const max = Math.max(...arr)
  return min === max ? `${min}㎡` : `${min}–${max}㎡`
})

const baseTotal = computed(() => {
  const arr = props.rooms.map(r => toNum(r.roombasecount)).filter(n => n !== null)
  return arr.length ? arr.reduce((a, b) => a + b, 0) : null
})
const maxTotal = computed(() => {
  const arr = props.rooms.map(r => toNum(r.roommaxcount)).filter(n => n !== null)
  return arr.length ? arr.reduce((a, b) => a + b, 0) : null
})

const scaleText = computed(() => {
  const parts = []
  if (areaRange.value) parts.push(areaRange.value)
  if (baseTotal.value !== null && maxTotal.value !== null) {
    parts.push(`기준 ${baseTotal.value}명 / 최대 ${maxTotal.value}명`)
  }
  return parts.length ? parts.join(' · ') : (props.building.scalelodging || '-')
})

const contact = computed(() =>
  props.building.infocenterlodging || props.base.tel || '-'
)
</script>

<style scoped>
.overview h2 {
  margin: 16px 0 12px;
  font-size: 22px;
  font-weight: 700;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 8px;
}

.facts-grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.fact-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 14px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 56px;
  color: #444;
}

.fact-card b {
  color: #2b7264;
  font-weight: 700;
  white-space: nowrap;
  min-width: 80px;
}

.fact-card span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fact-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.10), 0 2px 8px rgba(0, 0, 0, 0.06);
}

.fact-row {
  color: #2b7264;
  margin-top: 16px;
  margin-bottom: 10px;
}

.fact-cards {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.fact-cards .fact-card {
  flex: 1 0 100px;
  margin-bottom: 10px;
}

.fact-cards i {
  font-size: 18px;
  color: #2b7264;
  margin-right: 8px;
}

@media (max-width: 900px) {
  .facts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .facts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
