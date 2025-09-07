<template>
    <table>
        <thead>
            <tr>
                <th>호텔명</th>
                <th>주소</th>
                <th>전화번호</th>
                <th>이미지</th>
                <th>우편번호</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="result in data" :key="result.contentid">
                <td>{{ result.title }}</td>
                <td>{{ result.addr1 }}</td>
                <td>{{ result.tel }}</td>
                <td><img :src="result.firstimage" alt="이미지 없음"></td>
                <td>{{ result.zipcode }}</td>
            </tr>
        </tbody>
    </table>
</template>
<script setup>
import { ref } from 'vue';

const data = ref({'':''});
</script>
<style scoped>
table {
    width: 100%;
    text-align: center;
}
</style>