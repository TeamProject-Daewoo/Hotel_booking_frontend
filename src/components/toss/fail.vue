<template>
  <div>
    <h2>결제 실패</h2>
    <p>에러코드: {{ errorCode }}</p>
    <p>실패 사유: {{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const errorCode = computed(() => route.query.code);
const errorMessage = computed(() => route.query.message);
</script>