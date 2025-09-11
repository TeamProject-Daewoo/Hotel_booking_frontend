// src/router/index.js
import Main from '@/components/Main.vue'

import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ProfileView from '@/views/ProfileView.vue'
import SearchView from '@/views/SearchView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import FailPage from '../components/toss/fail.vue';
import SuccessPage from '../components/toss/success.vue';
import Checkout from "@/views/checkout.vue";
import ReservationForm from "@/views/ReservationForm.vue";
import MypageView from "@/views/MypageView.vue"
import PlaceDetailView from '@/views/PlaceDetailView.vue'
import RoomDetailView from '@/views/RoomDetailView.vue';

const routes = [
  {path: "/", name: "main", component: Main},
  {path: "/search", name: "search", component: SearchView},
  {path: "/mypage", name: "mypage", component: MypageView},
  { path: '/fail', component: FailPage },
  { path: '/success', component: SuccessPage },
  { path: '/toss', component: Checkout },
  {path: "/login", name: "login", component: LoginView},
  {path: "/register", name: "register", component: RegisterView},
  {path: "/profile", name: "profile", component: ProfileView},
  {path: "/place/:id", name: "place-detail", component: PlaceDetailView},
  {path: '/place/:id/room/:idx', name: 'room-detail', component: RoomDetailView},
  {path: "/reserv", name: "reserv", component: ReservationForm}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
