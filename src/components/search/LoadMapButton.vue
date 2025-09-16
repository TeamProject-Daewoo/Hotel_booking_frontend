<template>
    <div>
        <button class="fixed-map-button" @click="openModal"><i class="fa-solid fa-map-location-dot"></i>&nbsp;지도보기</button>
        <SearchModal :isOpen="isModalOpen" @close="closeModal" maxWidth="1600px" height="800px">
            <h3>지도</h3>
            <HotelsMap/>
        </SearchModal>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import SearchModal from './SearchModal.vue';
import HotelsMap from './HotelsMap.vue';
import { useSearchStore } from '@/api/searchRequestStore';

const searchStore = useSearchStore();

const isModalOpen = ref(false);
const openModal = () => {
    const searchCards = searchStore.result?.data?.searchCards;
    if(Array.isArray(searchCards) && searchCards.length > 0) isModalOpen.value = true;
    else alert('검색 정보가 없습니다!');
};
const closeModal = () => {
    isModalOpen.value = false;
};
</script>

<style scoped>
.fixed-map-button {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  font-size: 16pt;
  background-color: rgba(255, 255, 255, 0.95);
  padding: 1rem 2rem;
  border-radius: 50px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  z-index: 1000;
}

.fixed-map-button:hover {
    background-color: rgba(239, 239, 239, 0.95);
}
</style>