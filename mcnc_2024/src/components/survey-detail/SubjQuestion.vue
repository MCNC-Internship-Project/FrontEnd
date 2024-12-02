<template>
    <div class="question-container">
        <h3 class="question-title">{{ question.body }}</h3>
        <div v-for="(answer, index) in question.subjAnswerList" :key="index" class="answer-box">
            {{ answer }}
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
defineProps({
    question: Object,
});
</script>

<style scoped>
.question-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #FAF8F8;
    border: solid 1px #EFF0F6;
    border-radius: 16px;
    box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.15);
    margin-bottom: 16px;
    padding: 16px;
}

.question-title {
    font-size: 1rem;
    font-weight: bold;
    color: #8C8C8C;
    margin-bottom: 8px;
    background-color: #FFFFFF;
    padding: 8px 12px;
    border-radius: 8px;
}

.answer-box {
  padding: 12px;
  margin-bottom: 8px;
  border: 1px solid #D9D9D9;
  border-radius: 8px;
  background-color: #FFFFFF;
  font-size: 0.875rem;
}
</style>