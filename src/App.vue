<script setup>
import Footer from './components/Footer.vue';
import Header from './components/Header.vue';
</script>

<template>
  <div class="container">
    <header class="header-container">
      <Header/>
    </header>
    <main class="main-container">
      <router-view/>
    </main>
    <footer class="footer-container">
      <Footer/>
    </footer>
  </div>
</template>

<!--<style scoped>-->
<!--.container {-->
<!--  text-align: center;-->
<!--}-->
<!--.header-container {-->
<!--    height: 100px;-->
<!--    background-color: rgb(255, 255, 130);-->
<!--}-->
<!--.main-container {-->
<!--    background-color: rgb(189, 255, 244);-->
<!--}-->
<!--.footer-container {-->
<!--    height: 100px;-->
<!--    background-color: rgb(219, 255, 165);-->
<!--}-->
<!--</style>-->