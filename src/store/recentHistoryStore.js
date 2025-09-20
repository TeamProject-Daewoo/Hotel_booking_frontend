import { defineStore } from 'pinia';
import axios from '@/api/axios';

const STORAGE_KEY = 'recentHistory';

export const useRecentHistory = defineStore('recentHistory', {
    state: () => ({
        recentSearches: [],
        recentlyViewed: []
    }),
    actions: {
        //최근 검색 기록
        loadRecentSearches() {
            const searches = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            this.recentSearches = searches;
        },
        addRecentSearch(keyword) {
            let searches = this.recentSearches;
            searches = searches.filter(item => item !== keyword);
            searches.unshift(keyword);
            //최대 갯수
            const limitedSearches = searches.slice(0, 5);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedSearches));
            this.recentSearches = limitedSearches;
        },
        deleteRecentSearch(keyword) {
            this.recentSearches = this.recentSearches.filter(item => item !== keyword);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.recentSearches));
        },
        //최근 본 호텔
        loadViewHistory() {
            const storedHistory = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            this.recentlyViewed = storedHistory;
        },
        addViewHistory(hotel) {
            let currentHistory = this.recentlyViewed.filter(item => item.contentid !== hotel.contentid);
            currentHistory.unshift(hotel);
            
            // 최대 3개까지
            const limitedHistory = currentHistory.slice(0, 3);
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedHistory));
            this.recentlyViewed = limitedHistory;
        }
    }
});