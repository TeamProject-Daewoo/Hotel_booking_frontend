// src/router/index.js
import Main from '@/components/Main.vue'

import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import SearchView from '@/views/SearchView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import ReservationForm from "@/views/ReservationForm.vue";
import MypageView from "@/views/MypageView.vue"
import PlaceDetailView from '@/views/PlaceDetailView.vue'
import RoomDetailView from '@/views/RoomDetailView.vue';
import PaymentView from '../views/PaymentView.vue';
import PaymentFail from '../components/payment/PaymentFail.vue';
import PaymentSuccess from '../components/payment/PaymentSuccess.vue';
import ReservationComplete from '../components/reservation/ReservationComplete.vue';
import PaymentProcess from '../components/payment/PaymentProcess.vue';
import BookingListView from "@/components/mypage/BookingListView.vue";
import NonMemberBookingView from '@/views/NonMemberBookingView.vue';
import registerChoice from '@/views/RegisterChoiceView.vue';
import KakaoCallback from '../views/KakaoCallback.vue';
import LogoutCallback from '../components/kakao/LogoutCallback.vue';
import LoginChoiceView from '../views/LoginChoiceView.vue';
import ReviewForm from '@/views/ReviewForm.vue';
import registrationFailed from '../views/RegistrationFailedView.vue';

// 🔽 Inquiry 관련 라우트 import 추가
import InquiryList from '@/components/inquiries/InquiryList.vue';
import InquiryForm from '@/components/inquiries/InquiryForm.vue';
import InquiryDetail from '@/components/inquiries/InquiryDetail.vue';

const routes = [
  {path: "/", name: "main", component: Main},
  {path: "/search", name: "search", component: SearchView},
  {path: "/mypage", name: "mypage", component: MypageView},
  {path: "/login", name: "login", component: LoginView},
  {path: "/register", name: "register", component: RegisterView},
  {path: "/place/:id", name: "place-detail", component: PlaceDetailView},
  {path: '/place/:id/room/:idx', name: 'room-detail', component: RoomDetailView},
  {path: "/reserv", name: "reserv", component: ReservationForm},
  {path: '/payment/:reservationId', name: 'Payment', component: PaymentView},
  {path: '/payment-success', name: 'PaymentSuccess', component: PaymentSuccess},
  {path: '/payment-fail', name: 'PaymentFail',component: PaymentFail},
  {path: '/reservation-complete/:reservationId', name: 'ReservationComplete', component: ReservationComplete},
  {path: '/payment-process', name: 'PaymentProcess', component: PaymentProcess},
  {path: '/mypage/bookinglist', name: 'BookingListView',component: BookingListView},
  {path: '/lookup-booking', name: 'NonMemberBookingView', component: NonMemberBookingView},
  {path: '/register-choice', name: 'registerChoice', component: registerChoice},
  {path: '/kakao-callback', name: 'KakaoCallback', component: KakaoCallback},
  {path: '/logout-callback', name: 'LogoutCallback', component: LogoutCallback},
  {path: '/login-choice', name: 'LoginChoiceView', component: LoginChoiceView},
  {path: '/write-review/:reservationId', name: 'WriteReview', component: ReviewForm},
  {path: '/registration-failed', name: 'registrationFailed', component: registrationFailed},

    // 🔽 문의 관련 라우트 추가
  { path: "/inquiries", name: "InquiryList", component: InquiryList },
  { path: "/inquiries/new", name: "InquiryForm", component: InquiryForm },
  { path: "/inquiries/:id", name: "InquiryDetail", component: InquiryDetail },

  { path: "/notices", name: "NoticeList", component: () => import('@/components/Notice/notice.vue') },
  { path: '/notices/:id', name: 'NoticeDetail', component: () => import('@/components/Notice/NoticeDetail.vue'), props: true },

  { path: '/coupon',name: 'CouponPage',component: () => import('@/components/coupon/CouponPage.vue'),meta: { requiresAuth: true }}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  },
})

export default router
