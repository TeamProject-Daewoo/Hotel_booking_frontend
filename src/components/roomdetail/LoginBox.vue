<template>
  <section class="card login">
    <div class="sec-title"><i class="fa-regular fa-user"></i> Login or Sign up to book</div>
    <input type="tel" placeholder="Phone Number" v-model="phoneProxy" />
    <button class="btn solid" @click="$emit('continue')">Continue</button>
    <div class="or"><span>Or</span></div>
    <div class="sns">
      <button class="sns-btn"><i class="fa-brands fa-facebook-f"></i></button>
      <button class="sns-btn"><i class="fa-brands fa-google"></i></button>
      <button class="sns-btn"><i class="fa-brands fa-apple"></i></button>
    </div>
    <button class="btn outline">Continue with email</button>
  </section>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ modelValue:String })
const emit = defineEmits(['update:modelValue','continue'])
const phoneProxy = computed({
  get:()=>props.modelValue,
  set:v=>emit('update:modelValue',v)
})
</script>

<style scoped>
.card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;box-shadow:0 8px 24px rgba(0,0,0,.04);padding:16px}
.sec-title{display:flex;gap:10px;align-items:center;font-weight:800;margin-bottom:12px}
.login input{width:96.4%;padding:12px;border:1px solid #e5e7eb;border-radius:10px;margin-bottom:8px}
.btn{transition:.2s;display:block;width:100%;padding:12px;border-radius:10px;font-weight:800;text-align:center}
.btn:hover{transform:translateY(-1px);box-shadow:0 10px 24px rgba(0,0,0,.10),
  0 2px 8px rgba(0,0,0,.06);}
.btn.solid{background:#34c79a;color:#fff;border:none}
.btn.outline{background:#fff;color:#34c79a;border:1px solid #34c79a;margin-top:8px}
.or{display:flex;align-items:center;gap:8px;color:#888;justify-content:center;margin:8px 0}
.or::before,.or::after{content:"";height:1px;background:#e5e7eb;flex:1}
.sns{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.sns-btn{padding:10px;border:1px solid #e5e7eb;border-radius:10px;background:#fff}
</style>
