<template>
    <div class="root-container">
        <header class="toolbar">
            <div class="back-container">
                <img class="back" src="../../assets/images/icon_arrow_left.svg" alt="back" @click="goBack" />
            </div>
        </header>

        <div class="survey-container">
            <div class="header">
                <img class="list-icon" src="../../assets/images/icon_survey_list.svg" alt="survey list icon" />
                <div class="title">설문지 목록</div>
                <button class="search-btn" @click="goSearch">검색</button>
            </div>

            <!-- 설문 목록이 있을 때와 없을 때를 조건부 렌더링 -->
            <div class="survey-list" v-if="sortedSurveys.length > 0">
                <div v-for="survey in sortedSurveys" :key="survey.id" class="survey-card">
                    <div class="survey-header">
                        <p class="survey-title">{{ survey.title }}</p>
                        <p :class="['status', survey.status === '진행중' ? 'status-active' : 'status-ended']">
                            {{ survey.status }}
                        </p>
                    </div>
                    <p class="description">{{ survey.description }}</p>
                    <p class="date-range">{{ survey.dateRange }}</p>
                </div>
            </div>
            <div class="survey-none" v-else>
                <p>아직 생성된 설문지가 없습니다.<br>첫 번째 설문을 만들어 보세요!</p>
            </div>
        </div>

        <v-fab icon="mdi-plus" color="#7796E8" size="48" absolute @click="goCreateSurvey" />
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { mockSurveys } from '@/components/my-survey/mock/Surveys';
import { computed } from 'vue';

const router = useRouter();

// 설문지 mock데이터 연결 -> api 연동시 수정
const surveys = mockSurveys.map(survey => ({
    id: survey.surveyId,
    title: survey.title,
    description: survey.description,
    status: new Date(survey.expireDate) > new Date() ? "진행중" : "종료",
    createDate: new Date(survey.createDate),
    expireDate: new Date(survey.expireDate),
    dateRange: `${survey.createDate.split('T')[0]} - ${survey.expireDate.split('T')[0]}`,
}));

// 설문지 목록 정렬
const sortedSurveys = computed(() => {
    return [...surveys].sort((a, b) => {
        // 상태 정렬 ("진행중" 우선)
        if (a.status === "진행중" && b.status === "종료") return -1;
        if (a.status === "종료" && b.status === "진행중") return 1;

        // "진행중" 상태 내에서 생성 날짜 기준 내림차순
        if (a.status === "진행중" && b.status === "진행중") {
            return b.createDate - a.createDate; // 생성 날짜 내림차순
        }

        // "종료" 상태 내에서 마감 날짜 기준 내림차순
        if (a.status === "종료" && b.status === "종료") {
            return b.expireDate - a.expireDate; // 마감 날짜 내림차순
        }

        return 0;
    });
});

function goBack() {
    router.back();
}

function goCreateSurvey() {
    router.push("/create-survey");
}

function goSearch() {
    router.push("/my-survey/search");
}
</script>

<style scoped>
.root-container {
    width: 100%;
    background-image: url('../../assets/images/background_sky.svg');
    background-repeat: repeat-x;
    display: flex;
    align-items: center;
    justify-content: center;
}
.toolbar {
    width: 100%;
    height: 64px;
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: space-between;
    left: 0;
    top: 0;
    right: 0;
}
.back-container {
    display: flex;
    align-items: center;
    padding-left: 24px;
}
.back {
    cursor: pointer;
}

.survey-container {
    width: 100%;
    height: calc(100vh - 64px); 
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 64px;
    overflow: hidden; /* survey-list 외부 요소는 스크롤되지 않도록 설정 */
}

.header {
    width: 90%;
    display: flex;
    align-items: center;
    z-index: 1;
    position: sticky;
    top: 0; 
}
.list-icon {
    width: 24px;
    height: 24px;
    margin: 0 12px 0 12px;
}
.title {
    font-family: var(--font-noto-sans);
    color: #464748;
    font-size: 1.5rem;
    font-weight: bold;
}
.search-btn {
    width: 24px;
    height: 24px;
    text-indent: -999em;
    background: url("../../assets/images/icon_search_btn.svg") no-repeat center center;
    background-size: contain;
    cursor: pointer;
    margin-left: auto;
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
.survey-card {
    width: 100%;
    background-color: #fff;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.survey-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.survey-title {
    font-size: 1.25rem;
    font-weight: bold;
}
.status-active {
    color: #7796E8;
    font-size: 1rem;
    font-weight: bold;
}
.status-ended {
    color: #757575;
    font-weight: bold;
    font-size: 1rem;
}
.description {
    margin-bottom: 20px;
    font-family: var(--font-mont);
    font-size: 1rem;
}
.date-range {
    font-size: 0.75rem;
}

.survey-none {
    height: 80vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: #A2A2A3;
    font-size: 1rem;
    font-weight: bold;
}
.v-fab {
    position: fixed;
    bottom: 24px;
    right: 24px;
}
</style>