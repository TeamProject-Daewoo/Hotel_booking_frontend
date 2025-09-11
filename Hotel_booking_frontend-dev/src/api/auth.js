// src/stores/auth.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    const accessToken = ref(null);
    const isInitialized = ref(false);

    function setToken(token) {
        accessToken.value = token;
    }

    function clearToken() {
        accessToken.value = null;
    }

     function setInitialized() {
        isInitialized.value = true;
    }

    return { accessToken, isInitialized, setToken, clearToken, setInitialized };
});