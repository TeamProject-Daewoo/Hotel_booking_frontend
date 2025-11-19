import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from '@/api/axios';
import { useUiStore } from '@/store/commonUiStore';
import { result, size } from 'lodash';

function formatDateToLocalISO(date) {
  if (!(date instanceof Date) || isNaN(date)) {
    return null;
  }
  return date.toLocaleDateString("sv-SE");
}

export const useSearchStore = defineStore('search', {

  state: () => {
    const d = new Date();
    const checkInDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const checkOutDate = new Date(new Date().setDate(d.getDate() + 1));

    //백엔드에 넘길 데이터 전역으로 관리
    return {
      // InputForm
      inputData: '',
      keyword: '',
      suggestions: [],
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      guestCount: 2,

      // FilterForm
      minPrice: 0,
      maxPrice: 400000,
      rating: 0,
      amenities: { "주차가능": false, "수영장": false, "세미나": false, "스포츠시설": false, "바베큐": false, "캠프파이어": false, "휴게시설": false, "사우나": false, "피트니스": false, "계곡": false, "대중탕": false },
      freebies: { "욕실": false, "욕조": false, "세면도구제공": false, "홈시어터": false, "에어컨": false, "Tv": false, "Pc": false, "Wifi": false, "냉장고": false, "취사가능": false },

      // ResultForm
      order: '인기 순',
      category: '모두',
      result: null,
      isLoading: false,
      isLastPage: false,
      error: null,

      page: 1,
      size: 10
    };
  },

  getters: {
    // 요청에 필요한 전체 데이터를 객체로 반환
    getRequestPayload: (state) => ({
      keyword: state.keyword,
      checkInDate: state.checkInDate,
      checkOutDate: state.checkOutDate,
      guestCount: state.guestCount,
      minPrice: state.minPrice,
      maxPrice: state.maxPrice,
      rating: state.rating,
      freebies: state.freebies,
      amenities: state.amenities,
      order: state.order,
      category: state.category,
      page: state.page,
      size: state.size
    }),

    // 날짜를 "YYYY-MM-DD" 형식의 문자열로 변환
    checkInDateISO: (state) => formatDateToLocalISO(state.checkInDate),
    checkOutDateISO: (state) => formatDateToLocalISO(state.checkOutDate),
  },

  actions: {
    async fetchInitialSearch() {
      const uiStore = useUiStore();
      if (this.keyword.trim() === '') {
          uiStore.openModal({title: '검색 실패', message:'호텔명 또는 지역명을 입력해주세요'});
          return;
      }
      this.page = 1;
      this.result = null;
      this.isLastPage = false;
      this.isLoading = true;
      
      await this.fetchSearchResult(); 
    },
    async fetchSearchResult() {
      const uiStore = useUiStore();
      if (this.keyword.trim() === '') {
        uiStore.openModal({title: '검색 실패', message:'호텔명 또는 지역명을 입력해주세요'});
        return;
      }

      this.error = null;
      const search_post_url = `${import.meta.env.VITE_API_URL}/api/search`;
      try {
        const response = await axios.post(search_post_url, this.getRequestPayload);
        this.page++;
        if(this.result === null) {
          this.result = response;
          return;
        }
        if (this.result.data.searchCards.length >= this.result.data.counts[this.category]) {
          this.isLastPage = true;
          return;
        }
        const existingCards = this.result?.data.searchCards;
        const newCards = response.data.searchCards || [];
        
        //기존 데이터에 추가
        this.result = {
          data: {
            ...response.data,
            searchCards: [...existingCards, ...newCards]
          }
        };
      } catch (e) {
        this.error = '데이터를 불러오는 데 실패했습니다.';
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    },

    // 입실/퇴실 날짜 설정
    setDateRange(newCheckIn, newCheckOut) {
      this.checkInDate = newCheckIn;
      this.checkOutDate = newCheckOut;
    },

    // "YYYY-MM-DD" 형식의 문자열을 받아 Date 객체로 변환하여 state 업데이트
    setCheckInDateFromISO(val) {
      if (val) this.checkInDate = new Date(val);
    },
    setCheckOutDateFromISO(val) {
      if (val) this.checkOutDate = new Date(val);
    },

    // 상세 정보 가져오기
    getRoomDetails(contentId, checkIn, checkOut) {
      return axios.get(`/api/tour/detail/db/content/${contentId}`, {
        params: {
          checkIn: checkIn,
          checkOut: checkOut
        }
      });
    },
  },
});