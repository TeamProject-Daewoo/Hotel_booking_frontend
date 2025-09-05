<script setup>
import key from '../key/apikey'
const options = {
    "전국":"",
    "서울특별시":"1",
    "인천광역시":"2",
    "대전광역시":"3",
    "대구광역시":"4",
    "광주광역시":"5",
    "부산광역시":"6",
    "울산광역시":"7",
    "세종특별자치시":"8",
    "경기도":"31",
    "강원특별자치도":"32",
    "충청북도":"33",
    "충청남도":"34",
    "경상북도":"35",
    "경상남도":"36",
    "전라북도":"37",
    "전라남도":"38",
    "제주특별자치도":"39"
}
</script>
<template>
    <div class="conainer">
        <div class="search-container">
            <select v-model="areaCode">
                <option v-for="(key, value) in options" :key="key" :value="key">{{ value }}</option>
            </select>
            <input v-model="input" type="text" placeholder="키워드를 입력하세요.">
            <button @click="search">검색하기</button>
        </div>
        <div>
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
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            data: {},
            areaCode: '',
            keyword: '',
            input: '',
            requestUrl: 'areaBasedList2',
            contentid: ''
        };
    },
    methods: {
        async search() {
            try {
                //키워드 있을 때는 searchKeyword2, 없으면 areaBasedList2로 요청해야함
                // this.keyword = (this.input === '') ? '' :`&keyword=${encodeURIComponent(this.input)}`; //한글 기반이면, URI 인코딩
                // this.requestUrl = (this.input === '') ? 'areaBasedList2' :'searchKeyword2';
                //searchStay2
                //http://apis.data.go.kr/B551011/KorService2/IdongCode2?MobileOS=ETC&MobileApp=AppTest&ServiceKey=a89acceac884ef55cd0498d002bbb4a3fb8250b81661951a5bce51d6cd9a5ee3&_type=json
                //http://apis.data.go.kr/B551011/KorService2/IdongCode2?numOfRows=12&MobileOS=ETC&MobileApp=AppTest&ServiceKey=a89acceac884ef55cd0498d002bbb4a3fb8250b81661951a5bce51d6cd9a5ee3&_type=json
                //지역 & 키워드별 검색 요청
                //`http://apis.data.go.kr/B551011/KorService2/${this.requestUrl}?numOfRows=12&MobileOS=ETC&MobileApp=AppTest&ServiceKey=${key.API_KEY}&arrange=A&contentTypeId=32&areaCode=${this.areaCode}&sigunguCode=&cat1=B02&cat2=B0201&cat3=B02010100${this.keyword}&_type=json`
                //ldong코드
                //`http://apis.data.go.kr/B551011/KorService2/ldongCode2?numOfRows=12&MobileOS=ETC&MobileApp=AppTest&ServiceKey=${key.API_KEY}&_type=json`
                /*
                {"response": {"header":{"resultCode":"0000","resultMsg":"OK"},"body": 
                {"items": 
                {"item":[{"rnum":1,"code":"11","name":"서울특별시"},
                {"rnum":2,"code":"26","name":"부산광역시"},
                {"rnum":3,"code":"27","name":"대구광역시"},
                {"rnum":4,"code":"28","name":"인천광역시"},
                {"rnum":5,"code":"29","name":"광주광역시"},
                {"rnum":6,"code":"30","name":"대전광역시"},
                {"rnum":7,"code":"31","name":"울산광역시"},
                {"rnum":8,"code":"41","name":"경기도"},
                {"rnum":9,"code":"43","name":"충청북도"},
                {"rnum":10,"code":"44","name":"충청남도"}]},
                "numOfRows":10,"pageNo":1,"totalCount":17}}}
                */
                //http://apis.data.go.kr/B551011/KorService2/detailIntro2?numOfRows=12&MobileOS=ETC&MobileApp=AppTest&ServiceKey=a89acceac884ef55cd0498d002bbb4a3fb8250b81661951a5bce51d6cd9a5ee3&_type=json
                //`http://apis.data.go.kr/B551011/KorService2/searchStay2?numOfRows=12&MobileOS=ETC&MobileApp=AppTest&ServiceKey=${key.API_KEY}&lDongRegnCd=26&_type=json`
                //호텔 상세 정보
                //http://apis.data.go.kr/B551011/KorService2/detailIntro2?numOfRows=12&MobileOS=ETC&MobileApp=AppTest&ServiceKey=a89acceac884ef55cd0498d002bbb4a3fb8250b81661951a5bce51d6cd9a5ee3&contentTypeId=32&contentId=136485&_type=json
                //객실 정보
                //http://apis.data.go.kr/B551011/KorService2/detailInfo2?numOfRows=12&MobileOS=ETC&MobileApp=AppTest&ServiceKey=a89acceac884ef55cd0498d002bbb4a3fb8250b81661951a5bce51d6cd9a5ee3&contentTypeId=32&contentId=136485&_type=json

                const response = await axios.get(`http://apis.data.go.kr/B551011/KorService2/areaBasedList2?numOfRows=12&MobileOS=ETC&MobileApp=AppTest&ServiceKey=${key.API_KEY}&arrange=A&contentTypeId=32&areaCode=&sigunguCode=&cat1=B02&cat2=B0201&cat3=B02010100&_type=json`, {});
                const data = response.data.response.body.items.item;

                //건물 상세 정보
                const detilResponse = await axios.get(`http://apis.data.go.kr/B551011/KorService2/detailIntro2?numOfRows=12&MobileOS=ETC&MobileApp=AppTest&ServiceKey=${key.API_KEY}&contentTypeId=32&contentId=${this.contentId}&_type=json`, {});
                console.log(detilResponse.data.response.body.items.item);

                //객실 정보
                //const infoResponse = await axios.get(`http://apis.data.go.kr/B551011/KorService2/detailInfo2?numOfRows=12&MobileOS=ETC&MobileApp=AppTest&ServiceKey=${key.API_KEY}&contentTypeId=32&contentId=${this.contentId}&_type=json`, {});
                //console.log(infoResponse.data.response.body.items.item);
                
                this.data = data || {};
                data.forEach(element => {
                    console.log(element);
                    this.contentid = element.contentid;
                    console.log(this.contentid);
                }); 
            } catch (err) {}
        }
    }
}
</script>
<style scoped>
.container {
    padding: 2rem;
    font-family: 'Arial', sans-serif;
    color: #333;
}

.search-container {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    align-items: center;
}

select, input[type="text"] {
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
}

select {
    width: 200px;
}

input[type="text"] {
    flex-grow: 1;
}

button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    background-color: #007BFF;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #0056b3;
}

/* 테이블 스타일 */
table {
    width: 100%;
    border-collapse: collapse;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
}

thead {
    background-color: #f4f4f4;
}

th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

tr:hover {
    background-color: #f9f9f9;
}

img {
    max-width: 100px;
    height: auto;
    border-radius: 4px;
}
</style>