<template>
    <div class="root-container">
        <ToolBar @goBack="goBack">
            <SurveyHeader title="설문지 목록" @goSearch="goSearch" />
        </ToolBar>

        <div class="survey-container">
            <div class="survey-list" v-if="displayedSurveys.length > 0">
                <SurveyCard v-for="survey in displayedSurveys" :key="survey.id" :survey="survey" />
                <div ref="observerTarget" class="observer-target" v-show="hasMore">
                    <div v-if="isLoading" class="loading">
                        로딩 중...
                    </div>
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
import { mockMySurveys } from '@/components/mock/MockMySurveys';
import { ref, onMounted, onUnmounted, computed, watchEffect } from 'vue';
import SurveyCard from '@/components/common/SurveyCard.vue';
import ToolBar from '@/components/common/ToolBar.vue'
import SurveyHeader from '@/components/common/SurveyHeader.vue';

const router = useRouter();
const observerTarget = ref(null);
const page = ref(1);
const size = 5;
const isLoading = ref(false);
const hasMore = ref(true);
const allSurveys = ref([]);

let observer = null;

// 설문지 mock데이터 연결 -> api 연동시 수정
// const surveys = mockMySurveys.map(survey => ({
//     id: survey.surveyId,
//     title: survey.title,
//     description: survey.description,
//     status: new Date(survey.expireDate) > new Date() ? "진행중" : "종료",
//     createDate: new Date(survey.createDate),
//     expireDate: new Date(survey.expireDate),
//     creationInfo: `${survey.createDate.split('T')[0]} ~ ${survey.expireDate.split('T')[0]}`,
// }));

// 화면에 보여질 설문 목록
const displayedSurveys = computed(() => {
    return [...allSurveys.value].sort((a, b) => {
        if (a.status === "진행중" && b.status === "종료") return -1;
        if (a.status === "종료" && b.status === "진행중") return 1;

        if (a.status === "진행중" && b.status === "진행중") {
            return b.createDate - a.createDate;
        }

        if (a.status === "종료" && b.status === "종료") {
            return b.expireDate - a.expireDate;
        }

        return 0;
    });
});

// Intersection Observer 초기화 함수
const initializeObserver = () => {
    if (observer) {
        observer.disconnect();
    }

    observer = new IntersectionObserver(
        (entries) => {
            const target = entries[0];
            if (target.isIntersecting && !isLoading.value && hasMore.value) {
                console.log('Observer triggered - Loading more surveys'); // 디버깅용
                fetchSurveys();
            }
        },
        {
            root: null,
            rootMargin: '100px',
            threshold: 0.1
        }
    );

    if (observerTarget.value) {
        observer.observe(observerTarget.value);
        console.log('Observer started watching target'); // 디버깅용
    }
};

// 설문 데이터를 가져오는 함수
async function fetchSurveys() {
    if (!hasMore.value || isLoading.value) return;

    isLoading.value = true;
    console.log('Fetching surveys for page:', page.value); // 디버깅용

    try {
        const response = await fetchMockData();

        if (response.length < size) {
            hasMore.value = false;
            console.log('No more surveys to load'); // 디버깅용
        }

        allSurveys.value = [...allSurveys.value, ...response];
        page.value++;

        console.log('Surveys loaded:', response.length); // 디버깅용

    } catch (error) {
        console.error('설문 데이터를 불러오는 중 오류가 발생했습니다:', error);
    } finally {
        isLoading.value = false;
    }
}

// Observer 타겟 요소 감시
watchEffect(() => {
    if (observerTarget.value && !isLoading.value) {
        initializeObserver();
    }
});

// Mock 데이터를 가져오는 함수
function fetchMockData() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const startIndex = (page.value - 1) * size;
            const mockData = mockMySurveys.slice(startIndex, startIndex + size).map(survey => ({
                id: survey.surveyId,
                title: survey.title,
                description: survey.description,
                status: new Date(survey.expireDate) > new Date() ? "진행중" : "종료",
                createDate: new Date(survey.createDate),
                expireDate: new Date(survey.expireDate),
                creationInfo: `${survey.createDate.split('T')[0]} ~ ${survey.expireDate.split('T')[0]}`,
            }));
            resolve(mockData);
        }, 500);
    });
}

onMounted(() => {
    fetchSurveys();
    initializeObserver();
});

onUnmounted(() => {
    if (observer) {
        observer.disconnect();
    }
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

.survey-container {
    width: 100%;
    height: calc(100vh - 40px);
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 40px;
    overflow: hidden;
}

.survey-list {
    width: 100%;
    height: 100%;
    flex: 1;
    display: flex;
    overflow-y: auto;
    margin-top: 24px;
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

.observer-target {
    width: 100%;
    height: 20px;
    margin-top: 12px;
}

.loading {
    text-align: center;
    padding: 1rem;
    color: #A2A2A3;
}

.v-fab {
    position: fixed;
    bottom: 24px;
    right: 24px;
}
</style>