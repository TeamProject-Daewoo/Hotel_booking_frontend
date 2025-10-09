<template>
    <div class="search-main-container">
        <div class="field-container" id="distinationForm">
            <label for="destination">목적지</label>
            <div class="destination-input-form">
                <span><i class="fa-solid fa-hotel"></i>&nbsp;</span>
                <span><KeyWordForm/></span>
            </div>
        </div>

        <div class="field-container" id="dateForm">
            <label for="checkIn">날짜</label>
            <button class="search-input input-gap" id="checkIn" @click="openModal('datePicker')">
                <span>{{ checkInDateView }} ~ {{ checkOutDateView }} · {{ getDaysDifference(searchStore.checkInDate, searchStore.checkOutDate) }}박</span>
                <span><i class="fa-solid fa-calendar-days"></i></span>
            </button>
        </div>
        <div class="field-container" id="guestSelectForm">
            <label for="guestSelect">인원 수</label>
            <div class="destination-input-form" id="guestSelect">
                <span><i class="fa-solid fa-user"></i>&nbsp;</span>
                <span><GuestSelectForm/></span>
            </div>
        </div>
        <div class="search-button-container">
            <button class="search-button" @click="handleSearch"><i class="fa-solid fa-magnifying-glass search-icon"></i></button>
        </div>
        <SearchModal :isOpen="isModalOpen" @close="closeModal">
            <div v-if="modalType === 'datePicker'">
                <h2>날짜 선택</h2>
                <DatePicker 
                    :initialCheckIn="searchStore.checkInDate"
                    :initialCheckOut="searchStore.checkOutDate"
                    @range-selected="setDate"
                />
            </div>
        </SearchModal>
    </div>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue';
import SearchModal from './SearchModal.vue';
import DatePicker from './DatePicker.vue';
import { useSearchStore } from '@/api/searchRequestStore';
import axios from '@/api/axios';
import _ from 'lodash';
import KeyWordForm from './KeyWordForm.vue';
import { useHistoryStore } from '@/store/recentHistoryStore';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import router from '@/router';
import { useUiStore } from '@/store/commonUiStore';
import GuestSelectForm from './GuestSelectForm.vue';

const searchStore = useSearchStore();
const historyStore = useHistoryStore();
const route = useRoute();

const isModalOpen = ref(false);
const modalType = ref('');

const tempGuestCount = ref(1);

// 날짜 포맷 함수
const formatDate = (date) => {
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = dayOfWeek[date.getDay()];
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${dayName} ${month}/${day}`;
};

const checkInDateView = ref(formatDate(searchStore.checkInDate));
const checkOutDateView = ref(formatDate(searchStore.checkOutDate));

const guestCountDown = () => {
    --tempGuestCount.value;
}

const openModal = (type) => {
    modalType.value = type;
    isModalOpen.value = true;
    if(type === 'guests') {
        tempGuestCount.value = searchStore.guestCount;
    }
};

const closeModal = () => {
    isModalOpen.value = false;
};
const save = () => {
    searchStore.guestCount = tempGuestCount.value;
    closeModal();
};
const setDate = (payload) => {
    searchStore.checkInDate = payload.start;
    searchStore.checkOutDate = payload.end;
    checkInDateView.value = formatDate(payload.start);
    checkOutDateView.value = formatDate(payload.end);
    searchStore.setDateRange(payload.start, payload.end);
    closeModal();
}
function getDaysDifference(date1, date2) {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

  return Math.floor((utc2 - utc1) / MS_PER_DAY);
}

const { inputData } = storeToRefs(searchStore);
onMounted(() => {
  if (route.query.from === 'main') {
    window.scrollTo({top: 0, behavior: 'smooth'});
    handleSearch();
  }
  //새로고침 시 재실행 방지
  const newQuery = { ...route.query };
  delete newQuery.from;
  router.replace({ query: newQuery }); 
});
const handleSearch = () => {
    if(inputData.value.trim() !== '') {
        searchStore.keyword = inputData.value;
        searchStore.fetchSearchResult();
        historyStore.addRecentSearch(inputData.value);
    }
    else {
        const uiStore = useUiStore();
        uiStore.openModal({title: '검색 실패', message: '호텔명 또는 지역명을 입력해주세요'});
    }
};
</script>
<style scoped>
.search-main-container {
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-bottom: 2rem;
    align-items: center;
    background-color: white;
    border-radius: 20px;
    box-shadow: 0px 0px 5px rgb(175, 175, 175);
    box-sizing: border-box;
    padding: 40px 20px;
}
.field-container {
    position: relative;
    border: 2px solid #a1a1a1;
    border-radius: 7px;
    padding: 0;
    height: 50px;
    margin-right: 20px;
    
}
.field-container label {
    position: absolute;
    top: -10px;
    left: 10px;
    background-color: #fff;
    padding: 0 5px;
    font-size: 12px;
    color: #555;
}
#distinationForm {
    width: 35%;
}
#destination {
    font-size: 15pt;
}
.destination-input-form {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 5px 10px;
    font-size: 15pt;
    background-color: white;
    box-sizing: border-box;
    border-radius: 10px;
}
.destination-input-form > span:last-child {
    flex: 1;
}
.destination-input-form span:last-child ::v-deep input {
  width: 100%;     
  border: none; 
  outline: none;
  font-size: 16px;
  background-color: transparent;
}
#dateForm {
    width: 30%;
}
.input-gap {
    align-items: center;
    display: flex;
    justify-content: space-between;
}
#guestSelectForm {
    width: 25%;
}
#guestSelect {
    margin: 0 auto;
    
}
.search-input {
    height: 100%;
    width: 100%;
    /* visibility: hidden; */
    border: none;
    padding: 5px 10px;
    font-size: 15pt;
    background-color: white;
    box-sizing: border-box;
    border-radius: 10px;
    text-align: left;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
}
.search-button-container {
    right: -10px;
    justify-content: right;
    align-items: center;
}
.search-button {
    padding: 15px 15px;
    border: none;
    border-radius: 8px;
    background-color: #62ceb8;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
    box-sizing: border-box;
}
.search-button:hover {
    background-color: #3df7b6;
}
.search-icon {
    color: black;
}

.raw-content {
    display: flex;
    flex-direction: column;
    padding: 10px;
}

.distination-form h2 {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
    margin-top: 0;
    margin-bottom: 5px;
}

.distination-form button {
    width: 100%;
    padding: 12px;
    background-color: #42b983;
    color: white;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
    position: absolute;
    bottom: 0;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
}

.distinationForm button:hover {
    background-color: #35a472; 
}

.guests-form-container {
    display: flex;
    flex-direction: column;
    gap: 25px;
    padding: 10px;
}

.guests-form-container h2 {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
    margin-top: 0;
    margin-bottom: 5px;
    text-align: left;
}

.guest-item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.guest-item span:first-child {
    font-size: 1.1rem;
    color: #555;
    font-weight: 600;
}

.guest-submit-btn {
    width: 100%;
    height: 70px;
    bottom: 0px;
    left: 0px;
    position: absolute;
    border-radius: 8px;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    background-color:#68be97;
    color: white;
    font-size: 15pt;
    border: none;
    cursor: pointer;
}

.counter-box {
    display: flex;
    align-items: center;
    gap: 10px;
}

.counter-box span {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  min-width: 25px;
  text-align: center;
}

.counter-box button {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  font-size: 1.5rem;
  font-weight: 500;
  color: #555;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
.counter-box button:disabled {
  background-color: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
  opacity: 0.7;
}

.counter-box button:hover {
  background-color: #e0e0e0;
  border-color: #ccc;
}

.counter-box button:active {
  background-color: #dcdcdc;
}

img {
    max-width: 100px;
    height: auto;
    border-radius: 4px;
}

.raw-content {
    display: flex;
    flex-direction: column;
}
</style>