<template>
  <section class="card login">
    <div class="sec-title"><i class="fa-regular fa-user"></i> 예약자 정보</div>

    <input
      type="text"
      placeholder="이름"
      v-model="nameProxy"
      autocomplete="name"
    />

    <input
      type="tel"
      placeholder="전화번호"
      v-model="phoneProxy"
      inputmode="tel"
      autocomplete="tel"
    />

    <button class="btn solid" :disabled="!canContinue" @click="$emit('continue')">
      Continue
    </button>
  </section>
</template>

<script setup>
import { computed } from 'vue'

// ✅ 다중 v-model: v-model:name, v-model:phone
const props = defineProps({
  name: String,
  phone: String
})
const emit = defineEmits(['update:name', 'update:phone', 'continue'])

const nameProxy = computed({
  get: () => props.name,
  set: v => emit('update:name', v)
})
const phoneProxy = computed({
  get: () => props.phone,
  set: v => emit('update:phone', v)
})

const canContinue = computed(() => {
  const nameOk = (props.name ?? '').trim().length >= 2
  const digits = String(props.phone ?? '').replace(/\D/g, '')
  const phoneOk = digits.length >= 10 // 국내 휴대폰 최소 길이 기준
  return nameOk && phoneOk
})
</script>

<style scoped>
.card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;box-shadow:0 8px 24px rgba(0,0,0,.04);padding:16px}
.sec-title{display:flex;gap:10px;align-items:center;font-weight:800;margin-bottom:12px}
.login input{width:96.4%;padding:12px;border:1px solid #e5e7eb;border-radius:10px;margin-bottom:8px}
.btn{transition:.2s;display:block;width:100%;padding:12px;border-radius:10px;font-weight:800;text-align:center}
.btn:hover{transform:translateY(-1px);box-shadow:0 10px 24px rgba(0,0,0,.10), 0 2px 8px rgba(0,0,0,.06);}
.btn.solid{background:#34c79a;color:#fff;border:none}
.btn:disabled{opacity:.5;cursor:not-allowed;transform:none;box-shadow:none}
</style>
