<template>
    <div class="result-container">
        <div v-if="surveys.length > 0" class="search-results">
            <SurveyCard v-for="survey in surveys" :key="survey.id" :survey="survey" />
        </div>
        <div v-else class="no-results">
            검색 결과가 없습니다.
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import SurveyCard from './SurveyCard.vue';

defineProps({
    surveys: Array, // 검색 결과 데이터
});
</script>

<style scoped>
.result-container {
    width: 100%;
    margin: 24px;
    padding: 0 24px;
}
.search-results {
    height: 80vh;
    width: 100%;
    flex: 1; 
    display: flex;
    overflow-y: auto; 
    flex-direction: column;
    gap: 12px;
    padding: 12px;
}
.no-results {
    height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #A2A2A3;
    font-size: 1rem;
    font-weight: bold;
}
</style>
