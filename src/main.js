// src/main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './api/auth'; // 경로 확인 필요

// const app = createApp(App);
const pinia = createPinia();

// app.use(pinia);

// Pinia 스토어를 먼저 활성화합니다.
// const authStore = useAuthStore();

// 앱이 마운트되기 전에 토큰 재발급을 먼저 시도하고, 완료되면 라우터를 마운트합니다.
// authStore.reissueToken().then(() => {
//     app.use(router);
//     app.mount('#app');
// });

createApp(App).use(pinia).use(router).mount('#app');