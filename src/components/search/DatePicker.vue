<template>
  <div class="date-picker">
    <div class="calendar-header">
      <button @click="prevMonth" :disabled="currentYear <= startYear && currentMonth <= startMonth" style="border: none;"><i class="fa-solid fa-chevron-left"></i></button>
      <h2>{{ currentYear }}년 {{ currentMonth + 1 }}월</h2>
      <button @click="nextMonth" :disabled="currentYear >= maxYear && currentMonth >= maxMonth" style="border: none;"><i class="fa-solid fa-chevron-right"></i></button>
    </div>
    <div class="calendar-grid">
      <div v-for="day in daysOfWeek" :key="day" class="day-of-week">{{ day }}</div>
      <div v-for="blank in startDayOfWeek" :key="'blank-' + blank" class="blank-day"></div>
      <div
        v-for="day in daysInMonth"
        :key="day"
        :class="['calendar-day', { 'is-selected': isSelected(day), 'is-disabled': !isSelectable(day) }]"
        @click="selectDate(day)"
      >
        {{ day }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const emit = defineEmits(['select-date']);

const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());

const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
});

const startDayOfWeek = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay();
});

const startMonth = today.getMonth();
const startYear = today.getFullYear();
// 최대 허용 월 (오늘로부터 6개월 후)
const maxDate = new Date();
maxDate.setMonth(maxDate.getMonth() + 6);
const maxMonth = maxDate.getMonth();
const maxYear = maxDate.getFullYear();

const prevMonth = () => {
  if(currentYear.value <= startYear && currentMonth.value <= startMonth) {
    return;
  }
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentYear.value >= maxYear && currentMonth.value >= maxMonth) {
    return;
  }
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

//선택 가능한 날짜인지 판단 + 이전 날짜 비활성화
const isSelectable = (day) => {
    const selectedDate = new Date(currentYear.value, currentMonth.value, day);
    const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    return selectedDate >= todayWithoutTime;
};

const selectedDate = ref(null);
const selectDate = (day) => {
  if (isSelectable(day)) {
    selectedDate.value = new Date(currentYear.value, currentMonth.value, day);
    emit('select-date', selectedDate.value);
  }
};


const isSelected = (day) => {
  if(!selectedDate.value) {
    return false;
  }
  const date = new Date(currentYear.value, currentMonth.value, day);
  return date.getTime() === selectDate.value.getTime();
};
</script>

<style scoped>
.date-picker {
  font-family: Arial, sans-serif;
  padding: 10px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.calendar-header h2 {
  font-size: 1.2em;
  margin: 0;
}

.calendar-header button {
  background: none;
  border: 1px solid #ddd;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  text-align: center;
}

.day-of-week {
  font-weight: bold;
  color: #555;
  padding-bottom: 5px;
}

.calendar-day {
  padding: 10px 0;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.calendar-day:hover {
  background-color: #f0f0f0;
}
.calendar-day.is-disabled {
    color: #ccc;
    cursor: not-allowed;
}

button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
}

.is-selected {
  background-color: #42b983;
  color: white;
  font-weight: bold;
}

.blank-day {
  height: 0;
  visibility: hidden;
}
</style>