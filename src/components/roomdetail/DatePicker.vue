<template>
  <section class="card">
    <div class="sec-title">
      <i class="fa-regular fa-calendar"></i> 날짜 선택
    </div>

    <div class="dates">
      <!-- Check-in block -->
      <button class="date-block" @click="open('in')" :aria-expanded="openFor==='in'">
        <div class="date-top">{{ label(checkIn) }}</div>
        <div class="date-sub">Check-in</div>
        <div v-if="building?.checkintime" class="hint">입실 {{ building.checkintime }}</div>
      </button>

      <div class="date-icon">
        <div class="line"></div>
        <i class="fa-solid fa-city"></i>
        <div class="line"></div>
      </div>

      <!-- Check-out block -->
      <button class="date-block" @click="open('out')" :aria-expanded="openFor==='out'">
        <div class="date-top">{{ label(checkOut) }}</div>
        <div class="date-sub">Check-out</div>
        <div v-if="building?.checkouttime" class="hint">퇴실 {{ building.checkouttime }}</div>
      </button>

      <div class="nights" v-if="nights > 0">
        <i class="fa-regular fa-moon"></i> {{ nights }}박
      </div>
    </div>

    <!-- Popup Calendar -->
    <div v-if="openFor" class="overlay" @click.self="close">
      <div class="picker" role="dialog" aria-modal="true">
        <div class="toolbar">
          <button class="nav" @click="go(-1)" aria-label="이전 달">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <div class="title">{{ visibleMonthLabel }}</div>
          <button class="nav" @click="go(1)" aria-label="다음 달">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>

        <div class="weekdays">
          <span v-for="w in ['일','월','화','수','목','금','토']" :key="w">{{ w }}</span>
        </div>

        <div class="grid">
          <button
            v-for="cell in cells"
            :key="cell.key"
            class="cell"
            :class="{
              'is-other': cell.isOtherMonth,
              'is-disabled': cell.disabled,
              'is-in-range': cell.inRange,
              'is-checkin': isSameISO(cell.iso, checkIn),
              'is-checkout': isSameISO(cell.iso, checkOut),
            }"
            :disabled="cell.disabled"
            @click="pick(cell.iso)"
          >
            <span>{{ cell.d }}</span>
          </button>
        </div>

        <div class="actions">
          <button class="btn ghost" @click="close">닫기</button>
          <button class="btn solid" @click="apply" :disabled="!pendingValid">적용</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

/* ---------- props & emit ---------- */
const props = defineProps({
  checkIn:  { type: String, required: true },   // YYYY-MM-DD
  checkOut: { type: String, required: true },   // YYYY-MM-DD
  building: { type: Object, default: () => ({}) },
  minNights:{ type: Number, default: 1 },
  maxNights:{ type: Number, default: 30 },
  locale:   { type: String, default: 'ko-KR' },
  minDate:  { type: String, default: undefined }, // 없으면 오늘
})
const emit = defineEmits(['update:checkIn', 'update:checkOut'])

/* ---------- date helpers (UTC 고정) ---------- */
const MS_DAY = 86400000
function parseYMD(iso) {
  const [y, m, d] = (iso||'').split('-').map(Number)
  return new Date(Date.UTC(y||1970, (m||1)-1, d||1))
}
function toISO(d){ return new Date(d).toISOString().slice(0,10) }
function addDaysUTC(d, n){ const x = new Date(d); x.setUTCDate(x.getUTCDate()+n); return x }
function todayISO(){
  const n = new Date(); return toISO(new Date(Date.UTC(n.getFullYear(),n.getMonth(),n.getDate())))
}
function formatLabel(iso, locale){
  return new Date(iso+'T00:00:00').toLocaleDateString(locale, { weekday:'long', month:'short', day:'numeric' })
}
function isSameISO(a,b){ return String(a)===String(b) }

/* ---------- controlled state ---------- */
const minDateResolved = computed(()=> props.minDate ?? todayISO())

/* ---------- view model ---------- */
const openFor = ref(null)        // 'in' | 'out' | null
const viewMonth = ref(parseYMD(props.checkIn || minDateResolved.value)) // 보이는 달(1일로 기준)
viewMonth.value.setUTCDate(1)

const label = (iso)=> formatLabel(iso, props.locale)

const nights = computed(()=>{
  const s = parseYMD(props.checkIn), e = parseYMD(props.checkOut)
  const diff = Math.round((e - s)/MS_DAY); return diff>0?diff:0
})

/* ---------- popup calendar data ---------- */
const visibleMonthLabel = computed(()=>{
  return viewMonth.value.toLocaleDateString('ko-KR', { year:'numeric', month:'long' })
})

const cells = computed(()=>{
  // 달력 6*7 = 42 셀
  const first = new Date(viewMonth.value) // UTC 1일
  const startWeekday = first.getUTCDay()
  const start = addDaysUTC(first, -startWeekday) // 달력 시작 셀(일요일)
  const list = []

  const sIn  = parseYMD(props.checkIn)
  const sOut = parseYMD(props.checkOut)

  const minIn = parseYMD(minDateResolved.value)
  const maxSpan = props.maxNights

  for(let i=0;i<42;i++){
    const d = addDaysUTC(start, i)
    const iso = toISO(d)
    const isOtherMonth = d.getUTCMonth() !== first.getUTCMonth()
    // 비활성 규칙: 과거(체크인 기준)
    let disabled = d < minIn
    // 범위 하이라이트
    const inRange = (sIn && sOut) ? (d > sIn && d < sOut) : false

    list.push({
      key: iso,
      iso,
      d: d.getUTCDate(),
      isOtherMonth,
      disabled,
      inRange,
    })
  }

  // openFor가 'out'이면 최소 체크아웃일 적용
  if (openFor.value === 'out' && props.checkIn) {
    const minOut = addDaysUTC(parseYMD(props.checkIn), Math.max(props.minNights,1))
    const maxOut = addDaysUTC(parseYMD(props.checkIn), Math.max(props.maxNights,1))
    for(const c of list){
      const t = parseYMD(c.iso)
      if (t < minOut || t > maxOut) c.disabled = true
    }
  }
  return list
})

function go(delta){
  const d = new Date(viewMonth.value)
  d.setUTCMonth(d.getUTCMonth()+delta, 1)
  viewMonth.value = d
}

/* ---------- pick & apply ---------- */
const pendingIn  = ref(props.checkIn)
const pendingOut = ref(props.checkOut)
const pendingValid = computed(()=>{
  if(!pendingIn.value || !pendingOut.value) return false
  const s = parseYMD(pendingIn.value), e = parseYMD(pendingOut.value)
  const nights = Math.round((e - s)/MS_DAY)
  return nights >= Math.max(props.minNights,1)
})

watch(()=>props.checkIn,  v=>{ pendingIn.value = v })
watch(()=>props.checkOut, v=>{ pendingOut.value = v })

function open(which){
  openFor.value = which
  // 열 때 보이는 달을 해당 값으로 정렬
  const iso = which==='in' ? (pendingIn.value || minDateResolved.value) : (pendingOut.value || addDaysUTC(parseYMD(pendingIn.value||minDateResolved.value), Math.max(props.minNights,1)))
  const d = parseYMD(iso); d.setUTCDate(1); viewMonth.value = d
}

function close(){ openFor.value = null }

function pick(iso){
  if (openFor.value === 'in'){
    pendingIn.value = iso
    // 최소박 반영해서 out 자동 제안
    const minOut = toISO(addDaysUTC(parseYMD(iso), Math.max(props.minNights,1)))
    if (!pendingOut.value || parseYMD(pendingOut.value) <= parseYMD(iso)) {
      pendingOut.value = minOut
    }
    // 바로 체크아웃 선택으로 이동
    open('out')
    return
  }
  if (openFor.value === 'out'){
    pendingOut.value = iso
  }
}

function apply(){
  // 보정: 최대박 제한
  const s = parseYMD(pendingIn.value)
  let e = parseYMD(pendingOut.value)
  const n = Math.round((e - s)/MS_DAY)
  if (n < Math.max(props.minNights,1)) {
    e = addDaysUTC(s, Math.max(props.minNights,1))
  }
  if (n > Math.max(props.maxNights,1)) {
    e = addDaysUTC(s, Math.max(props.maxNights,1))
  }
  emit('update:checkIn',  toISO(s))
  emit('update:checkOut', toISO(e))
  close()
}
</script>

<style scoped>
.card{background:#fff;border:1px solid var(--line,#e5e7eb);border-radius:14px;box-shadow:0 8px 24px rgba(0,0,0,.04);padding:16px}
.sec-title{display:flex;gap:10px;align-items:center;font-weight:800;margin-bottom:12px}
.sec-title i{color:var(--brand,#2ECC9A)}

.dates{display:grid;grid-template-columns:1fr 120px 1fr auto;gap:14px;align-items:center}
.date-block{text-align:left;border:1px solid #dbe9e2;border-radius:12px;background:#fff;padding:14px 16px;cursor:pointer;transition:.15s;box-shadow:0 1px 0 rgba(0,0,0,.02)}
.date-block:hover{box-shadow:0 6px 18px rgba(0,0,0,.06)}
.date-top{font-weight:800;color:#0f2d1f}
.date-sub{font-size:12px;color:#6b7280;margin-top:2px}
.hint{margin-top:8px;font-size:12px;color:#7b8a7f}

.date-icon{display:flex;align-items:center;justify-content:center;color:#0f2d1f;gap:14px}
.date-icon i{font-size:28px}
.date-icon .line{width:36px;height:2px;background:#0f2d1f;border-radius:2px;opacity:.5}

.nights{justify-self:end;background:#eaf8f2;border-radius:999px;padding:8px 12px;font-weight:800;color:#0f5132}

/* popup */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.2);display:flex;align-items:center;justify-content:center;z-index:50}
.picker{width:320px;background:#fff;border-radius:14px;border:1px solid #e5e7eb;box-shadow:0 24px 60px rgba(0,0,0,.16);padding:12px}
.toolbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.title{font-weight:800}
.nav{border:none;background:#f4f7f6;border-radius:8px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer}

.weekdays{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin:6px 0 4px;color:#64748b;font-size:12px;text-align:center}
.grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}
.cell{height:40px;border:none;border-radius:8px;background:#fff;cursor:pointer}
.cell.is-other{opacity:.35}
.cell:hover{background:#f3faf7}
.cell.is-in-range{background:#e8f6ee}
.cell.is-checkin,
.cell.is-checkout{background:#2ecc9a;color:#fff;font-weight:800}
.cell.is-disabled{opacity:.35;cursor:not-allowed}
.cell span{display:inline-block;line-height:40px;font-weight:600}

.actions{display:flex;justify-content:flex-end;gap:8px;margin-top:10px}
.btn{border-radius:10px;padding:10px 12px;font-weight:800}
.btn.ghost{border:1px solid #d1d5db;background:#fff;color:#374151}
.btn.solid{background:#34c79a;border:none;color:#fff}
.btn.solid:disabled{background:#cfeee3;color:#fff;cursor:not-allowed}

@media (max-width: 960px){
  .dates{grid-template-columns:1fr}
  .nights{justify-self:start}
}
</style>
