import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import '@fortawesome/fontawesome-free/css/all.css'; 

createApp(App)
  .use(router)  // 라우터를 사용하도록 설정
  .mount('#app');