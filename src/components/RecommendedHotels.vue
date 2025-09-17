<template>
  <section class="recommend-section">
    <div class="section-header">
      <h2 class="section-title">국내 인기 여행지</h2>
      <p class="section-subtitle">지금 바로 떠나기 좋은 국내 최고의 여행지들을 만나보세요.</p>
    </div>
    <div class="carousel-container">
      <button @click="scrollLeft" class="nav-button prev">&lt;</button>
      <div class="carousel-track" ref="carouselTrack">
        <div v-for="dest in destinations" :key="dest.city" class="destination-card">
          <img :src="dest.imageUrl" :alt="dest.city" class="card-image"/>
          <div class="card-overlay">
            <h3 class="city-name">{{ dest.city }}</h3>
          </div>
        </div>
      </div>
      <button @click="scrollRight" class="nav-button next">&gt;</button>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const carouselTrack = ref(null);

const destinations = ref([
  { city: '서울', imageUrl: 'https://cdn.pixabay.com/photo/2014/08/05/09/37/building-410266_1280.jpg' },
  { city: '부산', imageUrl: 'https://cdn.pixabay.com/photo/2025/03/02/15/12/port-9442252_1280.jpg' },
  { city: '제주', imageUrl: 'https://cdn.pixabay.com/photo/2022/01/11/03/38/jeju-island-6929633_1280.jpg' },
  { city: '경주', imageUrl: 'https://cdn.pixabay.com/photo/2022/08/05/05/59/korea-7366036_1280.jpg' },
  { city: '강릉', imageUrl: 'https://cdn.pixabay.com/photo/2020/01/02/07/01/sunrise-4735113_1280.jpg' },
  { city: '여수', imageUrl: 'https://cdn.pixabay.com/photo/2019/05/05/17/24/expo-4181112_1280.jpg' },
  { city: '속초', imageUrl: 'https://cdn.pixabay.com/photo/2022/04/16/10/14/sokcho-7136011_1280.jpg' },
  { city: '광주', imageUrl: 'https://cdn.pixabay.com/photo/2017/04/04/10/14/guangzhou-2200907_1280.jpg' },
  { city: '전주', imageUrl: 'https://cdn.pixabay.com/photo/2015/04/02/14/15/hanok-village-703824_1280.jpg' },
  { city: '충주', imageUrl: 'https://cdn.pixabay.com/photo/2016/12/13/03/21/0-won-jungangtap-1903207_1280.jpg' },
  { city: '대구', imageUrl: 'https://cdn.pixabay.com/photo/2022/02/03/05/08/daegu-6989752_1280.jpg' },
]);

const scrollLeft = () => {
  if (carouselTrack.value) {
    carouselTrack.value.scrollBy({ left: -300, behavior: 'smooth' });
  }
};

const scrollRight = () => {
  if (carouselTrack.value) {
    carouselTrack.value.scrollBy({ left: 300, behavior: 'smooth' });
  }
};
</script>

<style scoped>
.recommend-section {
  padding: 80px 5%;
  background-color: #f8f9fa;
  text-align: center;
}
.section-header {
  margin-bottom: 40px;
}
.section-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}
.section-subtitle {
  font-size: 16px;
  color: #868e96;
}
.carousel-container {
  position: relative;
  display: flex;
  align-items: center;
}
.carousel-track {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 10px;
  scroll-behavior: smooth;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
}
.carousel-track::-webkit-scrollbar { /* WebKit */
  display: none;
}
.destination-card {
  flex: 0 0 280px;
  height: 350px;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  cursor: pointer;
}
.destination-card:hover {
  transform: translateY(-5px);
}
.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  display: flex;
  align-items: flex-end;
  padding: 20px;
  box-sizing: border-box;
}
.city-name {
  color: white;
  font-size: 24px;
  font-weight: 600;
}
.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  z-index: 10;
}
.nav-button.prev {
  left: -20px;
}
.nav-button.next {
  right: -20px;
}
</style>