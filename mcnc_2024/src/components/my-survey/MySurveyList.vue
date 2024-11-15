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
            <div class="survey-list" v-if="surveys.length > 0">
                <div v-for="survey in surveys" :key="survey.id" class="survey-card">
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

const router = useRouter();

const surveys = [
    {
        id: 1,
        title: "설문조사 제목",
        description: "설문지 설명",
        status: "진행중",
        dateRange: "2024.01.01 - 2024.12.31",
    },
    {
        id: 2,
        title: "설문조사 제목",
        description: "설문지 설명",
        status: "종료",
        dateRange: "2024.01.01 - 2024.12.31",
    },
    {
        id: 3,
        title: "설문조사 제목",
        description: "설문지 설명",
        status: "종료",
        dateRange: "2024.01.01 - 2024.12.31",
    },
];

function goBack() {
    router.back();
}

function goCreateSurvey() {
    router.push("/create-survey");
}

function goSearch() {
    router.push("/my-survey-search");
}
</script>

<style scoped>
.root-container {
    background-image: url('../../assets/images/background.svg');
    background-size: auto;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.toolbar {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: space-between;
    left: 0;
    top: 0;
    right: 0;
    width: 100%;
    height: 64px;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 64px;
}

.header {
    width: 90%;
    display: flex;
    align-items: center;
}

.list-icon {
    width: 24px;
    height: 24px;
    margin: 0 12px 0 12px;
}

.title {
    font-family: var(--font-noto-sans);
    font-size: 1.5rem;
    font-weight: bold;
    color: #464748;
}

.search-btn {
    text-indent: -999em;
    background: url("../../assets/images/icon_search_btn.svg") no-repeat center center;
    background-size: contain;
    width: 24px;
    height: 24px;
    cursor: pointer;
    margin-left: auto;
}

.survey-list {
    height: 100%;
    width: 100%;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.survey-card {
    background-color: #fff;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
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
    font-size: 1rem;
    font-weight: bold;
    color: #7796E8; 
}
.status-ended {
    font-size: 1rem;
    font-weight: bold;
    color: #757575;
}
.description{
    font-size: 1rem;
    margin-bottom: 20px;
}
.date-range{
    font-size: 1rem;
}
.survey-none {
    height: 80vh;
    color: #A2A2A3;
    font-size: 1rem;
    font-weight: bold;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
}

.v-fab {
    position: fixed;
    bottom: 24px;
    right: 24px;
    /* z-index: 1000; */
}
</style>