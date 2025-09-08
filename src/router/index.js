// src/router/index.js
import Main from '@/components/Main.vue'
import SearchView from '@/components/SearchView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ProfileView from '@/views/ProfileView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import MypageView from "@/views/MypageView.vue";

const routes = [
  {path: "/", name: "main", component: Main},
  {path: "/search", name: "search", component: SearchView},
  {path: "/mypage", name: "mypage", component: MypageView},
  {path: "/login", name: "login", component: LoginView},
  {path: "/register", name: "register", component: RegisterView},
  {path: "/profile", name: "profile", component: ProfileView}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
