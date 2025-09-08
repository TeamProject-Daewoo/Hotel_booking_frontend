<script setup>
</script>
<template>
    <div class="search-container">
        <button @click="search"><i class="fa-solid fa-magnifying-glass"></i> 무엇을 찾아드릴까요?</button>
    </div>
</template>
<script>
export default {
    methods: {
        search() {
            this.$router.push('/search')
        }
    }
}
</script>
<style scoped>
.search-container {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    align-items: center;
}
button {
    padding: 0.75rem 1.5rem;
    border: 1px solid black;
    border-radius: 20px;
    width: 50%;
    background-color: #ffffff;
    color: rgb(157, 157, 157);
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
}
</style>