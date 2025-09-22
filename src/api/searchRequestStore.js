import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from '@/api/axios';

//백엔드에 넘길 데이터 전역으로 관리
export const useSearchStore = defineStore('search', () => {
  
  //InputForm
  const inputData = ref('');    //현재 입력된 정보
  const keyword = ref('');      //최종 확정 키워드
  const suggestions = ref([]);
  const d = new Date();
  const checkInDate = ref(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
  const checkOutDate = ref(new Date(d.setDate(d.getDate()+1)));
  const roomCount = ref(1);
  const guestCount = ref(2);

  // FilterForm
  const minPrice = ref(0);
  const maxPrice = ref(400000);
  const rating = ref(0);
  const amenities = ref({
    "주차가능":false,       //parkinglodging
    "수영장": false,        //subfacility, 
    "세미나": false,        //subfacility, seminar
    "스포츠시설": false,    //subfacility, sports
    "바베큐": false,        //subfacility, barbecue
    "캠프파이어": false,    //subfacility, campfire
    "휴게시설": false,      //subfacility
    "사우나": false,        //subfacility, sauna
    "피트니스": false,      //subfacility, fitness
    "계곡": false,          //subfacility
    "대중탕": false         //publicbath
  });
  const freebies = ref({
    "욕실": false,          // roombathfacility
    "욕조": false,          // roombath
    "세면도구제공": false,  // roomtoiletries
    "홈시어터": false,      // roomhometheater
    "에어컨": false,        // roomaircondition
    "Tv": false,            // roomtv
    "Pc": false,            // roompc
    "Wifi": false,          // roominternet
    "냉장고": false,        // roomrefrigerator
    "취사가능": false,      // roomcook
  });
  //ResultForm
  const order = ref('인기 순');
  const category = ref('All');

  //객체 호출 함수
  const getRequestPayload = () => {
    return {
      keyword: keyword.value,
      checkInDate: checkInDate.value,
      checkOutDate: checkOutDate.value,
      roomCount: roomCount.value,
      guestCount: guestCount.value,
      minPrice: minPrice.value,
      maxPrice: maxPrice.value,
      rating: rating.value,
      freebies: freebies.value,
      amenities: amenities.value,
      order: order.value,
      category: category.value
    };
  };

  const result = ref(null);
  const isLoading = ref(false);
  const error = ref(null);
  const search_post_url = `${import.meta.env.VITE_API_URL}/api/search`;

  const fetchSearchResult = async () => {
    // console.log(result);
      if(keyword.value.trim() == '') {
        alert('호텔명이나 지역을 입력해주세요');
        return;
      }
      isLoading.value = true;
      error.value = null;
      try {
          result.value = await axios.post(search_post_url, getRequestPayload());
      } catch (e) {
          error.value = '데이터를 불러오는 데 실패했습니다.';
          console.error(e);
      } finally {
          isLoading.value = false;
      }
  };

  //요소 접근
  return {
    minPrice,
    maxPrice,
    rating,
    freebies,
    amenities,
    inputData,
    keyword,
    suggestions,
    checkInDate,
    checkOutDate,
    roomCount,
    guestCount,
    order,
    category,
    result,
    isLoading,
    error,
    fetchSearchResult,
    getRequestPayload
  };
});