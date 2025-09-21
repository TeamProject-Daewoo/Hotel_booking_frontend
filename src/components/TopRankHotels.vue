<template>
  <section class="recommend-section">
    <div class="section-header">
      <h2 class="section-title">인기 추천 숙소</h2>
      <p class="section-subtitle">지금 바로 떠나기 좋은 국내 최고의 숙소들을 만나보세요.</p>
    </div>
    <div class="carousel-container">
      <button @click="scrollLeft" class="nav-button prev">&lt;</button>
      <div class="carousel-track" ref="carouselTrack">
        <div v-for="(hotel, index) in topRank" :key="hotel.contentId" class="destination-card" @click="goDetailPage(hotel.contentId)">
          <div v-if="index < 3" class="rank-border"></div>
          <div class="card-image-container">
            <img :src="hotel.image || emptyImage" :alt="hotel.title" class="card-image"/>
            <div v-if="!hotel.image" class="card-overlay">제공되지 않는 이미지입니다.</div>
            <div v-if="index < 3" class="rank-badge">
              {{ index + 1 }}
            </div>
          </div>
          <div class="card-info">
            <h3 class="card-name">{{ hotel.title }}</h3>
            <p class="card-address">{{ hotel.addr.split(" ").splice(0, 2).join(' ') }}</p>
            <h3 class="card-price">{{ hotel.price.toLocaleString() }}원~</h3>
            <div class="card-rating-review">
              <span class="card-rating">{{ hotel.rating.toFixed(1) }}</span>
              <span class="card-review">{{ hotel.reviewCount }}</span>
            </div>
          </div>
        </div>
      </div>
      <button @click="scrollRight" class="nav-button next">&gt;</button>
    </div>
  </section>
</template>

<script setup>
import { useSearchStore } from '@/api/searchRequestStore';
import router from '@/router';
import { onMounted, ref } from 'vue';
import api from '@/api/axios'

const searchStore = useSearchStore();

const carouselTrack = ref(null);

const topRank = ref('');
const emptyImage = "https://cdn.pixabay.com/photo/2017/08/10/16/11/burj-al-arab-2624317_1280.jpg"

const goDetailPage = (hotelId) => {
  router.push({path:`/place/${hotelId}`, query:{from: 'main'}});
}
const scrollLeft = () => {
  if (carouselTrack.value) {
    carouselTrack.value.scrollBy({ left: -1800, behavior: 'smooth' });
  }
};

const scrollRight = () => {
  if (carouselTrack.value) {
    carouselTrack.value.scrollBy({ left: 1800, behavior: 'smooth' });
  }
};

onMounted(() => {
    fetchTopRank();
})
const fetchTopRank = async () => {
    try {    
        const response = await api.get(`${import.meta.env.VITE_API_URL}/api/topRank`);
        topRank.value = response.data;
        console.log(topRank.value)
    } catch(e) {
        console.log("api를 가져오는데 실패했습니다.")
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');

/* --- 전체 섹션 스타일 --- */
.recommend-section {
  padding: 80px 5%;
  background-color: #f8f9fa;
  text-align: center;
}

/* --- 섹션 헤더 (제목, 부제목) --- */
.section-header {
    text-align: center;
    margin-bottom: 40px;
}

.section-title {
    font-size: 2.2rem;
    font-weight: 700;
    color: #222;
    margin: 0 0 10px;
}

.section-subtitle {
    font-size: 1.1rem;
    color: #666;
}

/* --- 캐러셀 컨테이너 --- */
.carousel-container {
    position: relative;
    display: flex;
    align-items: center;
}

/* --- 좌/우 네비게이션 버튼 --- */
.nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 45px;
    height: 45px;
    background-color: rgba(255, 255, 255, 0.9);
    border: 1px solid #eee;
    border-radius: 50%;
    font-size: 24px;
    color: #333;
    cursor: pointer;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: all 0.2s ease-in-out;
}

.nav-button:hover {
    background-color: #fff;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transform: translateY(-50%) scale(1.05);
}

.nav-button.prev {
    left: -22px; /* 버튼의 절반만큼 왼쪽으로 */
}

.nav-button.next {
    right: -22px; /* 버튼의 절반만큼 오른쪽으로 */
}

/* --- 캐러셀 트랙 (스크롤 영역) --- */
.carousel-track {
    display: flex;
    overflow-x: scroll;
    scroll-behavior: smooth;
    padding: 10px 0;
    gap: 20px;
    -ms-overflow-style: none;
    scrollbar-width: none;
}
.carousel-track::-webkit-scrollbar {
    display: none;
}

.destination-card {
    position: relative;
    flex: 0 0 325px;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    background-color: #fff;
    display: flex;
    flex-direction: column;
}

.destination-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}

/* --- 카드 이미지 --- */
.card-image-container {
    position: relative;
}
.card-image {
    width: 100%;
    height: 400px; 
    object-fit: cover; 
    border-radius: 16px;
}
.rank-badge {
    position: absolute;
    top: 0;
    left: 0;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%);
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    z-index: 5; /* 이미지 위에 표시 */
}

.rank-border {
    border: 5px solid transparent;
    border-radius: 16px; 
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    pointer-events: none;
    z-index: 6;
}
.destination-card:nth-child(1) .rank-border {
    border: 4px solid #FFD700;
}
.destination-card:nth-child(2) .rank-border {
    border: 4px solid #A9A9A9;
}
.destination-card:nth-child(3) .rank-border {
    border: 4px solid #B8732E;
}
/* 1등 (Gold) */
.destination-card:nth-child(1) .rank-badge {
    background: linear-gradient(145deg, #FFD700, #fff7cb);
}

/* 2등 (Silver) */
.destination-card:nth-child(2) .rank-badge {
    background: linear-gradient(145deg, #A9A9A9, #e3e3e3);
}

/* 3등 (Bronze) */
.destination-card:nth-child(3) .rank-badge {
    background: linear-gradient(145deg, #CD7F32, #f6b97c);
}


.card-info {
    text-align: left;
    height: 100%;
    padding: 15px 15px 20px; 
    display: flex;
    flex-direction: column;
    gap: 5px;
}
.card-address {
    margin-top: 0px;
    margin-bottom: 10px;
}

.card-name {
    font-size: 1.2rem;
    font-weight: 700;
    color: #222;
    margin: 0;
    line-height: 1.4;
    max-height: 2.8em;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

/* 가격 정보 */
.card-price {
    font-size: 1.3rem;
    font-weight: 700;
    color: #444; /* 이미지와 같은 색상 계열 */
    margin: 0;
}

/* 평점 및 리뷰 수 */
.card-rating-review {
    display: flex;
    align-items: center;
    font-size: 0.95rem;
    color: #777;
    margin: 0;
}

.card-rating::before {
    content: '★ '; /* 별 아이콘 */
    color: #FFC107; /* 노란 별 색상 */
    font-size: 1rem;
}

.card-rating {
    font-weight: 500;
    color: #444;
    margin-right: 5px;
}

.card-review::before {
    content: '(';
}
.card-review::after {
    content: ')';
}
.card-overlay {
  position: absolute;
  color:white;
  top: 0;
  left: 0;
  width: 100%;
  height: 99%;
  border-radius: 16px;
  background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
  display: flex;
  align-items: flex-end;
  padding: 20px;
  box-sizing: border-box;
}

/* --- 미디어 쿼리 (반응형 디자인) --- */
@media (max-width: 768px) {
    .recommend-section {
        margin: 40px auto;
        padding: 0 15px;
    }
    .section-title {
        font-size: 1.8rem;
    }
    .section-subtitle {
        font-size: 1rem;
    }
    .destination-card {
        flex: 0 0 calc(50% - 10px); /* 모바일에서 2개씩 표시 */
        aspect-ratio: 1 / 1.5; /* 세로 비율 더 길게 */
    }
    .carousel-track {
        gap: 15px;
    }
    .nav-button {
        display: none; /* 모바일에서는 스크롤로만 이동 */
    }
}

@media (max-width: 480px) {
    .destination-card {
        flex: 0 0 85%; /* 모바일에서 거의 전체 너비 */
        aspect-ratio: 1 / 1.3;
    }
}
</style>