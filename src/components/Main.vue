<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Search from './search/Search.vue';

const imageUrls = ref([
  'https://cdn.pixabay.com/photo/2021/12/11/07/59/hotel-6862159_1280.jpg',
  'https://cdn.pixabay.com/photo/2017/01/27/22/19/dubai-2014317_1280.jpg',
  'https://cdn.pixabay.com/photo/2014/08/17/23/45/hotel-420260_1280.jpg',
  'https://cdn.pixabay.com/photo/2014/09/26/04/42/hotel-461615_1280.jpg',
  'https://cdn.pixabay.com/photo/2016/11/17/09/28/hotel-1831072_1280.jpg'
]);

const textContent = ref([
  {
    welcome: "HIGHWAY OTEL에 오신 것을 환영합니다",
    title: "가장 소중한 고객",
    subtitle: "일상에서 벗어나 특별한 휴식을 경험하세요. 최고의 서비스로 보답하겠습니다."
  },
  {
    welcome: "최고의 도시 전망",
    title: "하늘과 맞닿은 곳",
    subtitle: "파노라마처럼 펼쳐지는 도시의 야경과 함께 잊지 못할 밤을 만들어보세요."
  },
  {
    welcome: "자연 속의 휴식",
    title: "고요한 안식처",
    subtitle: "아름다운 자연에 둘러싸여 몸과 마음에 진정한 평온을 선물하세요."
  },
  {
    welcome: "모던한 디자인",
    title: "도심 속 오아시스",
    subtitle: "세련되고 현대적인 인테리어 속에서 편안함과 안락함을 느껴보세요."
  },
  {
    welcome: "완벽한 여행의 시작",
    title: "당신만을 위한 공간",
    subtitle: "여행의 모든 순간이 완벽할 수 있도록, 세심한 배려가 가득한 곳입니다."
  }
]);

const currentIndex = ref(0);
let intervalId = null;
const slideDuration = 6000; // ms

onMounted(() => {
  intervalId = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % imageUrls.value.length;
  }, slideDuration);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <div class="hero-container">
    <transition-group name="fade" tag="div" class="background-slider">
      <div
          v-for="(url, index) in imageUrls"
          :key="url"
          v-show="index === currentIndex"
          class="background-image"
          :style="{ backgroundImage: `url(${url})` }"
      ></div>
    </transition-group>

    <div class="content-wrapper">
      <div class="search-section">
        <div class="search-wrapper">
          <Search/>
        </div>
      </div>

      <div class="text-section">
        <transition name="slide-up" mode="out-in">
          <div :key="currentIndex">
            <p class="welcome-text">{{ textContent[currentIndex].welcome }}</p>
            <h1 class="main-title">{{ textContent[currentIndex].title }}</h1>
            <p class="subtitle">{{ textContent[currentIndex].subtitle }}</p>
          </div>
        </transition>
      </div>
    </div>

    <div class="progress-bar-container">
      <div v-for="(url, index) in imageUrls" :key="index" class="progress-bar-segment">
        <div :class="['progress-bar-fill', { active: index === currentIndex }]" :style="{ animationDuration: `${slideDuration}ms` }"></div>
      </div>
    </div>
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: 'Pretendard', 'Helvetica Neue', sans-serif;
}
</style>

<style scoped>
.hero-container {
  height: 100vh;
  display: flex;
  color: white;
  position: relative;
  overflow: hidden;
  background-color: #111;
}

.background-slider, .background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.background-slider { z-index: 1; }
.background-image {
  background-size: cover;
  background-position: center;
}

.fade-enter-active, .fade-leave-active { transition: opacity 1.5s ease-in-out; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.content-wrapper {
  position: relative;
  z-index: 2;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0 8%;
}

.search-section, .text-section {
  flex-basis: 45%;
}

.text-section {
  text-align: right;
}

.welcome-text {
  font-size: 1rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
}

.main-title {
  font-size: 4rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 2px 2px 12px rgba(0, 0, 0, 0.7);
}

.subtitle {
  font-size: 1.1rem;
  margin-top: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 1px 1px 8px rgba(0, 0, 0, 0.7);
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.7s ease;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.progress-bar-container {
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  width: 80%;
  display: flex;
  gap: 15px;
}

.progress-bar-segment {
  flex-grow: 1;
  background-color: rgba(255, 255, 255, 0.2);
  height: 3px;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar-fill {
  width: 0%;
  height: 100%;
  background-color: white;
  border-radius: 3px;
}

.progress-bar-fill.active {
  width: 100%;
  animation-name: fill-progress;
  animation-timing-function: linear;
}

@keyframes fill-progress {
  from { width: 0%; }
  to { width: 100%; }
}
</style>