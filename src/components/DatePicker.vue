<template>
  <div class="date-picker">
    <div class="calendar-header">
      <button @click="prevMonth" style="border: none;"><i class="fa-solid fa-chevron-left"></i></button>
      <h2>{{ currentYear }}년 {{ currentMonth + 1 }}월</h2>
      <button @click="nextMonth" style="border: none;"><i class="fa-solid fa-chevron-right"></i></button>
    </div>
    <div class="calendar-grid">
      <div v-for="day in daysOfWeek" :key="day" class="day-of-week">{{ day }}</div>
      <div v-for="blank in startDayOfWeek" :key="'blank-' + blank" class="blank-day"></div>
      <div
        v-for="day in daysInMonth"
        :key="day"
        :class="['calendar-day', { 'is-selected': isSelected(day) }]"
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

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

const selectDate = (day) => {
  const date = new Date(currentYear.value, currentMonth.value, day);
  emit('select-date', date);
};

const isSelected = (day) => {
  return false;
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