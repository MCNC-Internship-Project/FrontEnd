<template>
  <div class="root-container">
    <v-container>
      <!-- 생년월일 입력란 -->
      <div class="form-input" id="birth" @click="showDatePicker = true">
        <div class="text-container">
          <span class="placeholder-text" v-if="!selectedDate">생년월일</span>
          <span class="text">{{ formattedDate }}</span>
        </div>
        <div class="img-container">
          <img src="../../../assets/images/icon_calendar.svg" class="icon" alt="calendar icon" />
        </div>
      </div>

      <!-- 성별 입력란 -->
      <v-menu v-model="showGenderMenu" :location="'bottom'" offset-y>
        <template v-slot:activator="{ props }">
          <div class="form-input" id="gender" v-bind="props">
            <div class="text-container">
              <span class="placeholder-text" v-if="!selectedGender">성별</span>
              <span class="text">{{ selectedGender || '' }}</span>
            </div>
            <div class="img-container">
              <img src="../../../assets/images/icon_dropdown.svg" class="icon" alt="dropdown icon" />
            </div>
          </div>
        </template>

        <!-- 드롭다운 목록 -->
        <v-list v-model="selectedGender">
          <v-list-item v-for="(option, index) in genderOptions" :key="index" @click="selectGender(option)">
            <v-list-item-title>{{ option }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <button class="form-btn" @click="goToSignUp">회원가입</button>
    </v-container>

    <!-- 모달 형식의 DatePicker -->
    <div v-if="showDatePicker" class="modal-overlay" @click.self="closeDatePicker">
      <v-container>
        <v-row justify="center">
          <v-date-picker hide-header v-model="selectedDate" elevation="24" @update:model-value="onDateSelected"
            color="#1088E3" :max="new Date()"></v-date-picker>
        </v-row>
      </v-container>
    </div>

  </div>
</template>

<script setup>
import { formatDate } from '@/utils/dateCalculator'
import { ref, watch, defineEmits, computed } from 'vue'

const emit = defineEmits(["signUp"]);



const showDatePicker = ref(false);
const selectedDate = ref(null);
const showGenderMenu = ref(false);
const selectedGender = ref(null);
const genderOptions = ['남성', '여성'];
const birth = ref(null);

watch(selectedDate, (newDate) => {
  console.log(newDate)
  birth.value = formatDate(newDate);
})

// 날짜 선택 시 호출되는 함수
function onDateSelected(date) {
  selectedDate.value = new Date(date);
  showDatePicker.value = false;
}

// 모달 닫기 함수
function closeDatePicker() {
  showDatePicker.value = false;
}

// 성별 선택 함수
function selectGender(gender) {
  selectedGender.value = gender;
  showGenderMenu.value = false;
}

// 날짜 형식을 포맷하는 계산된 속성
const formattedDate = computed(() => {
  if (selectedDate.value) {
    const year = selectedDate.value.getFullYear();
    const month = selectedDate.value.getMonth() + 1;
    const day = selectedDate.value.getDate();
    return `${year}년 ${month}월 ${day}일`;
  }
  return '';
});

const goToSignUp = () => {
  const gender = (selectedGender.value === '남성' ? 'M' : 'F');
  emit("signUp", { birth: birth.value, gender: gender })
}
</script>

<style scoped>
.root-container {
    width: 100%;
}

.v-container {
    padding: 0 24px;
    max-width: 100%;
}

.form-input,
.form-btn {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 56px;
    margin-bottom: 12px;
    padding: 0 16px;
    border: solid 2px var(--primary);
    border-radius: 12px;
    outline: none;
    font-size: 0.875rem;
}

.form-btn {
    display: flex;
    justify-content: center;
    background-color: var(--primary);
    border: none;
    color: white;
    margin-top: 20px;
    transition: all 0.2s ease;
}

.form-btn:hover {
    background-color: #0d6db7;
}

.text-container {
    display: flex;
    align-items: center;
}

.placeholder-text {
    color: #C6C6C6;
}

.text {
    color: #757575;
}

.img-container {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    right: 12px;
}

.icon {
    width: 20px;
    height: 20px;
}

/* 모달 배경 */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}
</style>