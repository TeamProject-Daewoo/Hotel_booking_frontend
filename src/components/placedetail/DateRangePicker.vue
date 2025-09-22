<template>
  <section class="card">
    <div class="sec-title">
      <i class="fa-regular fa-calendar"></i> 날짜 선택
    </div>

    <div class="dates">
      <div class="date-block">
        <div class="date-top">{{ label(checkIn) }}</div>
        <div class="date-sub">Check-in</div>
        <div v-if="building?.checkintime" class="hint">입실 {{ building.checkintime }}</div>
      </div>

      <div class="date-icon">
        <div class="line"></div>
        <i class="fa-solid fa-arrow-right-long"></i>
        <div class="line"></div>
      </div>

      <div class="date-block">
        <div class="date-top">{{ label(checkOut) }}</div>
        <div class="date-sub">Check-out</div>
        <div v-if="building?.checkouttime" class="hint">퇴실 {{ building.checkouttime }}</div>
      </div>

      <div class="nights" v-if="nights > 0">
        <i class="fa-regular fa-moon"></i> {{ nights }}박
      </div>
    </div>
    
    <div class="calendar-container">
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
            'is-start-date': isSameISO(cell.iso, checkIn),
            'is-end-date': isSameISO(cell.iso, checkOut),
          }"
          :disabled="cell.disabled"
          @click="pick(cell.iso)"
        >
          <span>{{ cell.d }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

/* ---------- Props & Emits: v-model을 통해 부모와 데이터 주고받기 ---------- */
const props = defineProps({
  checkIn:  { type: String, required: true }, // YYYY-MM-DD
  checkOut: { type: String, required: true }, // YYYY-MM-DD
  building: { type: Object, default: () => ({}) },
});
const emit = defineEmits(['update:checkIn', 'update:checkOut']);

/* ---------- Date Helpers (UTC 기준) ---------- */
const MS_DAY = 86400000;
function parseYMD(iso) { return new Date(iso + 'T00:00:00.000Z'); }
function toISO(d) { return d.toISOString().slice(0, 10); }
function addDaysUTC(d, n) { const x = new Date(d); x.setUTCDate(x.getUTCDate() + n); return x; }
function todayISO() { const n = new Date(); return toISO(new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()))); }
function isSameISO(a, b) { return a && b && a === b; }

/* ---------- View Model ---------- */
const viewMonth = ref(parseYMD(props.checkIn || todayISO()));
viewMonth.value.setUTCDate(1); // 매월 1일 기준으로 설정

const label = (iso) => iso ? new Date(iso + 'T00:00:00Z').toLocaleDateString('ko-KR', { weekday: 'short', month: 'long', day: 'numeric' }) : '날짜 선택';
const nights = computed(() => {
  if (!props.checkIn || !props.checkOut) return 0;
  const diff = Math.round((parseYMD(props.checkOut) - parseYMD(props.checkIn)) / MS_DAY);
  return diff > 0 ? diff : 0;
});

/* ---------- Calendar Data ---------- */
const visibleMonthLabel = computed(() => viewMonth.value.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' }));

const cells = computed(() => {
  const first = new Date(viewMonth.value);
  const start = addDaysUTC(first, -first.getUTCDay());
  const list = [];
  const sIn = props.checkIn ? parseYMD(props.checkIn) : null;
  const sOut = props.checkOut ? parseYMD(props.checkOut) : null;
  const today = parseYMD(todayISO());

  for (let i = 0; i < 42; i++) {
    const d = addDaysUTC(start, i);
    const iso = toISO(d);
    list.push({
      key: iso,
      iso,
      d: d.getUTCDate(),
      isOtherMonth: d.getUTCMonth() !== first.getUTCMonth(),
      disabled: d < today,
      inRange: sIn && sOut && d > sIn && d < sOut,
    });
  }
  return list;
});

function go(delta) {
  const d = new Date(viewMonth.value);
  d.setUTCMonth(d.getUTCMonth() + delta, 1);
  viewMonth.value = d;
}

/* ---------- Date Picking Logic ---------- */
function pick(iso) {
  const currentIn = props.checkIn;
  const currentOut = props.checkOut;

  // 1. 체크인이 없거나, 체크인/아웃이 모두 선택된 상태에서 다시 클릭하면 -> 새로운 체크인으로 설정
  if (!currentIn || (currentIn && currentOut)) {
    emit('update:checkIn', iso);
    emit('update:checkOut', ''); // 체크아웃은 초기화
  } 
  // 2. 체크인만 선택된 상태에서 클릭하면
  else {
    const newDate = parseYMD(iso);
    const checkInDate = parseYMD(currentIn);

    if (newDate > checkInDate) {
      // 체크인 날짜보다 뒤를 선택하면 -> 체크아웃으로 설정
      emit('update:checkOut', iso);
    } else {
      // 체크인 날짜보다 앞이나 같은 날을 선택하면 -> 새로운 체크인으로 설정
      emit('update:checkIn', iso);
    }
  }
}
</script>

<style scoped>
/* 스타일은 이전에 보여주신 코드를 기반으로 재구성했습니다. */
.card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;box-shadow:0 8px 24px rgba(0,0,0,.04);padding:16px; margin-top:24px;}
.sec-title{display:flex;gap:10px;align-items:center;font-weight:800;margin-bottom:12px}
.dates{display:grid;grid-template-columns:1fr 80px 1fr auto;gap:14px;align-items:center}
.date-block{text-align:left;border:1px solid #dbe9e2;border-radius:12px;background:#fff;padding:14px 16px;}
.date-top{font-weight:800;color:#0f2d1f}
.date-sub{font-size:12px;color:#6b7280;margin-top:2px}
.hint{margin-top:8px;font-size:12px;color:#7b8a7f}
.date-icon{display:flex;align-items:center;justify-content:center;color:#0f2d1f;gap:8px}
.date-icon i{font-size:20px}
.date-icon .line{flex-grow:1;height:1px;background:#dbe9e2;}
.nights{justify-self:end;background:#eaf8f2;border-radius:999px;padding:8px 12px;font-weight:800;color:#0f5132}

.calendar-container{margin-top:20px; padding:10px; border-top:1px solid #f0f0f0;}
.toolbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.title{font-weight:800}
.nav{border:none;background:#f4f7f6;border-radius:8px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer}
.weekdays{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin:6px 0 4px;color:#64748b;font-size:12px;text-align:center}
.grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}
.cell{height:40px;border:none;border-radius:8px;background:#fff;cursor:pointer; position: relative;}
.cell.is-other{opacity:.35}
.cell:not(.is-disabled):hover{background:#f3faf7}
.cell.is-in-range{background:#e8f6ee; border-radius: 0;}
.cell.is-start-date{background:#2ecc9a;color:#fff;font-weight:800; border-top-left-radius: 999px; border-bottom-left-radius: 999px;}
.cell.is-end-date{background:#2ecc9a;color:#fff;font-weight:800; border-top-right-radius: 999px; border-bottom-right-radius: 999px;}
.cell.is-disabled{opacity:.35;cursor:not-allowed; text-decoration: line-through;}
.cell span{display:inline-block;line-height:40px;font-weight:600}
</style>