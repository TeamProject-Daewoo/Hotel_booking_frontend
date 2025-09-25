<template>
    <div class="filter-main-container">
        <div class="filter-title">
            <h2>필터</h2>
        </div>
        <div class="filter-item">
            <div class="filter-section-header">
                <h3>가격 범위</h3>
                <button class="toggle-button" @click="toggleFilter(0)">
                    <span v-if="isFilterOpen[0]"><i class="fa-solid fa-chevron-up"></i></span>
                    <span v-else><i class="fa-solid fa-chevron-down"></i></span>
                </button>
            </div>
            <div v-show="isFilterOpen[0]" class="price-range-container" style="width: 100%;">
                <div @change="handleSearch" ref="slider"></div>
                <div class="price-label">
                    <div class="input-group" @click="focusInputPrice(minPriceInput)">
                        <label for="min-price">최소</label>
                        <div class="price-input-wrapper">
                            <input
                            id="min-price"
                            ref="minPriceInput"
                            :value="formattedMinPrice"
                            type="text"
                            @input="onMinInput"
                            @keyup.enter="updatePrice('min')"
                            @blur="updatePrice('min')"
                            class="price-input"
                            />
                        </div>
                    </div>

                    <div class="separator">~</div>

                    <div class="price-label">
                        <div class="input-group" @click="focusInputPrice(maxPriceInput)">
                            <label for="max-price">최대</label>
                            <div class="price-input-wrapper">
                                <input
                                id="max-price"
                                ref="maxPriceInput"
                                :value="formattedMaxPrice"
                                type="text"
                                @input="onMaxInput"
                                @keyup.enter="updatePrice('max')"
                                @blur="updatePrice('max')"
                                class="price-input"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="filter-item">
            <div class="filter-section-header">
                <h3>평점</h3>
                <button class="toggle-button" @click="toggleFilter(1)">
                    <span v-if="isFilterOpen[1]"><i class="fa-solid fa-chevron-up"></i></span>
                    <span v-else><i class="fa-solid fa-chevron-down"></i></span>
                </button>
            </div>
            <div v-show="isFilterOpen[1]" class="rating-container">
                <button v-for="value in ratingCounts" :key="value"
                    @click="clickRatingButton(searchStore.rating === value ? 0 : value)"
                    :class="{ 'active-rating': searchStore.rating === value }">
                    <i class="fa-solid fa-star"></i> {{ value }}+
                </button>
            </div>
        </div>
        <div class="filter-item">
            <div class="filter-section-header">
                <h3>편의시설</h3>
                <button class="toggle-button" @click="toggleFilter(3)">
                    <span v-if="isFilterOpen[3]"><i class="fa-solid fa-chevron-up"></i></span>
                    <span v-else><i class="fa-solid fa-chevron-down"></i></span>
                </button>
            </div>
            <div v-show="isFilterOpen[3]" class="amenities-container">
                <div v-for="(value, key) in searchStore.amenities" :key="key">
                    <input :id="key" type="checkbox" :value="key" @change="handleSearch" v-model="searchStore.amenities[key]" style="zoom:1.2;">
                    <label :for=key>{{ key }}</label>
                </div>
            </div>
        </div>
        <div class="filter-item">
            <div class="filter-section-header">
                <h3>객실 내 편의시설</h3>
                <button class="toggle-button" @click="toggleFilter(2)">
                    <span v-if="isFilterOpen[2]"><i class="fa-solid fa-chevron-up"></i></span>
                    <span v-else><i class="fa-solid fa-chevron-down"></i></span>
                </button>
            </div>
            <div v-show="isFilterOpen[2]" class="amenities-container">
                <div v-for="(value, key) in searchStore.freebies" :key="key">
                    <input :id=key type="checkbox" :value="key" @change="handleSearch" v-model="searchStore.freebies[key]" style="zoom:1.2;">
                    <label :for=key>{{ key }}</label>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import noUiSlider from "nouislider";
import "nouislider/dist/nouislider.css";
import { useSearchStore } from '@/api/searchRequestStore';

const searchStore = useSearchStore();

const isFilterOpen = ref([true, true, true, true]);
const slider = ref(null);
let sliderInstance = null;
const minPriceSlider = ref(null);
const ratingCounts = [2, 2.5, 3, 3.5, 4, 4.5]

const currentMinPrice = ref(0);
const currentMaxPrice = ref(0);
//백엔드에 api 호출
const handleSearch = () => {
    editedMinPrice.value = currentMinPrice.value;
    editedMaxPrice.value = currentMaxPrice.value;
    if(searchStore.result != null)
        searchStore.fetchSearchResult();
};

const focusInputPrice = (input) => {
  if (input) {
    input.focus();
  }
};

//소수점 단위로 끊어서 반환 @input
const formattedMinPrice = computed(() => {
  return editedMinPrice.value?.toLocaleString('ko-KR') ?? '';
});

const onMinInput = (event) => {
  const { value, selectionStart } = event.target;
  const originalLength = value.length;

  const pureNumber = Number(value.replace(/[^0-9]/g, ''));
  editedMinPrice.value = pureNumber;

  nextTick(() => {
    const newFormattedValue = formattedMinPrice.value;
    const lengthDifference = newFormattedValue.length - originalLength;
    const newCursorPosition = selectionStart + lengthDifference;
    minPriceInput.value.setSelectionRange(newCursorPosition, newCursorPosition);
    minPriceInput.value.value = newFormattedValue;
  });
};

//소수점 단위로 끊어서 반환 @input
const formattedMaxPrice = computed(() => {
  return editedMaxPrice.value?.toLocaleString('ko-KR') ?? '';
});

const onMaxInput = (event) => {
  const { value, selectionStart } = event.target;
  const originalLength = value.length;

  const pureNumber = Number(value.replace(/[^0-9]/g, ''));
  editedMaxPrice.value = pureNumber;

  nextTick(() => {
    const newFormattedValue = formattedMaxPrice.value;
    const lengthDifference = newFormattedValue.length - originalLength;
    const newCursorPosition = selectionStart + lengthDifference;

    maxPriceInput.value.setSelectionRange(newCursorPosition, newCursorPosition);
    maxPriceInput.value.value = newFormattedValue;
  });
};


onMounted(() => {
    sliderInstance = noUiSlider.create(slider.value, {
        start: [searchStore.minPrice, searchStore.maxPrice],
        connect: true,
        range: {
            min: 0,
            max: 500000
        },
        step: 1000,
    });

    // update 이벤트로 값 반영
    slider.value.noUiSlider.on("update", (values) => {
        currentMinPrice.value = Number(Math.round(values[0]));
        currentMaxPrice.value = Number(Math.round(values[1]));
    });
    //onchange 등록
    slider.value.noUiSlider.on('change', (values) => {
      searchStore.minPrice = Number(parseInt(values[0]));
      searchStore.maxPrice = Number(parseInt(values[1]));
      handleSearch();
    });

  
});

// 토글 버튼 클릭 시
const toggleFilter = (num) => {
    isFilterOpen.value[num] = !isFilterOpen.value[num];
};

function clickRatingButton(value) {
    searchStore.rating = value;
    if(searchStore.result != null)
        searchStore.fetchSearchResult();
}

const isMinPriceEditing = ref(false);
const isMaxPriceEditing = ref(false);

const minPrice = 0;
const maxPrice = 500000;
// 편집 중인 값을 임시로 저장하는 변수
const editedMinPrice = ref(0);
const editedMaxPrice = ref(400000);

const minPriceInput = ref(null);
const maxPriceInput = ref(null);

const updatePrice = (type) => {
  if (type === 'min') {
    if (editedMinPrice.value > searchStore.maxPrice) {
      editedMinPrice.value = searchStore.maxPrice;
    }
    searchStore.minPrice = editedMinPrice.value;
    isMinPriceEditing.value = false;
  } else {
    if (editedMaxPrice.value < searchStore.minPrice) {
      editedMaxPrice.value = searchStore.minPrice;
    }
    searchStore.maxPrice = editedMaxPrice.value;
    isMaxPriceEditing.value = false;
  }
  editedMinPrice.value = Math.max(editedMinPrice.value, minPrice);
  editedMaxPrice.value = Math.min(editedMaxPrice.value, maxPrice);
};
watch(
  () => [searchStore.minPrice, searchStore.maxPrice],
  ([newMin, newMax]) => {
    if (sliderInstance) {
      // 현재 슬라이더 값과 스토어 값이 다를 때만 업데이트 (무한 루프 방지)
      const currentSliderValues = sliderInstance.get();
      if (currentSliderValues[0] !== newMin || currentSliderValues[1] !== newMax) {
          sliderInstance.set([newMin, newMax]);
      }
    }
  }
);
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
.filter-main-container button.active-rating {
    background: #dbffea;          
    border-color: #54f4c1;
}

/* Rating 버튼 호버 및 클릭 시 스타일 */
.filter-main-container button:hover {
    background-color: #dbffea;
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

.rating-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.amenities-container {
    display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
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

.input-group {
  display: flex;
  justify-content: left;
  width: 100px;
  text-align: left;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 10px;
  margin-top: 10px;
  padding: 5px 10px;
  cursor: pointer;
}
.input-group label {
  font-size: 14px;
  color: #838383;
  margin-bottom: 5px; /* 라벨과 입력창 사이의 간격 */
}
.separator {
  font-size: 20px;
  color: #888;
  margin-top: 30px; /* 입력창 높이와 맞추기 위한 여백 */
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
.price-input-wrapper {
  position: relative;
  display: flex;
}

.price-input {
  height: 100%;
  text-align: left;
  outline: none;
  width: 100px;
  border: none;
  font-size: 16px;
  box-sizing: border-box;
  cursor: pointer;
}
.price-input::before {
    content: "원";
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
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