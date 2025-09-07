<template>
    <div class="search-form-container">
        <div class="search-container">
            <InputForm/>
        </div>
        <div class="view-container">
            <div class="filter-container">
                <FilterForm/>
            </div>
            <div class="result-container">
                <ResultForm/>
            </div>
        </div>
    </div>
</template>

<script setup>
import FilterForm from './FilterForm.vue';
import InputForm from './InputForm.vue';
import ResultForm from './ResultForm.vue';

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
}

.view-container {
    display: flex;
    width: 100%;
}
.filter-container {
    width: 30%;
}
.result-container {
    width: 70%;
}
</style>