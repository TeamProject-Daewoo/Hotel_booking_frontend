import { useWishlistStore } from '@/store/wishlistStore';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    loggedInUser: null,
    userName: null,
    loginType: null,
    isInitialized: false,
    phoneNumber: null,
  }),
  getters: {
    //로그인 여부 확인
    isLoggedIn: (state) => !!state.accessToken,
  },
  actions: {
    setToken(token) {
      this.accessToken = token;

      const payload = this.parseJwt(token);

      console.log('setToken### : ', payload)
      
      this.loggedInUser = payload?.sub || null;
      this.userName = payload?.name || null;
      this.loginType = payload?.loginType || null;
      this.phoneNumber = payload?.phoneNumber || null;
    },
    logout() {
      this.accessToken = null;
      this.loggedInUser = null;
      this.userName = null;
      this.phoneNumber = null;

      //찜목록 초기화
      const wishlistStore = useWishlistStore();
      wishlistStore.$reset();
    },
    parseJwt(token) {
      if (!token) {
        return null;
      }
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        
        // UTF-8 디코딩을 지원하는 방식으로 수정
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(function (c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
        );

        return JSON.parse(jsonPayload);
      } catch (e) {
        console.error("Invalid JWT token provided:", e);
        return null;
      }
    },
    setInitialized() {
      this.isInitialized = true;
    },
  },
});