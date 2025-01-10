<!--
    - 설문 참여 완료
    - @author 성지혜
-->
<template>
  <div class="survey-completion">

    <img src="@/assets/images/icon_complete.svg" alt="아이콘" class="survey-icon" />

      <p class="completion-message">응답이 제출되었습니다!</p>
      <p class="p1">설문에 참여해 주셔서 감사합니다.</p>

    <p><button @click="goBackToHome">홈으로 이동</button></p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBackToHome = () => {
  router.replace('/');  
};
</script>

<style scoped>
.survey-completion {
  display: flex;              
  flex-direction: column;       
  align-items: center;          
  justify-content: center;      
  min-height: 100vh;            
  padding: 0 24px;
  box-sizing: border-box;       
  text-align: center;
}

img {
  width: 134px;                 
  height: 118px;                
  margin-top: 0.5em;           
}

.completion-message {
  font-weight: bold;
  color: #374957;
  margin-top: 20px;             
}

.p1 {
  font-weight: bold;
  margin-top: 10px;             
}

button {
  background-color: #7796E8;
  color: white;
  padding: 10px 20px;
  margin-top: 8.5em;             
  border: none;
  border-radius: 15px;
  cursor: pointer;
}

button:hover {
  background-color: #5c7fbb;
}
</style>