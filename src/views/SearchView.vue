<template>
    <div class="search-form-container">
        <div class="search-container">
            <InputForm @search-trigger="setResponse"/>
        </div>
        <div class="view-container">
            <div class="filter-container">
                <FilterForm/>
            </div>
            <div class="result-container">
                <ResultForm :response="response"/>
            </div>
        </div>
    </div>
</template>

<script setup>
import FilterForm from '@/components/search/FilterForm.vue';
import InputForm from '@/components/search/InputForm.vue';
import ResultForm from '@/components/search/ResultForm.vue';
import { ref } from 'vue';

const response = ref(null);
const setResponse = (data) => {
    response.value = data;
}
</script>

<style scoped>
.search-form-container {
    padding: 2rem;
    font-family: 'Arial', sans-serif;
    color: #333;
    padding: 50px 75px;
    background-color: #FAFBFC
}

.search-container {
    width: 100%;
    height: 100%;
}

.view-container {
    display: flex;
    width: 100%;
    align-items: flex-start;
}
.filter-container {
    width: 30%;
}
.result-container {
    width: 70%;
}
</style>