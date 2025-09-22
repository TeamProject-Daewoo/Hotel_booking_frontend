<template>
    <div class="result-main-container" v-if="searchStore.result">
        <div class="select-place">
            <button v-for="(count, category) in searchStore.result.data.counts" 
                    :key="category"
                    :class="{ 'active': category === searchStore.category }"
                    @click="selectCategory(category)">
                {{ category }}
                <span>{{ count }} places</span>
            </button>
        </div>
        <div class="order-container">
            <p>총 <b>{{ searchStore.result.data.counts[searchStore.category] }}</b>개의 검색 결과</p>
            <p>정렬 기준 <button @click="openModal" class="order-select-btn">{{ searchStore.order }}</button> <i class="fa-solid fa-chevron-down"></i></p>
        </div>
        <SearchModal :isOpen="isModalOpen" @close="closeModal">
            <h2>정렬 기준</h2>
            <ul class="sort-options">
                <li v-for="option in sortOptions"
                    :key="option"
                    class="sort-option-item"
                    :class="{ 'selected': searchStore.order === option }"
                    @click="selectOption(option)"
                >{{ option }}<span v-if="searchStore.order === option"><i class="fa-solid fa-check"></i></span></li>
            </ul>
        </SearchModal>
        <div v-if="searchStore.result.data.searchCards.length === 0" class="result-card">
            <h3>검색결과가 없습니다!</h3>
        </div>
        <div class="result-card" v-for="data in searchStore.result.data.searchCards" :key="data.id">
            <div class="image-container">
                <img :src="data.image || emptyImage">
            </div>
            <div class="infor-container">
                <div class="text-container">
                    <div class="infor-view">
                        <h2>{{ data.title }}</h2>
                        <p><i class="fa-solid fa-location-dot"></i> {{ data.address }}</p>
                        <span style="margin-right: 30px;">
                          <i class="fa-solid fa-star"></i>
                          <span v-if="data.rating == 0">리뷰 없음</span>
                          <span v-else><b>&nbsp;{{ data.rating.toFixed(1) }}점</b></span>
                        </span>
                        <span><i class="fa-solid fa-mug-saucer"></i> <b>{{ data.totalAminities }}</b>+ 편의시설</span>
                        <p>
                          <b v-if="data.rating == 0">(리뷰 없음)</b>
                          <b v-else-if="data.rating > 4.5" style="color: darkgreen">매우 좋은</b>
                          <b v-else-if="data.rating > 4.0" style="color: green">좋은</b>
                          <b v-else-if="data.rating > 3.5" style="color:limegreen">괜찮은</b>
                          <b v-else style="color: orange;">무난한</b>
                          
                          {{ data.totalReviews }} reviews
                        </p>
                    </div>
                    <div class="price-view">
                        <p>starting from</p>
                        <p>{{ ((parseInt(data.price)*dateDiff)/10000).toLocaleString() }}만원<span style="font-size: 15pt;">/{{ dateDiff }}박</span></p>
                    </div>
                </div>
                <div class="btn-container">
                    <button class="like-btn"  @click="likeToggle($event, data.contentId)">
                        <i class="fa-heart" 
                            :class="{ 
                              'fa-solid': wishlistStore.isLiked(data.contentId), 
                              'fa-regular': !wishlistStore.isLiked(data.contentId) 
                            }">
                        </i>
                    </button>
                    <button v-if="data.roomCount === 0" class="view-btn" style="color:white; background-color:lightcoral;">
                        예약 마감
                    </button>
                    <button v-else class="view-btn" @click="goToDetail(data.contentId)">
                        예약 하기
                    </button>
                </div>
            </div>
        </div>
        <LoadMapButton/>
    </div>
    <div class="result-main-container" v-else-if="searchStore.isLoading">
        <div class="result-card">
            <h3>검색 결과를 불러오는 중입니다...</h3>
        </div>
    </div>
    <div class="result-main-container" v-else-if="searchStore.error">
        <div class="result-card">
            <h3>{{ searchStore.error }}</h3>
        </div>
    </div>
    <div class="result-main-container" v-else>
        <div v-if="historyStore.recentlyViewed.length > 0" class="history-container">
          <h4 class="history-title">최근 방문</h4>
          <div class="history-cards-wrapper">
            <div 
              v-for="hotel in historyStore.recentlyViewed" 
              :key="hotel.contentid" 
              class="history-card"
              @click="goToDetail(hotel.contentid)"
            >
             <div class="card-delete-btn" @click="historyStore.deleteRecentView(hotel.contentid)">
                <i class="fa-solid fa-xmark" style="color: white; text-shadow: 2px 2px 2px black; "></i>
              </div>
              <img :src="hotel.firstimage || emptyImage" alt="이미지" class="card-image">
              <div class="card-info">
                <p class="card-title">{{ hotel.title }}</p>
                <p class="card-address">{{ hotel.addr1 }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="result-card" v-else>
          <h3>검색 버튼을 눌러서 검색하세요!</h3>
        </div>
    </div>
</template>
<script setup>
import { useSearchStore } from '@/api/searchRequestStore';
import { computed, onMounted, ref } from 'vue';
import SearchModal from './SearchModal.vue';
import axios from '@/api/axios';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/api/auth';
import router from '@/router';
import { useHistoryStore } from '@/store/recentHistoryStore';
import LoadMapButton from './LoadMapButton.vue';

const searchStore = useSearchStore();
const wishlistStore = useWishlistStore();
const authStore = useAuthStore();
const historyStore = useHistoryStore();

//로컬 스토리지 불러오기
onMounted(() => {
  historyStore.loadRecentSearches();
});
const dateDiff = computed(() => {
  return getDaysDifference(searchStore.checkInDate, searchStore.checkOutDate);
})

const likeToggle = (event, hotelId) => {
  if (!authStore.isLoggedIn) {
    if(confirm('로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?')) {
      router.push({ 
        name: 'login',
        query: { redirect: router.currentRoute.value.fullPath } 
      });
    }
    return;
  }
  const target = event.currentTarget.querySelector('i');
  if (target.classList.contains('fa-solid')) {
    //버튼 비활성화
    target.classList.remove('fa-solid');
    target.classList.add('fa-regular');
  } else {
    //버튼 활성화
    target.classList.remove('fa-regular');
    target.classList.add('fa-solid');
  }
  wishlistStore.toggleWish(hotelId);
}

const selectOption = (option) => {
  searchStore.order = option;
  if(searchStore.keyword.trim() != '')
    searchStore.fetchSearchResult();
  closeModal();
}

const emptyImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect width='100%25' height='100%25' fill='%23E5E7EB'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='30' fill='%239CA3AF' dominant-baseline='middle' text-anchor='middle'%3E제공되지 않는 이미지입니다.%3C/text%3E%3C/svg%3E"
const goToDetail = (hotelId) => {
  router.push(`/place/${hotelId}`);
};

const sortOptions = [
    '인기 순',
    '높은 가격 순',
    '낮은 가격 순',
    '평점 높은 순',
]
const isModalOpen = ref(false);
const openModal = () => {
    isModalOpen.value = true;
};
const closeModal = () => {
    isModalOpen.value = false;
};

const selectCategory = (category) => {
    searchStore.category = category;
    if(searchStore.keyword != '')
      searchStore.fetchSearchResult();
};

function getDaysDifference(date1, date2) {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

  return Math.floor((utc2 - utc1) / MS_PER_DAY);
}
</script>

<style scoped>
.result-main-container {
  border-left: 1px solid rgb(190, 190, 190);
  padding-left: 20px;
}
.result-card {
  display: flex;
  width: 100%;
  height: 350px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  background-color: #fff;
  transition: transform 0.2s ease;
  font-family: "Arial", sans-serif;
  box-sizing: border-box;
  margin-bottom: 20px;
}

.select-place {
  display: flex;
  justify-content: space-around;
  width: 100%;
  border-bottom: 1px solid #e0e0e0;
  font-family: Arial, sans-serif;
  padding-top: 10px;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  background-color: #fff;
  box-sizing: border-box;
}
.select-place button {
  flex-grow: 1;
  padding: 15px 10px;
  background-color: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  text-align: center;
  font-size: 1.1em;
  color: #666;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: bold;
}

.select-place button:hover {
  color: #333;
}

.select-place button.active {
  color: #000;
  border-bottom: 4px solid #80c883;
}

.select-place button span {
  font-size: 0.8em;
  color: #999;
  margin-top: 5px;
  font-weight: normal;
}

.select-place button.active span {
  color: #000;
}
.order-container {
  display: flex;
  justify-content: space-between;
}

.order-select-btn {
  background: none;
  border: none;
  font-size: 13pt;
  font-weight: bold;
  cursor: pointer;
}

.sort-options {
  width: 100%;
  height: 380px;
  text-align: left;
  list-style: none;
  padding: 0;
  margin: 0;
}

.sort-options li {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  height: calc(380px / 4px);
  font-size: 16pt;
  color: #555;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.sort-options li:hover {
  background: #e9ffdf;
  font-weight: bold;
  transition: background-color 0.2s ease-in-out;
}
.sort-option-item.selected {
  background-color: #e9ffdf;
  font-weight: bold;
}

.sort-option-item.selected:hover {
  background-color: #cbffca;
}

.result-card:hover {
  transform: translateY(-5px);
}

.image-container {
  width: 500px; 
  height: 350px;
  object-fit: cover;
  overflow: hidden;
  border-bottom: 1px solid #e0e0e0;
}
.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover; 
  object-position: center; 
}
.infor-container {
  background-color: white;
  width: 65%;
  height: 350px;
  padding: 10px 20px;
  box-sizing: border-box;
}
.text-container {
  width: 100%;
  height: 250px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e0e0e0;
  overflow: hidden;
}

.infor-view {
  height: 200px;
  text-align: left;
}
.price-view {
  margin: 20px 20px;
  width: 200px;
  height: 200px;
  text-align: right;
}
.price-view p {
  margin: 0px 0px;
}

.price-view p:nth-of-type(2) {
  color: #f89489;
  font-weight: bold;
  font-size: 30px;
}

.btn-container {
  padding: 20px 10px 10px 0px;
  width: 100%;
  box-sizing: border-box;
  bottom: 10px;
  display: flex;
  justify-content: space-between;
}

.view-btn {
  display: block;
  width: 85%;
  padding: 12px;
  text-align: center;
  background-color: #5acab2;
  color: black;
  border: none;
  border-radius: 5px;
  transition: background 0.2s ease;
  text-decoration: none;
}

.view-btn:hover {
  background-color: #3aa38b;
}

.like-btn {
  margin-top: 3px;
  width: 38px;
  height: 38px;
  background: white;
  border: 1px solid #3aa38b;
  border-radius: 5px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  cursor: pointer;
  text-align: center;
}

.like-btn:hover {
  background-color: #d7ebe5;
}

.empty-result-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: #fff;
}

.empty-result-container h3 {
  color: #888;
  font-weight: 500;
}

.history-container {
  width: 100%;
}
.history-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
}
.history-cards-wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3개의 카드를 나란히 배치 */
  gap: 20px;
}
.history-card {
  border: 1px solid #e5e5e5;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.history-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.card-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  background-color: #f0f0f0;
}
.card-info {
  padding: 12px;
}
.card-title {
  font-weight: bold;
  margin: 0 0 8px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-address {
  font-size: 14px;
  color: #666;
  margin: 0;
}
.card-delete-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  color: white;
  font-size: 16pt;
  cursor: pointer;
}
</style>