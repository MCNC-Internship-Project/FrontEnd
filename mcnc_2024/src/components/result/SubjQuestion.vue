<template>
    <div class="question-container">
        <h3 class="question-title">{{ question.body }}</h3>
        <div v-if="question.subjAnswerList.length > 0">
            <div v-for="(answer, index) in question.subjAnswerList" :key="index" class="answer-box">
                {{ answer }}
            </div>
        </div>
        <div v-else class="no-answer-box">
            아직 등록된 답변이 없습니다!
        </div>
    </div>
</template>

<script setup>
/**
 * @fileoverview 설문통계 - 주관식 항목 렌더링 컴포넌트
 * @author 김은수 (kimeunsu@mcnc.co.kr)
 * @date 2024-12-10
 * @lastModified 2024-12-16
 * @description 설문 주관식 응답을 목록 형태로 렌더링하고, 응답이 없을 경우 메시지를 표시하는 컴포넌트.
 */

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
    color: #2C2B2B;
    margin-bottom: 8px;
    background-color: #FFFFFF;
    padding: 8px 12px;
    border-radius: 8px;
    white-space: pre-wrap;
}

.answer-box {
    padding: 12px;
    margin-bottom: 8px;
    border: 1px solid #D9D9D9;
    border-radius: 8px;
    background-color: #FFFFFF;
    font-size: 0.875rem;
    white-space: pre-wrap;
}

.no-answer-box {
    padding: 12px;
    font-size: 0.875rem;
    color: #8C8C8C;
    text-align: center;
}
</style>