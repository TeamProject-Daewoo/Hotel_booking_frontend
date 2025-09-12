<template>
  <section class="card">
    <div class="sec-title"><i class="fa-solid fa-wallet"></i> 결제 방식</div>
    <button type="button" class="pay-opt" :class="{active:modelValue==='full'}" @click="$emit('update:modelValue','full')">
      <div class="opt-text">
        <div class="opt-title">선불 결제</div>
        <div class="opt-sub">전체 결제 후 예약 확정</div>
      </div>
      <div class="radio"><span></span></div>
    </button>
    <button type="button" class="pay-opt" :class="{active:modelValue==='partial'}" @click="$emit('update:modelValue','partial')">
      <div class="opt-text">
        <div class="opt-title">후불 결제</div>
        <div class="opt-sub">체크인 시 금액 결제 [만나서 결제]</div>
      </div>
      <div class="radio"><span></span></div>
    </button>
  </section>
</template>

<script setup>
defineProps({ modelValue:String })
defineEmits(['update:modelValue'])
</script>

<style scoped>
.card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;box-shadow:0 8px 24px rgba(0,0,0,.04);padding:16px}
.sec-title{display:flex;gap:10px;align-items:center;font-weight:800;margin-bottom:12px}
.sec-title i{color:#2ECC9A}
.pay-opt{width:100%;display:flex;justify-content:space-between;align-items:center;padding:14px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;margin-bottom:10px;cursor:pointer;transition:.2s}
.pay-opt:hover{transform:translateY(-1px);box-shadow:0 8px 20px rgba(0,0,0,.06)}
.pay-opt.active{background:#eaf8f2;border-color:#9ddfc9}
.opt-title{font-weight:800;text-align:start;}
.opt-sub{font-size:13px;color:#6b7280}
.radio{width:22px;height:22px;border:2px solid #cfd8dc;border-radius:50%;display:flex;align-items:center;justify-content:center}
.pay-opt.active .radio{border-color:#34c79a}
.radio span{width:12px;height:12px;border-radius:50%;background:transparent}
.pay-opt.active .radio span{background:#34c79a}
</style>
