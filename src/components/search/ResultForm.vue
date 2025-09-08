<template>
    <div class="result-main-container" v-if="response">
        <div class="select-place">
            <button v-for="(count, place) in selectData" 
                    :key="place"
                    :class="{ 'active': place === searchStore.place }"
                    @click="selectPlace(place)">
                {{ place }}
                <span>{{ count }} places</span>
            </button>
        </div>
        <div class="order-container">
            <p>Showing of {{ totalCount }} places</p>
            <p>Sort By <button class="order-select-btn">{{ searchStore.order }}</button> <i class="fa-solid fa-chevron-down"></i></p>
        </div>
        <div class="result-card" v-for="data in response" :key="data.id">
            <div class="image-container">
                <img :src="data.image">
            </div>
            <div class="infor-container">
                <div class="text-container">
                    <div class="infor-view">
                        <h2>{{ data.title }}</h2>
                        <p><i class="fa-solid fa-location-dot"></i> {{ data.address }}</p>
                        <span style="margin-right: 30px;"><i class="fa-solid fa-star"></i> {{ data.rating }}</span>
                        <span><i class="fa-solid fa-mug-saucer"></i> <b>{{ data.totalAminities }}+</b> Animities</span>
                        <p><b>Very Good</b> {{ data.totalReviews }} reviews</p>
                    </div>
                    <div class="price-view">
                        <p>starting from</p>
                        <p>￦{{ data.price }}<span style="font-size: 12pt;">/night</span></p>
                        <div style="text-align: right;">
                            <p>excl. tax</p>
                        </div>
                    </div>
                </div>
                <div class="btn-container">
                    <button class="like-btn" @click="likeToggle">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                    
                    <button @click="this.$router.push('/')" class="view-btn">View Place</button>
                </div>
            </div>
        </div>
    </div>
    <div class="result-main-container" v-else>
        <div class="result-card">
            <h3>검색결과가 없습니다!</h3>
        </div>
    </div>
</template>
<script setup>
import { useSearchStore } from '@/api/searchRequestStore';
import { defineProps, ref, watch } from 'vue';

const searchStore = useSearchStore();

const props = defineProps({
    response: {
        type: Object,
        default: null
    }
});
const totalCount = ref(0);
const selectData = ref({
    'Hotels': 257,
    'Motels': 51,
    'Resorts': 72
});

watch(() => props.response, (newResponse) => {
    //console.log(newResponse);
    if (newResponse)
        totalCount.value = newResponse.length;
}, { immediate: true });

const likeToggle = (event) => {
  const target = event.currentTarget.querySelector('i');
  if (target.classList.contains('fa-solid')) {
    target.classList.remove('fa-solid');
    target.classList.add('fa-regular');
  } else {
    target.classList.remove('fa-regular');
    target.classList.add('fa-solid');
  }
}

const selectPlace = (place) => {
    searchStore.place = place;
};
</script>

<style scoped>
.result-main-container {
    /* background-color: aqua; */
    border-left: 1px solid rgb(190, 190, 190);
    padding-left: 20px;
}
.result-card {
    display: flex;
    width: 100%;
    height: 300px;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
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
/* 각 버튼의 기본 스타일 */
.select-place button {
    flex-grow: 1; /* 모든 버튼이 동일한 너비를 갖도록 함 */
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

/* 버튼 위에 마우스를 올렸을 때의 스타일 */
.select-place button:hover {
    color: #333;
}

/* 버튼이 활성화(클릭)되었을 때의 스타일 */
.select-place button.active {
    color: #000;
    border-bottom: 4px solid #80c883;
}

/* "257 places"와 같은 텍스트 스타일 */
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

.result-card:hover {
  transform: translateY(-5px);
}

.image-container {
    width: 35%;
    height: 300px;
    object-fit: cover;
    border-bottom: 1px solid #e0e0e0;
}
.image-container img {
    height: 300px;
}
.infor-container {
    background-color: white;
    width: 65%;
    height: 300px;
    padding: 20px;
}
.text-container {
    width: 100%;
    height: 200px;
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
    margin-top: 50px;
    height: 200px;
    text-align: left;
}
.price-view p {
    margin: 0px 0px;
}

.btn-container {
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: space-between;
}

/* 가격 강조 */
.price-view p:nth-of-type(2) {
  color: #f89489;
  font-weight: bold;
  font-size: 30px;
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

/* 찜 아이콘 */
.like-btn {
  width: 40px;
  height: 40px;
  background: white;
  border: 1px solid #3aa38b;
  border-radius: 5px;
  padding: 6px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  cursor: pointer;
  text-align: center;
}

.like-btn:hover {
  background-color: #d7ebe5;
}
</style>