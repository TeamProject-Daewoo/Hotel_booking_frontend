<template>
  <div class="date-picker">
    <div class="calendar-header">
      <button @click="prevMonth" :disabled="currentYear <= startYear && currentMonth <= startMonth" class="nav-button"><i class="fa-solid fa-chevron-left"></i></button>
      <h2>{{ currentYear }}년 {{ currentMonth + 1 }}월</h2>
      <button @click="nextMonth" :disabled="currentYear >= maxYear && currentMonth >= maxMonth" class="nav-button"><i class="fa-solid fa-chevron-right"></i></button>
    </div>
    <div class="calendar-grid">
      <div v-for="day in daysOfWeek" :key="day" class="day-of-week">{{ day }}</div>
      <div v-for="blank in startDayOfWeek" :key="'blank-' + blank" class="blank-day"></div>
      <div
        v-for="day in daysInMonth"
        :key="day"
        :class="['calendar-day', getDateClasses(day)]"
        @click="selectDate(day)"
      >
        {{ day }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const emit = defineEmits(['range-selected']);

const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());

// 두 개의 날짜 상태 관리
const checkInDate = ref(null);
const checkOutDate = ref(null);

const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

const daysInMonth = computed(() => new Date(currentYear.value, currentMonth.value + 1, 0).getDate());
const startDayOfWeek = computed(() => new Date(currentYear.value, currentMonth.value, 1).getDay());

// --- 월 이동 로직 (기존과 거의 동일) ---
const startMonth = today.getMonth();
const startYear = today.getFullYear();
const maxDate = new Date();
maxDate.setMonth(maxDate.getMonth() + 6);
const maxMonth = maxDate.getMonth();
const maxYear = maxDate.getFullYear();

const prevMonth = () => {
  if (currentYear.value <= startYear && currentMonth.value <= startMonth) return;
  currentMonth.value = currentMonth.value === 0 ? 11 : currentMonth.value - 1;
  if (currentMonth.value === 11) currentYear.value--;
};

const nextMonth = () => {
  if (currentYear.value >= maxYear && currentMonth.value >= maxMonth) return;
  currentMonth.value = currentMonth.value === 11 ? 0 : currentMonth.value + 1;
  if (currentMonth.value === 0) currentYear.value++;
};

// --- 날짜 선택 및 상태 관리 로직 (핵심 변경) ---

// 선택 가능한 날짜인지 판단 (오늘 이전 날짜 비활성화)
const isSelectable = (day) => {
  const date = new Date(currentYear.value, currentMonth.value, day);
  const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return date >= todayWithoutTime;
};

// 날짜 클릭 시 실행되는 메인 로직
const selectDate = (day) => {
  if (!isSelectable(day)) return;

  const clickedDate = new Date(currentYear.value, currentMonth.value, day);

  // 1. 체크인 날짜가 없거나, 이미 체크인/체크아웃이 모두 선택된 경우 -> 새로 체크인 날짜 선택
  if (!checkInDate.value || checkOutDate.value) {
    checkInDate.value = clickedDate;
    checkOutDate.value = null;
  } 
  // 2. 체크인 날짜보다 이전 날짜를 클릭한 경우 -> 새로 체크인 날짜 선택
  else if (clickedDate < checkInDate.value) {
    checkInDate.value = clickedDate;
  }
  // 3. 체크인 날짜만 있는 상태에서 이후 날짜를 클릭한 경우 -> 체크아웃 날짜로 선택
  else {
    checkOutDate.value = clickedDate;
    // 범위 선택 완료! 부모 컴포넌트로 이벤트 발생
    emit('range-selected', { start: checkInDate.value, end: checkOutDate.value });
  }
};

// 날짜에 적용할 CSS 클래스를 동적으로 반환하는 함수
const getDateClasses = (day) => {
  const date = new Date(currentYear.value, currentMonth.value, day);
  const classes = { 'is-disabled': !isSelectable(day) };

  if (!checkInDate.value) return classes;

  const checkInTime = new Date(checkInDate.value.getFullYear(), checkInDate.value.getMonth(), checkInDate.value.getDate()).getTime();
  const dateTime = date.getTime();

  if (checkInTime === dateTime) {
    classes['is-check-in'] = true;
  }

  if (checkOutDate.value) {
    const checkOutTime = new Date(checkOutDate.value.getFullYear(), checkOutDate.value.getMonth(), checkOutDate.value.getDate()).getTime();
    if (checkOutTime === dateTime) {
      classes['is-check-out'] = true;
    }
    if (dateTime > checkInTime && dateTime < checkOutTime) {
      classes['is-in-range'] = true;
    }
  }

  return classes;
};
</script>

<style scoped>
.date-picker {
  width: 100%;
  height: 450px;
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: sans-serif;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.calendar-header h2 {
  margin-top: 10px;
  padding: 10px 10px;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}
.nav-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
}
.nav-button:hover:not(:disabled) {
  background-color: #f0f0f0;
}
.nav-button:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  text-align: center;
  width: 100%;
  flex-grow: 1;
}

.day-of-week,
.calendar-day,
.blank-day {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.day-of-week {
  font-weight: bold;
  color: #666;
}

.calendar-day {
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  width: 100%;
  height: 50px;
  border-radius: 4px; /* 기본적으로 약간의 둥근 모서리 */
}

.calendar-day:hover:not(.is-disabled) {
  background-color: #eaf6ff;
}

.is-disabled {
  color: #ccc;
  cursor: not-allowed;
  text-decoration: line-through;
}

/* --- 범위 선택 스타일 --- */
.is-in-range {
  background-color: #e6f7e9;
  color: #333;
  border-radius: 0;
}

.is-check-in,
.is-check-out {
  background-color: #4CAF50; /* Primary color */
  color: white;
  font-weight: bold;
}

.is-check-in {
  border-top-left-radius: 50%;
  border-bottom-left-radius: 50%;
}

.is-check-out {
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
}

/* 시작일과 종료일이 같은 경우 둥글게 */
.is-check-in.is-check-out {
    border-radius: 50%;
}
</style>