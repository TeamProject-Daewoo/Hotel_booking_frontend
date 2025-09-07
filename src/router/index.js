// src/router/index.js
import Main from '@/components/Main.vue'
import SearchView from '@/components/SearchView.vue'
import LoginView from '@/components/LoginView.vue'
import RegisterView from '@/components/RegisterView.vue'
import ProfileView from '@/components/ProfileView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {path: "/", name: "main", component: Main},
  {path: "/search", name: "search", component: SearchView},
  {path: "/login", name: "login", component: LoginView},
  {path: "/register", name: "register", component: RegisterView},
  {path: "/profile", name: "profile", component: ProfileView}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
