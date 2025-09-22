import { defineStore } from 'pinia';
import axios from '@/api/axios';

const RECENT_KEY = 'recentHistory';
const VIEW_KEY = 'viewHistory';

export const useHistoryStore = defineStore('history', {
    state: () => ({
        recentSearches: [],
        recentlyViewed: []
    }),
    actions: {
        //최근 검색 기록
        loadRecentSearches() {
            const searches = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
            this.recentSearches = searches;
        },
        addRecentSearch(keyword) {
            let searches = this.recentSearches;
            searches = searches.filter(item => item !== keyword);
            searches.unshift(keyword);
            //최대 갯수
            const limitedSearches = searches.slice(0, 5);
            localStorage.setItem(RECENT_KEY, JSON.stringify(limitedSearches));
            this.recentSearches = limitedSearches;
        },
        deleteRecentSearch(keyword) {
            this.recentSearches = this.recentSearches.filter(item => item !== keyword);
            localStorage.setItem(RECENT_KEY, JSON.stringify(this.recentSearches));
        },

        //최근 본 호텔
        loadViewHistory() {
            const storedHistory = JSON.parse(localStorage.getItem(VIEW_KEY) || '[]');
            this.recentlyViewed = storedHistory;
            console.log(storedHistory)
        },
        addViewHistory(hotel) {
           const updatedHistory = [hotel, ...this.recentlyViewed.filter(item => item.contentid !== hotel.contentid)].slice(0, 6);
            localStorage.setItem(VIEW_KEY, JSON.stringify(updatedHistory));
            this.recentlyViewed = updatedHistory;
        },
        deleteRecentView(hotelId) {
            this.recentlyViewed = this.recentlyViewed.filter(item => item.contentid !== hotelId);
            localStorage.setItem(VIEW_KEY, JSON.stringify(this.recentlyViewed));
        },
    }
});