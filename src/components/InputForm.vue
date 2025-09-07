<template>
    <div class="search-main-container">
        <div class="field-container" id="distinationForm">
            <label for="destination">Enter Destination</label>
            <div class="destination-input-form">
                <span><i class="fa-solid fa-hotel"></i>&nbsp;</span>
                <span><input id="destination" type="text" placeholder="호텔명 또는 지역 입력"></span>
            </div>
        </div>
        <div class="field-container" id="checkInForm">
            <label for="checkIn">Check In</label>
            <button class="search-input input-gap" id="checkIn" @click="openModal('checkIn')">
                <span>{{ checkInDate }}</span>
                <span><i class="fa-solid fa-calendar-days"></i></span>
            </button>
        </div>
        <div class="field-container" id="checkOutForm">
            <label for="checkOut">Check Out</label>
            <button class="search-input input-gap" id="checkOut" @click="openModal('checkOut')">
                <span>{{ checkOutDate }}</span>
                <span><i class="fa-solid fa-calendar-days"></i></span>
            </button>
        </div>
        <div class="field-container" id="guestSelectForm">
            <label for="guestSelect">Rooms & Guests</label>
            <button class="search-input input-gap" id="guestSelect" @click="openModal('guests')">
                <span><i class="fa-solid fa-user"></i>&nbsp;{{ roomCount }} room, {{ guestCount }} guests</span>
                <span><i class="fa-solid fa-chevron-down"></i></span>
            </button>
        </div>
        <div class="search-button-container">
            <button class="search-button" @click="search"><i class="fa-solid fa-magnifying-glass search-icon"></i></button>
        </div>
        <SearchModal :isOpen="isModalOpen" @close="closeModal">
            <div v-if="modalType === 'checkIn'">
                <h2>체크인 날짜 선택</h2>
                <DatePicker @select-date="handleDateSelect" />
            </div>
            <div v-if="modalType === 'checkOut'">
                <h2>체크아웃 날짜 선택</h2>
                <DatePicker @select-date="handleDateSelect" />
            </div>
            <div v-if="modalType === 'guests'" class="guests-form-container">
                <h2>인원 및 객실 개수</h2>
                <div class="guest-item">
                    <span>객실 수</span>
                    <div class="counter-box">
                        <button 
                            @click="tempRoomCount--"
                            :disabled="tempRoomCount <= 1"
                        >-</button>
                        <span>{{ tempRoomCount }}</span>
                        <button @click="tempRoomCount++">+</button>
                    </div>
                </div>
                <div class="guest-item">
                    <span>인원 수</span>
                    <div class="counter-box">
                        <button 
                            @click="tempGuestCount--"
                            :disabled="tempGuestCount <= 1"
                        >-</button>
                        <span>{{ tempGuestCount }}</span>
                        <button @click="tempGuestCount++">+</button>
                    </div>
                </div>
                <button class="guest-submit-btn" @click="save">적용하기 (객실: {{ tempRoomCount }}, 인원: {{ tempGuestCount }})</button>
            </div>
        </SearchModal>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import SearchModal from './SearchModal.vue';
import DatePicker from './DatePicker.vue';

const isModalOpen = ref(false);
const modalType = ref('');

const destination = ref('호텔명, 지역');
const checkIn = ref();
const checkOut = ref('');

const tempRoomCount = ref(1);
const tempGuestCount = ref(1);
const roomCount = ref(1);
const guestCount = ref(1);

const emit = defineEmits(['search-trigger']);
const search = () => {
    //백엔드 호출
    const response = [
        {'contentid':'143017', 'title':'가보호텔', 'image':'http://tong.visitkorea.or.kr/cms/resource/83/1942883_image2_1.jpg', 'price':'240000', 'address':'경기도 평택시 평택5로76번길 18-10', 'rating':'4.5', 'totalAminities':'20', 'totalReviews':'371'},
        {'contentid':'1865597', 'title':'가람초연재', 'image':'http://tong.visitkorea.or.kr/cms/resource/48/2993048_image2_1.jpg', 'price':'145000', 'address':'경상북도 안동시 풍천면 하회종가길 76-6', 'rating':'4.3', 'totalAminities':'10', 'totalReviews':'140'},
        {'contentid':'1896032', 'title':'가름게스트하우스', 'image':'http://tong.visitkorea.or.kr/cms/resource/88/3516088_image2_1.JPG', 'price':'183000', 'address':'제주특별자치도 서귀포시 법환하로9번길 10', 'rating':'4.4', 'totalAminities':'16', 'totalReviews':'200'}
    ];
    emit('search-trigger', response);
}
// 날짜 포맷 함수
const formatDate = (date) => {
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = dayOfWeek[date.getDay()];
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${dayName} ${month}/${day}`;
};
//초기는 현재 날짜
const checkInDate = ref(formatDate(new Date()));
const checkOutDate = ref(formatDate(new Date()));

const checkDate = (date, curDate, isCheckIn) => {
    const [month, day] = formatDate(date).substring(2).split("/");
    const [curMonth, curDay] = curDate.substring(2).split("/");
    const date1 = new Date(month, day).getTime();
    const date2 = new Date(curMonth, curDay).getTime();
    if(isCheckIn) return date1 > date2 ? true : false; 
    else return date1 < date2 ? true : false; 
}
// 날짜 선택 핸들러
const handleDateSelect = (date) => {
    if (modalType.value === 'checkIn') {
        // 체크아웃 날짜가 체크인 날짜보다 이전이면 초기화
        if (checkOutDate.value && checkDate(date, checkOutDate.value, true))
            checkOutDate.value = null;
        checkInDate.value = formatDate(date);
    } else if (modalType.value === 'checkOut') {
        // 체크인 날짜보다 이전 날짜를 선택할 수 없게 함
        if (checkInDate.value && checkDate(date, checkInDate.value, false)) {
            alert('체크아웃 날짜는 체크인 날짜보다 이전일 수 없습니다.');
            return;
        }
        checkOutDate.value = formatDate(date);
    }
    closeModal();
};

const openModal = (type) => {
    modalType.value = type;
    isModalOpen.value = true;
    if(type === 'guests') {
        tempGuestCount.value = guestCount.value;
        tempRoomCount.value = roomCount.value;
    }
};

const closeModal = () => {
    isModalOpen.value = false;
};
const save = () => {
    guestCount.value = tempGuestCount.value;
    roomCount.value = tempRoomCount.value;
    closeModal();
};

// 각 필드에 값을 설정하는 예시 함수
const selectDestination = (value) => {
    destination.value = value;
    closeModal();
};

const selectDate = (value) => {
    if (modalType.value === 'checkIn') {
        checkIn.value = value;
    } else if (modalType.value === 'checkOut') {
        checkOut.value = value;
    }
    closeModal();
};

const options = {
    "전국":"",
    "서울":"1",
    "인천":"2",
    "대전":"3",
    "대구":"4",
    "광주":"5",
    "부산":"6",
    "울산":"7",
    "세종":"8",
    "경기도":"31",
    "강원도":"32",
    "충청북도":"33",
    "충청남도":"34",
    "경상북도":"35",
    "경상남도":"36",
    "전라북도":"37",
    "전라남도":"38",
    "제주도":"39"
}
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
    width: 100%;
    height: 100%;
    /* visibility: hidden; */
    padding: 5px 10px;
    font-size: 15pt;
    background-color: white;
    box-sizing: border-box;
    border-radius: 10px;
}
.destination-input-form span:nth-child(2) {
    flex-grow: 1;
}
.destination-input-form input {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
}
#checkOutForm, #checkInForm {
    width: 20%;
}
.input-gap {
    align-items: center;
    display: flex;
    justify-content: space-between;
}
#guestSelectForm {
    width: 25%;
}
.search-input {
    width: 100%;
    height: 100%;
    /* visibility: hidden; */
    border: none;
    padding: 5px 10px;
    font-size: 15pt;
    background-color: white;
    box-sizing: border-box;
    border-radius: 10px;
    text-align: left;
    cursor: pointer;
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
    height: 50px;
    bottom: 0px;
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