<template>
    <div class="survey-container">
        <!-- 초기 상태에서 로고 표시 -->
        <div v-if="isFirstLoad && surveys.length === 0" class="logo-container">
            <img class="logo" src="../../assets/images/icon_logo.svg" alt="Survwey Logo" />
            <div class="logo-name">Survwey</div>
        </div>

        <!-- 검색 결과가 있을 때 -->
        <v-infinite-scroll v-else-if="!noResult" :items="surveys" :onLoad="loadSurveys" color="var(--primary)">
            <template v-for="(survey, index) in surveys" :key="survey.id">
                <SurveyCard :survey="survey" :class="{ 'last-item': index === surveys.length - 1 }"
                    @click="goToDetail(survey.surveyId)" />
            </template>
            <template v-slot:empty></template>
        </v-infinite-scroll>

        <!-- 검색 결과가 없을 때 -->
        <div v-else class="search-result-text">검색 결과가 없습니다.</div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import SurveyCard from './SurveyCard.vue';
defineProps({
    surveys: Array,
    isFirstLoad: Boolean,
    noResult: Boolean,
    loadSurveys: Function,
    goToDetail: Function,
});
</script>

<style scoped>
.survey-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 64px;
}

.logo-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(var(--vh, 1vh) * 100 - 65px);
}

.logo {
    width: 42px;
    height: 80vh;
}

.logo-name {
    padding-left: 4px;
    color: var(--primary);
    font-family: var(--font-mont);
    font-size: 1.25rem;
}

.v-infinite-scroll {
    width: 100%;
    overflow: hidden;
}

:deep(.v-infinite-scroll__side:first-child) {
    display: none;
}

.search-result-text {
    text-align: center;
    color: #a2a2a2;
    margin-top: 16px;
}
</style>