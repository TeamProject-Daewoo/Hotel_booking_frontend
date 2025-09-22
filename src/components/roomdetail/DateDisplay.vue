<template>
    <section class="card">
      <div class="sec-title">
        <i class="fa-regular fa-calendar"></i> 선택된 날짜
      </div>
  
      <div class="dates">
        <div class="date-block">
          <div class="date-top">{{ label(checkIn) }}</div>
          <div class="date-sub">Check-in</div>
        </div>
  
        <div class="date-icon">
          <div class="line"></div>
          <i class="fa-solid fa-arrow-right-long"></i>
          <div class="line"></div>
        </div>
  
        <div class="date-block">
          <div class="date-top">{{ label(checkOut) }}</div>
          <div class="date-sub">Check-out</div>
        </div>
  
        <div class="nights" v-if="nights > 0">
          <i class="fa-regular fa-moon"></i> {{ nights }}박
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  /* ---------- Props: 부모로부터 날짜 데이터 받기 ---------- */
  const props = defineProps({
    checkIn:  { type: String, required: true }, // YYYY-MM-DD
    checkOut: { type: String, required: true }, // YYYY-MM-DD
  });
  
  /* ---------- Date Helpers ---------- */
  const MS_DAY = 86400000;
  function parseYMD(iso) {
    if (!iso) return null;
    return new Date(iso + 'T00:00:00Z');
  }
  
  /* ---------- View Model ---------- */
  const label = (iso) => {
    const d = parseYMD(iso);
    return d ? d.toLocaleDateString('ko-KR', { weekday: 'short', month: 'long', day: 'numeric' }) : '날짜 정보 없음';
  };

  const nights = computed(() => {
  if (!props.checkIn || !props.checkOut) return 0;

  const s = parseYMD(props.checkIn);
  const e = parseYMD(props.checkOut);

  if (!s || !e) return 0;

  const diff = Math.round((e.getTime() - s.getTime()) / MS_DAY);
  return diff > 0 ? diff : 0;
});
  </script>
  
  <style scoped>
  /* 스타일은 DateRangePicker와 유사하게 유지합니다. */
  .card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;box-shadow:0 8px 24px rgba(0,0,0,.04);padding:16px}
  .sec-title{display:flex;gap:10px;align-items:center;font-weight:800;margin-bottom:12px}
  .dates{display:grid;grid-template-columns:1fr 80px 1fr auto;gap:14px;align-items:center}
  .date-block{text-align:left;border:1px solid #dbe9e2;border-radius:12px;background:#fff;padding:14px 16px;}
  .date-top{font-weight:800;color:#0f2d1f}
  .date-sub{font-size:12px;color:#6b7280;margin-top:2px}
  .date-icon{display:flex;align-items:center;justify-content:center;color:#0f2d1f;gap:8px}
  .date-icon i{font-size:20px}
  .date-icon .line{flex-grow:1;height:1px;background:#dbe9e2;}
  .nights{justify-self:end;background:#eaf8f2;border-radius:999px;padding:8px 12px;font-weight:800;color:#0f5132}
  @media (max-width: 960px){
    .dates{grid-template-columns:1fr}
    .nights{justify-self:start}
  }
  </style>