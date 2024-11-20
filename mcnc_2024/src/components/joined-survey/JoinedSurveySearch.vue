<template>
    <div class="root-container">
        <ToolBar @goBack="goBack"/>

        <div class="survey-container">
            <div class="search-box">
                <input type="text" placeholder="설문 제목을 검색해보세요." v-model="searchQuery" @keyup.enter="searchSurvey" />
                <button @click="searchSurvey">
                    <img class="search-btn" src="../../assets/images/icon_search_btn.svg" alt="search icon" />
                </button>
            </div>

            <div v-if="showLogo" class="logo-container">
                <img class="logo" src="../../assets/images/icon_logo.svg" alt="logo" />
                <div class="logo-name">Survwey</div>
            </div>

            <!--검색결과-->
            <SearchResult v-else :surveys="filteredSurveys" />
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { mockJoinedSurveys } from '@/components/mock/MockJoinedSurveys';

import ToolBar from '../common/ToolBar.vue';
import SearchResult from '../common/SearchResult.vue';

const router = useRouter();
const searchQuery = ref('');
const showLogo = ref(true);

// 설문지 mock데이터 연결 -> api 연동시 수정
const surveys = mockJoinedSurveys.map(survey => ({
    id: survey.surveyId,
    title: survey.title,
    description: survey.description,
    createDate: new Date(survey.createDate),
    expireDate: new Date(survey.expireDate),
    creationInfo: `${survey.creator} | ${survey.createDate.split('T')[0]} ~ ${survey.expireDate.split('T')[0]}`,
}));

// 검색 결과 정렬
const filteredSurveys = computed(() => {
    // 검색어가 비어 있으면 빈 배열 반환
    if (searchQuery.value.trim() === '') {
        return []; 
    }

    // 검색어 필터링
    let results = surveys.filter(survey =>
        searchQuery.value.trim() === '' || survey.title.includes(searchQuery.value)
    );

    // 검색 결과 목록 정렬
    return results.sort((a, b) => {
        return b.expireDate - a.expireDate;
    });
});

// 검색 함수: 검색 시 로고를 숨김
function searchSurvey() {
    showLogo.value = false; 
}

// 이전화면으로 돌아가기
function goBack() {
    router.back();
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
    height: calc(100vh - 64px); 
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 64px;
    overflow: hidden; 
}

.search-box {
    width: 80%;
    display: flex;
    align-items: center;
    background-color: #f2f6fc;
    border-radius: 8px;
    padding: 8px 12px;
}
.search-btn {
    text-indent: -999em;
    width: 24px;
    height: 24px;
    background: url("../../assets/images/icon_search_btn.svg") no-repeat center center;
    background-size: contain;
    cursor: pointer;
    margin-left: auto;
}
.search-box input {
    width: 100%;
    border: none;
    outline: none;
    background: none;
    padding: 8px;
    font-size: 1rem;
}
.search-box button {
    background: none;
    border: none;
    cursor: pointer;
}

.logo-container {
    display: flex;
    align-items: center;
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
</style>