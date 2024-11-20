<template>
    <div class="root-container">
        <ToolBar @goBack="goBack">
            <SurveyHeader title="참여한 설문" @goSearch="goSearch" />
        </ToolBar>

        <div class="survey-container">
            <!-- 설문 목록이 있을 때와 없을 때를 조건부 렌더링 -->
            <div  class="survey-list" v-if="sortedSurveys.length > 0">
                <SurveyCard v-for="survey in sortedSurveys" :key="survey.id" :survey="survey" />
            </div>
            <div class="survey-none" v-else>
                <p>아직 참여한 설문이 없습니다.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { mockJoinedSurveys } from '@/components/mock/MockJoinedSurveys';
import { computed } from 'vue';

import SurveyCard from '@/components/common/SurveyCard.vue';
import SurveyHeader from '@/components/common/SurveyHeader.vue';
import ToolBar from '@/components/common/ToolBar.vue'

const router = useRouter();

// 설문지 mock데이터 연결 -> api 연동시 수정
const surveys = mockJoinedSurveys.map(survey => ({
    id: survey.surveyId,
    title: survey.title,
    description: survey.description,
    creator: survey.creator,
    createDate: new Date(survey.createDate),
    expireDate: new Date(survey.expireDate),
    creationInfo: `${survey.creator} | ${survey.createDate.split('T')[0]} ~ ${survey.expireDate.split('T')[0]}`,
}));

// 설문지 목록 정렬
const sortedSurveys = computed(() => {
    return [...surveys].sort((a, b) => {
        return b.expireDate - a.expireDate; 
    });
});

function goBack() {
    router.back();
}

function goSearch() {
    router.push("/joined-survey/search");
}
</script>

<style scoped>
.root-container {
    width: 100%;
    background-image: url('../../assets/images/background_pink.svg');
    background-repeat: repeat-x;
    display: flex;
    align-items: center;
    justify-content: center;
}
.survey-container {
    width: 100%;
    height: calc(100vh - 40px); 
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 40px;
    overflow: hidden; /* survey-list 외부 요소는 스크롤되지 않도록 설정 */
}
.survey-list {
    width: 100%;
    height: 100%;
    flex: 1; 
    display: flex;
    overflow-y: auto; 
    margin: 24px;
    padding: 4px 24px;
    flex-direction: column;
    gap: 12px;
}
.survey-none {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: #A2A2A3;
    font-size: 1rem;
    font-weight: bold;
}
</style>