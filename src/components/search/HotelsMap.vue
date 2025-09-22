<template>
  <div class="map">
    <div id="kakao-map-container"></div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import api from '@/api/axios'
import { useSearchStore } from '@/api/searchRequestStore'
import { useUiStore } from '@/store/commonUiStore';

const searchStore = useSearchStore()
const searchCards = searchStore.result?.data?.searchCards || [];

const map = ref(null)
const markers = ref([])
const resolvedAddresses = ref({})
const infowindow = ref(null)
const customOverlays = ref([]);
const emptyImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect width='100%25' height='100%25' fill='%23E5E7EB'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='30' fill='%239CA3AF' dominant-baseline='middle' text-anchor='middle'%3E제공되지 않는 이미지입니다.%3C/text%3E%3C/svg%3E"

const KAKAO_APPKEY = import.meta.env.VITE_KAKAO_MAP_APPKEY
let kakaoSdkPromise
function loadKakaoSdk () {
  if (window.kakao && window.kakao.maps) return Promise.resolve()
  if (!kakaoSdkPromise) {
    kakaoSdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APPKEY}&autoload=false&libraries=services,clusterer`
      script.async = true
      script.onload = () => {
        window.kakao.maps.load(() => resolve())
      }
      script.onerror = reject
      document.head.appendChild(script)
    })
  }
  return kakaoSdkPromise
}

// 지도를 초기화하고 모든 마커를 표시하는 함수
function initMap() {
  if (!searchCards || searchCards.length === 0) {
    const uiStore = useUiStore();
    uiStore('지도에 표시할 데이터가 없습니다.', '');
    return;
  }

  // 지도를 담을 HTML 요소
  const container = document.getElementById('kakao-map-container');
  if (!container) {
    console.error('지도를 담을 HTML 요소가 없습니다.');
    return;
  }

  // 첫 번째 검색 결과의 좌표를 중심으로 지도 생성
  const firstCard = searchCards[0];
    const options = {
        center: new window.kakao.maps.LatLng(firstCard.mapY, firstCard.mapX),
        level: 3
    };
    map.value = new window.kakao.maps.Map(container, options);

    infowindow.value = new window.kakao.maps.InfoWindow({
        zIndex: 1
    });

    for (const card of searchCards) {
        const coords = new window.kakao.maps.LatLng(card.mapY, card.mapX);

        const marker = new window.kakao.maps.Marker({
            map: map.value,
            position: coords
        });
        markers.value.push(marker);

        const priceContent = `
          <div style="padding:4px 8px;font-size:12px;font-weight:bold;background:#fff;border:1px solid #ccc;border-radius:15px;text-align:center;">
          <b>${card.title}</b><br><span style="color:green">￦${card.price.toLocaleString()}~</span>
          </div>`;
        const priceOverlay = new window.kakao.maps.CustomOverlay({
            map: map.value,
            position: marker.getPosition(),
            content: priceContent,
            yAnchor: 2
        });
        customOverlays.value.push(priceOverlay);

        // 마커에 클릭 이벤트 등록
        window.kakao.maps.event.addListener(marker, 'click', () => {
          // console.log(card)
            let content = `
                <div style="width:300px; padding:5px;font-size:14px;text-align:center;">
                    <img src="${card.image || emptyImage }" style="width:100%;object-fit:cover;border-radius:5px;"><br>
                    <b>${card.title}</b><br>
                    <span>${resolvedAddresses.value[card.id] || '주소 정보 없음'}</span><br>
                    <span style="color:green">￦${card.price.toLocaleString()}~</span><br>
                    <b><span style="color:rgb(248,186,52)"><i class="fa-solid fa-star"></i> ${ (card.rating > 0) ? card.rating.toFixed(1) : '없음' }</span></b>
                </div>`;
            infowindow.value.setContent(content);
            infowindow.value.open(map.value, marker);
        });

    // 역지오코딩으로 주소 변환
    fetchAddressForMarker(card);
  }
}

// 개별 마커의 주소를 가져오는 함수
function fetchAddressForMarker(card) {
  const geocoder = new window.kakao.maps.services.Geocoder();
  geocoder.coord2Address(card.mapX, card.mapY, (result, status) => {
    if (status === window.kakao.maps.services.Status.OK) {
      const address = result[0].road_address?.address_name || result[0].address?.address_name;
      resolvedAddresses.value[card.id] = address;
    }
  });
}

onMounted(async () => {
  try {
    await loadKakaoSdk();
    if (searchCards.length !== 0) {
      initMap();
    } else {
      console.warn('지도에 표시할 데이터가 없습니다.');
    }
  } catch (e) {
    console.error('카카오 지도 API 로드에 실패했습니다.', e);
  }
});

const displayAddresses = computed(() => {
  return searchCards.map(card => ({
    id: card.id,
    address: resolvedAddresses.value[card.id] ? resolvedAddresses.value[card.id].trim() : ''
  }))
})
</script>

<style scoped>
.map {
  width: 100%;
  height: 100%;
}
#kakao-map-container {
  width: 100%;
  height: 700px;
}
</style>