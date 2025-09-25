<template>
  <div class="date-container">
    <div class="date-picker">
      <div class="calendar-header">
        <button @click="prevMonth" class="nav-button"><i class="fa-solid fa-chevron-left"></i></button>
        <h2>{{ currentYear }}년 {{ currentMonth + 1 }}월</h2>
        <button @click="nextMonth" class="nav-button"><i class="fa-solid fa-chevron-right"></i></button>
      </div>
      <div class="calendar-grid">
        <div v-for="day in daysOfWeek" :key="day" class="day-of-week">{{ day }}</div>
        <div
          v-for="(dayObj, index) in calendarDays"
          :key="index"
          class="day-cell"
          :class="dayObj.classes"
          @click="selectDate(dayObj)"
        >
          {{ dayObj.day }}
        </div>
      </div>
      <button class="confirm-btn" @click="confirmDate">확인</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const emit = defineEmits(['range-selected']);

const props = defineProps({
  initialCheckIn: { type: Date, default: null },
  initialCheckOut: { type: Date, default: null }
});

const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());
const checkInDate = ref(props.initialCheckIn);
const checkOutDate = ref(props.initialCheckOut);
const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

// --- 날짜 범위 제한 설정 ---
const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
const maxDate = new Date(todayWithoutTime);
maxDate.setMonth(maxDate.getMonth() + 3);

// --- 핵심: 달력 데이터 생성 computed 속성 ---
const calendarDays = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;
  const days = [];

  const firstDayOfMonth = new Date(year, month, 1);
  const prevMonthLastDate = new Date(year, month, 0).getDate();
  const startDayIndex = firstDayOfMonth.getDay();
  const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

  const checkInTime = checkInDate.value ? new Date(checkInDate.value.getFullYear(), checkInDate.value.getMonth(), checkInDate.value.getDate()).getTime() : null;
  const checkOutTime = checkOutDate.value ? new Date(checkOutDate.value.getFullYear(), checkOutDate.value.getMonth(), checkOutDate.value.getDate()).getTime() : null;

  // 1. 이전 달 날짜 채우기
  for (let i = startDayIndex; i > 0; i--) {
    const day = prevMonthLastDate - i + 1;
    const date = new Date(year, month - 1, day);
    days.push({ day:'', date, isCurrentMonth: false, classes: { 'is-other-month': true, 'is-disabled': true } });
  }

  // 2. 현재 달 채우기
  for (let day = 1; day <= lastDateOfMonth; day++) {
    const date = new Date(year, month, day);
    const isSelectable = date >= todayWithoutTime && date <= maxDate;

    const dateTime = date.getTime();
    const classes = {
      'is-current-month': true,
      'is-disabled': !isSelectable,
      'is-check-in': checkInTime === dateTime,
      'is-check-out': checkOutTime === dateTime,
      'is-in-range': checkInTime && checkOutTime && dateTime > checkInTime && dateTime < checkOutTime,
    };

    days.push({ day, date, isCurrentMonth: true, isSelectable, classes });
  }

  // 3. 다음 달 날짜 채우기
  const remainingDays = 42 - days.length;
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day);
    const isSelectable = date >= todayWithoutTime && date <= maxDate;
    
    // 다음 달 날짜에 대해서도 현재 달과 똑같이 isSelectable과 모든 classes를 계산합니다.
    const dateTime = date.getTime();
    const classes = {
      'is-other-month': true,
      'is-disabled': !isSelectable,
      'is-check-in': checkInTime === dateTime,
      'is-check-out': checkOutTime === dateTime,
      'is-in-range': checkInTime && checkOutTime && dateTime > checkInTime && dateTime < checkOutTime,
    };

    days.push({ day, date, isCurrentMonth: false, isSelectable, classes });
  }
  
  return days;
});

const prevMonth = () => {
  const newMonth = new Date(currentYear.value, currentMonth.value - 1, 1);
  if (newMonth < new Date(today.getFullYear(), today.getMonth(), 1)) return;
  currentMonth.value = newMonth.getMonth();
  currentYear.value = newMonth.getFullYear();
};

const nextMonth = () => {
  const newMonth = new Date(currentYear.value, currentMonth.value + 1, 1);
  if (newMonth > maxDate) return;
  currentMonth.value = newMonth.getMonth();
  currentYear.value = newMonth.getFullYear();
};

const selectDate = (dayObject) => {
  if (!dayObject.isSelectable) return;
  const selectedDate = dayObject.date;

  if (!checkInDate.value || (checkInDate.value && checkOutDate.value)) {
    checkInDate.value = selectedDate;
    checkOutDate.value = null;
  } else if (selectedDate.getTime() <= checkInDate.value.getTime()) {
    checkInDate.value = selectedDate;
  } else {
    checkOutDate.value = selectedDate;
  }
};

const confirmDate = () => {
  
  if(checkOutDate.value == null) {
    const d = new Date(checkInDate.value);
    d.setDate(d.getDate()+1);
    checkOutDate.value = d;
  }
  emit('range-selected', { start: checkInDate.value, end: checkOutDate.value });
};
</script>

<style scoped>
.date-picker {
  width: 100%;
  height: 520px;
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
  grid-template-rows: repeat(7, 1fr);
  max-height: 400px;
  height: 400px;
  gap: 5px;
  text-align: center;
  width: 100%;
}
.day-cell {
  padding: 0.5rem;
  cursor: pointer;
  text-align: center;
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
  border-radius: 4px;
}
.is-other-month {
  opacity: 0.4;
  color: #aaa;
}

.calendar-day:hover:not(.is-disabled) {
  background-color: #eaf6ff;
}

.is-disabled {
  color: #ccc;
  cursor: not-allowed;
  text-decoration: line-through;
}
.confirm-btn {
  background-color: #4CAF50;
  border-radius: 10px;
  border: none;
  color: white;
  height: 50px;
  padding: 10px;
  margin-top: 50px;
  margin: 10px;
}
.confirm-btn:hover {
  background-color: #3e9541;
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
  border-top-left-radius: 50px;
  border-bottom-left-radius: 50px;
}

.is-check-out {
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
}

/* 시작일과 종료일이 같은 경우 둥글게 */
.is-check-in.is-check-out {
    border-radius: 50px;
}
</style>