// src/router/index.js
import Main from '@/components/Main.vue'
import SearchView from '@/components/SearchView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import MypageView from "@/views/MypageView.vue";

const routes = [
  {path: "/", name: "main", component: Main},
  {path: "/search", name: "search", component: SearchView},
  {path: "/mypage", name: "mypage", component: MypageView}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
