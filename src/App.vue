<template>
  <div id="app">
    <AppHeader /> <!-- 여기에 컴포넌트 추가 -->
    <!-- 나머지 콘텐츠 -->
  </div>
</template>

<script>
// AppHeader를 import합니다
import AppHeader from './components/AppHeader.vue';

export default {
  name: 'App',
  components: {
    AppHeader // 여기서 AppHeader 컴포넌트를 등록합니다
  }
};
</script>

<style>
/* 스타일 작성 */
</style>
