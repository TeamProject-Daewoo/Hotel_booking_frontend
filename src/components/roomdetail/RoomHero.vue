<template>
  <section class="hero card">
    <div class="hero-left">
      <h1 class="room-title">{{ room.roomtitle || '객실' }}</h1>
      <div class="hotel-line">
        <i class="fa-solid fa-hotel"></i>
        <div class="hotel-meta">
          <div class="h-name">{{ base.title || '-' }}</div>
        </div>
      </div>
      <div class="addr-box">
        <i class="fa-solid fa-location-dot"></i>
        <span>{{ base.addr1 || '-' }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  base: { type:Object, required:true },
  room: { type:Object, required:true },
  building: { type:Object, default:()=>({}) }
})

function asNum(v){ return Number(String(v||'0').replace(/[^\d]/g,'')) || 0 }
function lowestPrice(r){
  const arr=[r.roomoffseasonminfee1,r.roomoffseasonminfee2,r.roompeakseasonminfee1,r.roompeakseasonminfee2].map(asNum).filter(n=>n>0)
  return arr.length ? Math.min(...arr) : 0
}
</script>

<style scoped>
.card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;box-shadow:0 8px 24px rgba(0,0,0,.04);padding:16px}
.hero{display:flex;justify-content:space-between;align-items:flex-start;background:linear-gradient(180deg,#ffffff,#f4fbf7)}
.room-title{margin:0 0 6px;font-size:22px;font-weight:800}
.hotel-line{display:flex;gap:10px;align-items:flex-start}
.addr-box{margin-top:10px;display:flex;gap:10px;align-items:center;border:1px solid #e5e7eb;border-radius:10px;padding:10px 12px;background:#fff;color:#374151}
.hero-right{min-width:180px;text-align:right}
.nightly{font-size:22px;font-weight:800;color:#ff8f93}
.nightly small{font-size:12px;color:#9ca3af;margin-left:4px}
.nightly.muted{color:#a3a3a3}
</style>
