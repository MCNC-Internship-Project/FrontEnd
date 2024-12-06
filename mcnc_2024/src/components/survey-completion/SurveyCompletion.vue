<template>
  <div class="survey-completion">

    <img src="@/assets/images/icon_complete.svg" alt="아이콘" class="survey-icon" />

      <!-- 참여 완료 메시지 -->
      <p class="completion-message">응답이 제출되었습니다!</p>
      <p class="p1">설문에 참여해 주셔서 감사합니다.</p>

    <p><button @click="goBackToHome">홈 바로가기</button></p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBackToHome = () => {
  router.push('/');  // 홈 페이지로 돌아가기
};
</script>

<style scoped>
.survey-completion {
  display: flex;              
  flex-direction: column;       /* 세로 방향으로 정렬 */
  align-items: center;          /* 가로 중심 정렬 */
  justify-content: center;      /* 세로 중심 정렬 */
  min-height: 100vh;            /* 화면 전체 높이를 차지 */
  padding: 0 24px;
  box-sizing: border-box;       /* 패딩 포함한 크기 계산 */
  text-align: center;
}

img {
  width: 134px;                 /* 고정 너비 */
  height: 118px;                /* 고정 높이 */
  margin-top: 0.5em;             /* 아이콘과 메시지 간 간격 */
}

.completion-message {
  font-weight: bold;
  color: #374957;
  margin-top: 20px;             /* 아이콘 아래 고정된 간격 */
}

.p1 {
  font-weight: bold;
  margin-top: 10px;             /* 메시지 간 간격 */
}

button {
  background-color: #7796E8;
  color: white;
  padding: 10px 20px;
  margin-top: 8.5em;             /* 메시지와 버튼 사이 고정 간격 */
  border: none;
  border-radius: 15px;
  cursor: pointer;
}

button:hover {
  background-color: #5c7fbb;
}
</style>