import { useWishlistStore } from '@/store/wishlistStore';
import { defineStore } from 'pinia';
import api from '@/api/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    loggedInUser: null,
    userName: null,
    loginType: null,
    isInitialized: false,
    phoneNumber: null,
    points: 0,
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
      this.points = payload?.points || null;
    },
    logout() {
      this.accessToken = null;
      this.loggedInUser = null;
      this.userName = null;
      this.phoneNumber = null;
      this.points = 0;

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
    async fetchAndUpdatePoints() {
      if (!this.isLoggedIn) return; // 로그인 상태가 아니면 실행하지 않음

      try {
        // 서버에 현재 사용자 프로필 정보를 요청합니다.
        const response = await api.get('/api/mypage/profile');
        const userProfile = response.data;

        if (userProfile && typeof userProfile.point !== 'undefined') {
          this.points = userProfile.point; // 스토어의 points 값을 최신화합니다.
        }
      } catch (error) {
        console.error('포인트 정보를 가져오는 데 실패했습니다:', error);
      }
    },
  },
});