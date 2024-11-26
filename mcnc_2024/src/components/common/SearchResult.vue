<template>
    <div v-if="surveys.length > 0" class="search-results">
        <SurveyCard v-for="survey in surveys" :key="survey.id" :survey="survey" />
    </div>
    <div v-else class="no-results">
        검색 결과가 없습니다.
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
.search-results {
    width: 100%;
    height: 100%;
    display: flex;
    overflow-y: auto;
    margin-top: 12px;
    padding: 4px 24px;
    flex-direction: column;
    gap: 12px;
    padding-bottom: 24px;
}

.no-results {
    width: 100%;
    height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #A2A2A3;
    font-size: 1rem;
    font-weight: bold;
}
</style>
