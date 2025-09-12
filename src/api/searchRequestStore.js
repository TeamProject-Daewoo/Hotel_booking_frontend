import { defineStore } from 'pinia';
import { ref } from 'vue';

//백엔드에 넘길 데이터 전역으로 관리
export const useSearchStore = defineStore('search', () => {
  //InputForm
  const keyword = ref('');
  const d = new Date();
  const checkInDate = ref(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
  const checkOutDate = ref(new Date());
  const roomCount = ref(1);
  const guestCount = ref(1);

  // FilterForm
  const minPrice = ref(0);
  const maxPrice = ref(500000);
  const rating = ref(1);
  const freebies = ref({'조식포함':false, '무료주차':false, 'WIFI':false, '공항셔틀버스':false, '무료취소':false});
  const amenities = ref({'24시 프론트데스크':false, '에어컨':false, '피트니스':false, '수영장':false});

  //ResultForm
  const order = ref('Recommended');
  const place = ref('Hotels');

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
      place: place.value
    };
  };

  //요소 접근
  return {
    minPrice,
    maxPrice,
    rating,
    freebies,
    amenities,
    keyword,
    checkInDate,
    checkOutDate,
    roomCount,
    guestCount,
    order,
    place,
    getRequestPayload
  };
});