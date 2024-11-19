<template>
  <div class="root-container">
    <v-container>
      <!-- 생년월일 입력란 -->
      <div class="form-input" :class="{ 'error': isBirthError }" @click="showDatePicker = true; isBirthError = false;">
        <div class="text-container">
          <span class="placeholder-text" v-if="!birth">생년월일</span>
          <span class="text" v-if="birth">{{ dayjs(birth).format('YYYY년 MM월 DD일') }}</span>
        </div>
        <div class="img-container">
          <img src="../../../assets/images/icon_calendar.svg" class="icon" alt="calendar icon" />
        </div>
      </div>

      <!-- 성별 입력란 -->
      <v-menu v-model="showGenderMenu" :location="'bottom'" offset-y>
        <template v-slot:activator="{ props }">
          <div class="form-input" :class="{ 'error': isGenderError }" v-bind="props" @click="isGenderError = false;">
            <div class="text-container">
              <span class="placeholder-text" v-if="!gender">성별</span>
              <span class="text">{{ gender }}</span>
            </div>
            <div class="img-container">
              <img src="../../../assets/images/icon_dropdown.svg" class="icon" alt="dropdown icon" />
            </div>
          </div>
        </template>

        <!-- 드롭다운 목록 -->
        <v-list>
          <v-list-item v-for="(option, index) in genderOptions" :key="index" @click="selectGender(option)">
            <v-list-item-title>{{ option }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <button class="form-btn" v-ripple @click="goToSignUp">회원가입</button>
    </v-container>

    <v-dialog v-model="showDatePicker" width="340" max-width="400">
      <v-card style="background-color: #FFF;">
        <v-row justify="center">
          <v-date-picker hide-header v-model="birth" width="320" max-width="400"
            @update:model-value="showDatePicker = false; isBirthError = false;" color="#1088E3"
            :max="new Date()"></v-date-picker>
        </v-row>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showDialog" max-width="400">
      <v-card>
        <div class="dialog-container">
          <div class="dialog-error-message">{{ dialogMessage }}</div>
        </div>
        <v-card-actions>
          <v-btn color="primary" text @click="showDialog = false">
            확인
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import dayjs from 'dayjs'

const birth = ref(null);
const gender = ref(null);

const isBirthError = ref(false);
const isGenderError = ref(false);

const genderOptions = ['남성', '여성'];

const showDatePicker = ref(false);
const showGenderMenu = ref(false);
const showDialog = ref(false)
const dialogMessage = ref("");

const emit = defineEmits(["signUp"]);

const showErrorDialog = (message) => {
  dialogMessage.value = message
  showDialog.value = true
}

const selectGender = (value) => {
  gender.value = value;
  showGenderMenu.value = false;
  isGenderError.value = false;
}

const goToSignUp = () => {
  if (!birth.value) {
    isBirthError.value = true;
    showErrorDialog('생년월일을 입력해주세요.');
    return;
  }

  if (!gender.value) {
    isGenderError.value = true;
    showErrorDialog('성별을 선택해주세요.');
    return;
  }

  const birthFormatted = dayjs(birth.value).format('YYYY-MM-DD');
  const genderFormatted = gender.value === '남성' ? 'M' : 'F'

  emit("signUp", { birth: birthFormatted, gender: genderFormatted });
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

.form-input {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 56px;
  margin-bottom: 12px;
  padding: 0 16px;
  border: solid 2px var(--primary);
  border-radius: 12px;
  font-size: 0.875rem;
}

.form-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 56px;
  margin-top: 8px;
  border-radius: 12px;
  font-size: 0.875rem;
  background-color: var(--primary);
  color: white;
  margin-top: 20px;
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

.v-picker {
  margin: 12px;
}

.error {
  border-color: var(--accent);
}

.v-card {
    padding: 0;
    border-radius: 16px !important;
}

.dialog-background {
    background-color: #FAF8F8;
    border: 1px solid #EFF0F6;
}

.dialog-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 32px 20px 32px;
}

.dialog-error-message {
    margin: 32px 0 16px 0;
    font-size: 1.125rem;
    font-weight: bold;
    color: #757576;
}

.v-card-actions {
    padding: 20px;
}

.v-btn {
    width: 100%;
    margin: 0;
    color: #FFFFFF !important;
    background-color: var(--primary);
    border-radius: 16px;
    height: 48px;
    font-size: 0.875rem;
}
</style>