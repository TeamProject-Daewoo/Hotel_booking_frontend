<template>
    <div class="result-main-container" v-if="response">
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
</template>
<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    response: {
        type: Object,
        default: null
    }
});
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

.result-card:hover {
  transform: translateY(-5px);
}

.image-container {
    width: 35%;
    height: 300px;
    object-fit: cover;
    border-bottom: 1px solid #ddd;
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
    border-bottom: 1px solid rgb(190, 190, 190);
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