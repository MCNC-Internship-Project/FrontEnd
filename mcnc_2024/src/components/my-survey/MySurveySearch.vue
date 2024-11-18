<template>
    <div class="root-container">
        <header class="toolbar">
            <div class="back-container">
                <img class="back" src="../../assets/images/icon_arrow_left.svg" alt="back" @click="goBack" />
            </div>
        </header>

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

            <!--검색 결과가 있는 경우-->
            <div v-else class="result-container">
                <div v-if="filteredSurveys.length > 0" class="search-results">
                    <div v-for="survey in filteredSurveys" :key="survey.id" class="survey-card">
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
                <!--검색 결과가 없는 경우-->
                <div v-if="filteredSurveys.length === 0" class="no-results">
                    검색 결과가 없습니다.
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { mockSurveys } from '@/components/my-survey/mock/Surveys';

const router = useRouter();
const searchQuery = ref('');
const showLogo = ref(true);

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
        // 상태 정렬: "진행중" 우선
        if (a.status === "진행중" && b.status === "종료") return -1;
        if (a.status === "종료" && b.status === "진행중") return 1;

        // "진행중" 상태에서 생성 날짜 내림차순
        if (a.status === "진행중" && b.status === "진행중") {
            return b.createDate - a.createDate;
        }

        // "종료" 상태에서 마감 날짜 내림차순
        if (a.status === "종료" && b.status === "종료") {
            return b.expireDate - a.expireDate;
        }

        return 0;
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
    background-image: url('../../assets/images/background.svg');
    background-size: auto;
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

.survey-container {
    width: 100%;
    height: calc(100vh - 64px); 
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 64px;
    overflow: hidden; /* survey-list 외부 요소는 스크롤되지 않도록 설정 */
}
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
    color: #7796E8;
    font-size: 1rem;
    font-weight: bold;
}
.status-ended {
    color: #757575;
    font-size: 1rem;
    font-weight: bold;
}
.description {
    font-size: 1rem;
    margin-bottom: 20px;
}
.date-range {
    font-size: 1rem;
}
.no-results {
    height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    /* text-align: center; */
    color: #A2A2A3;
    font-size: 1rem;
    font-weight: bold;
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