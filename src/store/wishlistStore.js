import { defineStore } from 'pinia';
import axios from '@/api/axios';

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    wishlistItems: [],
    wishlistIds: new Set(), //존재 여부만 빠르게 조회하기 위함
  }),

  getters: {
    isLiked: (state) => (hotelId) => {
      return state.wishlistIds.has(hotelId);
    },
  },

  actions: {
    async delete(hotelId) {
        try {
            await axios.delete(`http://localhost:8888/api/mypage/deletewish`, {data: {"hotelId":hotelId}});
            this.wishlistItems = this.wishlistItems.filter(item => String(item.contentId) !== String(hotelId));
            this.wishlistIds.delete(hotelId);
        } catch (error) {
            console.log(error)
        }
    },
    async fetchWishlist() {
        try {
            const response = await axios.get(`http://localhost:8888/api/mypage/wishs`);
            this.wishlistItems = response.data;
            this.wishlistIds = new Set(response.data.map(item => item.contentId));
        } catch (error) {
            console.log(error)
        }
    },

    async toggleWish(hotelId) {
      try {
        if (this.isLiked(hotelId)) {
          this.delete(hotelId);
        } else {
          await axios.post(`http://localhost:8888/api/mypage/savewish`, {"hotelId":hotelId});
          this.wishlistIds.add(hotelId); 
        }
      } catch (error) {
        console.error('찜하기 상태 변경에 실패했습니다.', error);
      }
    },
  },
  persist: true,
});