<template>
  <nav class="breadcrumb">
    <!-- Breadcrumb -->
    <router-link class="crumb" :to="{ name:'place-detail', params:{ id } }">
      <i class="fa-solid fa-chevron-left"></i> {{ title || '숙소로 돌아가기' }}
    </router-link>
  </nav>
</template>

<script setup>
defineProps({
  id: { type: [String, Number], required: true },
  title: { type: String, default: '' }
})
</script>

<style scoped>
.breadcrumb{margin-bottom:8px}
.crumb{display:inline-flex;gap:8px;align-items:center;color:#0b8c6f;text-decoration:none;font-weight:700}
.crumb i{font-size:12px}
</style>
