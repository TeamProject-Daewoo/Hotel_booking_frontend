<template>
  <main class="mypage-container">
    <div class="mypage-layout">
      <SidebarComponent :current-page="currentPage" @navigate="handleNavigation" />
      <div class="content-area">
        <component :is="currentViewComponent"></component>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';
import SidebarComponent from '../components/mypage/SidebarComponent.vue';
import ProfileView from '../components/mypage/ProfileView.vue';
import BookingListView from '../components/mypage/BookingListView.vue';
import ReviewListView from '../components/mypage/ReviewListView.vue';
import LikeListView from '../components/mypage/LikeListView.vue';
import PaymentMethodView from '../components/mypage/PaymentMethodView.vue';
import SettingsView from '../components/mypage/SettingsView.vue';

const currentPage = ref('profile');

const views = {
  profile: ProfileView,
  bookings: BookingListView,
  reviews: ReviewListView,
  likes: LikeListView,
  'payment-methods': PaymentMethodView,
  settings: SettingsView,
};

const currentViewComponent = computed(() => views[currentPage.value]);

const handleNavigation = (page) => {
  currentPage.value = page;
};
</script>

<style scoped>
.mypage-container {
  width: 100%;
  max-width: 1280px;
  margin: 2rem auto;
  padding: 0 1rem;
}
.mypage-layout {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}
.content-area {
  flex: 1;
}

@media (max-width: 768px) {
  .mypage-layout {
    flex-direction: column;
  }
}
</style>