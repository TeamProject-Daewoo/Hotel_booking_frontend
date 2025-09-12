<template>
  <section class="gallery">
    <div class="main">
      <img :src="images[0]" alt="main" />
    </div>
    <div class="thumbs">
      <img
        v-for="(src, i) in images.slice(1,5)"
        :key="i"
        :src="src"
        alt="thumb"
      />
    </div>
  </section>
</template>

<script setup>
defineProps({
  images: { type: Array, default: () => [] }
})
</script>

<style scoped>
.gallery{display:grid;grid-template-columns:2fr 1fr;gap:10px;margin:20px 0}
.gallery .main img{width:100%;height:420px;object-fit:cover;border-radius:10px}
.gallery .thumbs{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.gallery .thumbs img{width:100%;height:205px;object-fit:cover;border-radius:10px}
@media(max-width:900px){ .gallery{grid-template-columns:1fr} }
</style>
