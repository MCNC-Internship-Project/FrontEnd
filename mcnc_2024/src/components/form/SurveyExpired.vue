<template>
  <div class="survey-completion">
    <!-- 설문 정보 섹션 추가 -->
    <div class="survey-section">
      <div class="survey-title-section">
        <h1 class="survey-title">
          {{ surveyValues.title }}
        </h1>
        <p class="survey-description">{{ surveyValues.description }}</p>
      </div>
      <p class="survey-period">{{ dayjs(surveyValues.createDate).format("YYYY.MM.DD") }} ~ {{ dayjs(surveyValues.expireDate).format("YYYY.MM.DD") }}</p>
    </div>

    <!-- 참여 완료 메시지 -->
    <p class="completion-message">이 설문조사는 종료되었습니다.</p>
    <p class="p1">참여해 주셔서 감사합니다!</p>

    <img src="@/assets/images/icon_puppy.svg" alt="아이콘" class="survey-icon" />

    <p><button @click="goBackToHome">홈으로 이동</button></p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { defineProps } from 'vue';
import dayjs from 'dayjs';

defineProps({
  surveyValues : Object,
})

const router = useRouter();

const goBackToHome = () => {
  router.replace('/');
};
</script>

<style scoped>
  .toolbar {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 64px;
    background-color: #fff;
    z-index: 50;
    top: 0;
    left: 0;
    right: 0;
}

.back {
    width: 20px;
    height: 20px;
    margin-left: 24px;
    cursor: pointer;
}

.survey-completion {
  display : flex;
  flex-direction: column;
  justify-content: center;
  align-items : center;
  margin-top: 80px;
  padding: 0 24px;
}

.survey-section {
  width : 100%;
  background-color: #F8FBFF;
  padding: 16px;
  border-radius: 15px;
  margin-bottom: 20px;
  text-align: left;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 126px;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width : 600px;
}

.survey-title {
  text-decoration: underline;
  text-underline-position : under;
  font-size: 1.25rem;
  font-weight: bold;
  color: #464748;
  margin-bottom: 4px;
  position: relative;
  display: inline-block;
}

.survey-description {
  font-size: 1rem;
  font-weight: bold;
  color: #C1C3C5;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-word;
  white-space: nowrap;
}

.survey-period {
  font-size: 0.75rem;
  color: #8C8C8C;
  margin-top: 10px;
  font-weight: bold;
}

.completion-message {
  font-weight: bold;
  color: #374957;
  margin-top: 40px; 
}

.p1 {
  font-weight: bold;
}

.survey-icon {
  width : 160px;
  margin : 48px 0 48px 0;
}

button {
  background-color: #7796E8;
  color: white;
  font-size : 1rem;
  font-weight : bold;
  padding: 12px 24px;
  border: none;
  border-radius: 15px;
  cursor: pointer;
}

button:hover {
  background-color: #5c7fbb;
}
</style>