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
    height: 80vh; 
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center; 
    padding: 0 24px;
}
.search-results {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow-y: auto;
    padding: 12px;
}
.no-results {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #A2A2A3;
    font-size: 1rem;
    font-weight: bold;
}
</style>
