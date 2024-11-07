<template>
    <div id="root-container">
        <v-container>
            <!-- 생년월일 입력란 -->
            <div class="outlined-container" id="birth" @click="showDatePicker = true">
                <span class="placeholder-text" v-if="!selectedDate">생년월일</span>
                <span class="text">{{ formattedDate }}</span>
                <img src="../../../assets/icon_calendar.svg" class="icon" alt="calendar icon" />
            </div>

            <!-- 성별 입력란 -->
            <v-menu
            v-model="showGenderMenu"
            :location="'bottom'"
            offset-y
            >
                <template v-slot:activator="{ props }">
                    <div class="outlined-container" id="gender" v-bind="props">
                    <span class="placeholder-text" v-if="!selectedGender">성별</span>
                    <span class="text">{{ selectedGender || '' }}</span>
                    <img src="../../../assets/icon_dropdown.svg" class="icon" alt="dropdown icon" />
                    </div>
                </template>

                <!-- 드롭다운 목록 -->
                <v-list v-model="selectedGender">
                    <v-list-item
                    v-for="(option, index) in genderOptions"
                    :key="index"
                    @click="selectGender(option)"
                    >
                    <v-list-item-title>{{ option }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-container>

        <!-- 모달 형식의 DatePicker -->
        <div v-if="showDatePicker" class="modal-overlay" @click.self="closeDatePicker">
            <v-container>
                <v-row justify="center">
                    <v-date-picker
                    hide-header
                    v-model="selectedDate"
                    elevation="24"
                    @update:model-value="onDateSelected"
                    color="#1088E3"
                    :max="new Date()"
                    ></v-date-picker>
                </v-row>
            </v-container>
        </div>

        <div class="btn-container">
            <button class="submit-btn" @click="goToSignUp">회원가입</button>
        </div>
    </div>
</template>

<script setup>
import { formatDate } from '@/utils/dateCalculator'
import { ref, watch, defineEmits,computed } from 'vue'

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
    emit("signUp", {birth: birth.value, gender: gender})
}
</script>

<style scoped>
#root-container {
    width : 100%;
    height : 10vh;
    margin-top : 24px;
    display : flex;
    flex-direction : column;
    align-items: center;
    justify-content: start;
}

.btn-container {
    width : 100%;
    padding: 0 24px 12px 24px;
    display : flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.submit-btn {
    height : 56px !important;
    border : solid 2px #7796E8;
    border-radius: 10px;
    margin : 8px 0;
    width : 100%;
    background-color: #7796E8;
    border : none;
    color : white;
    transition : all 0.2s;
}

.submit-btn:hover {
    background-color: #0d6db7;
}

.v-container {
  padding: 0;
}

.outlined-container {
  margin: 0 24px 12px 24px;
  border: 2px solid #7796E8;
  padding-left: 16px;
  border-radius: 12px;
  height: 56px;
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  font-size: 0.75rem;
}

.placeholder-text {
  color: #C6C6C6;
  position: absolute;
}

.text {
  color: #757575;
  position: absolute;
}

.icon {
  position: absolute;
  right: 12px;
  width: 20px;
  height: 20px;
}

/* 모달 배경 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
</style>