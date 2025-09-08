<template>
    <div class="filter-main-container">
        <div class="filter-title">
            <h2>Filters</h2>
        </div>
        <div class="filter-item">
            <div class="filter-section-header">
                <h3>Price</h3>
                <button class="toggle-button" @click="toggleFilter(0)">
                    <span v-if="isFilterOpen[0]"><i class="fa-solid fa-chevron-up"></i></span>
                    <span v-else><i class="fa-solid fa-chevron-down"></i></span>
                </button>
            </div>
            <div v-show="isFilterOpen[0]" class="price-range-container" style="width: 100%;">
                <div ref="slider"></div>
                <div class="price-label">
                    <p>{{ minPrice }}</p>
                    <p>{{ maxPrice }}</p>
                </div>
            </div>
        </div>
        <div class="filter-item">
            <div class="filter-section-header">
                <h3>Rating</h3>
                <button class="toggle-button" @click="toggleFilter(1)">
                    <span v-if="isFilterOpen[1]"><i class="fa-solid fa-chevron-up"></i></span>
                    <span v-else><i class="fa-solid fa-chevron-down"></i></span>
                </button>
            </div>
            <div v-show="isFilterOpen[1]" class="price-range-container">
                <button v-for="value in 5" :key="value">
                    {{ value }}+
                </button>
            </div>
        </div>
        <div class="filter-item">
            <div class="filter-section-header">
                <h3>Freebies</h3>
                <button class="toggle-button" @click="toggleFilter(2)">
                    <span v-if="isFilterOpen[2]"><i class="fa-solid fa-chevron-up"></i></span>
                    <span v-else><i class="fa-solid fa-chevron-down"></i></span>
                </button>
            </div>
            <div v-show="isFilterOpen[2]" class="price-range-container">
                <div v-for="value in freebies" :key="value">
                    <input :id=value type="checkbox" :value="value" style="zoom:1.2;">
                    <label :for=value>{{ value }}</label>
                </div>
            </div>
        </div>
        <div class="filter-item">
            <div class="filter-section-header">
                <h3>Freebies</h3>
                <button class="toggle-button" @click="toggleFilter(3)">
                    <span v-if="isFilterOpen[3]"><i class="fa-solid fa-chevron-up"></i></span>
                    <span v-else><i class="fa-solid fa-chevron-down"></i></span>
                </button>
            </div>
            <div v-show="isFilterOpen[3]" class="price-range-container">
                <div v-for="value in amenities" :key="value">
                    <input :id="value" type="checkbox" :value="value" style="zoom:1.2;">
                    <label :for=value>{{ value }}</label>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import noUiSlider from "nouislider";
import "nouislider/dist/nouislider.css";

const freebies = ref(['조식포함', '무료주차', 'WIFI', '공항셔틀버스', '무료취소']);
const amenities = ref(['24시 프론트데스크', '에어컨', '피트니스', '수영장']);
const isFilterOpen = ref([true, true, true, true]);
const slider = ref(null);
const minPrice = ref(50);
const maxPrice = ref(1200);

onMounted(() => {
  noUiSlider.create(slider.value, {
    start: [minPrice.value, maxPrice.value],
    connect: true,
    range: {
      min: 0,
      max: 2000,
    },
  });

  // update 이벤트로 값 반영
  slider.value.noUiSlider.on("update", (values) => {
    minPrice.value = `$${Math.round(values[0])}`;
    maxPrice.value = `$${Math.round(values[1])}`;
  });
});

// 토글 버튼 클릭 시
const toggleFilter = (num) => {
    isFilterOpen.value[num] = !isFilterOpen.value[num];
};
</script>

<style>

/* 필터 컨테이너 전체 스타일 */
.filter-main-container {
    border-radius: 8px;
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-right: 20px;
    padding: 5px 5px;
}

.filter-main-container h2 {
    font-size: 1.5em;
    color: #333;
    margin-bottom: 5px;
}

/* 각 필터 섹션(Price, Rating 등)의 컨테이너 */
.filter-item {
    width: 100%;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 15px;
}
.filter-title {
    width: 100%;
    text-align: left;
    padding-bottom: 15px;
}

/* 마지막 필터 섹션의 구분선 제거 */
.filter-main-container > div:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.filter-main-container .rating-buttons {
    display: flex;
    gap: 10px;
}

/* Rating 버튼 스타일 */
.filter-main-container button {
    padding: 8px 12px;
    border-color: #88f1cf;
    background: white;
    border-radius: 5px;
    margin-right: 10px;
    cursor: pointer;
    transition: background-color 0.3s, border-color 0.3s;
}

/* Rating 버튼 호버 및 클릭 시 스타일 */
.filter-main-container button:hover {
    background-color: #f0f0f0;
    border-color: #54f4c1;
}

.filter-main-container button:active,
.filter-main-container button.active {
    background-color: #4bb292;
    border-color: #4bb292;
}

.filter-main-container .checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

/* Checkbox와 Label 스타일 */
.filter-main-container input[type="checkbox"] {
    margin-right: 8px;
}

.filter-main-container label {
    cursor: pointer;
    color: #666;
    transition: color 0.3s;
}

.filter-main-container label:hover {
    color: #000;
}

/* 슬라이더(range) 스타일 */
.filter-main-container input[type="range"] {
    width: 100%;
}
/* 필터 섹션 헤더 (제목과 토글 버튼) */
.filter-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* 토글 버튼 스타일 */
.toggle-button {
    background: none;
    border: none;
    font-size: 1.2em;
    cursor: pointer;
    color: #555;
    padding: 0;
    transition: transform 0.2s;
}

.toggle-button span {
    display: block;
}
.price-label {
    display: flex;
    justify-content: space-between;
}

.price-values {
    display: flex;
    justify-content: space-between;
    font-size: 0.9em;
    color: #666;
    margin-top: 5px;
}

.noUi-target {
  border: none;
  box-shadow: none;
  width: 95%;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  margin: 0 auto;
}

.noUi-connect {
    background: black;
    height: 4px;
    border: none;
}
.noUi-connects {
    width: 100%;
}
.noUi-horizontal .noUi-handle,
.noUi-vertical .noUi-handle {
    width: 20px;
    height: 20px;
    border-radius: 50px;
    background: #6fcf97; 
    cursor: grab;
}
.noUi-handle::before,
.noUi-handle::after {
  display: none;
}
</style>