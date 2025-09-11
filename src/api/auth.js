import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    loggedInUser: null,
    isInitialized: false,
  }),
  actions: {
    setToken(token) {
      this.accessToken = token;
      this.loggedInUser = this.parseJwt(token)?.sub || null;
    },
    logout() {
      this.accessToken = null;
      this.loggedInUser = null;
    },
    parseJwt(token) {
      try {
        return JSON.parse(atob(token.split('.')[1]));
      } catch (e) {
        return null;
      }
    },
    setInitialized() {
      this.isInitialized = true;
    },
  },
});