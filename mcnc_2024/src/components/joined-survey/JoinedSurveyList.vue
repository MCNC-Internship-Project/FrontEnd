<template>
    <div class="root-container">
        <ToolBar @goBack="goBack">
            <SurveyHeader title="참여한 설문" @goSearch="goSearch" />
        </ToolBar>

        <div class="survey-container">
            <!-- 설문 목록이 있을 때와 없을 때를 조건부 렌더링 -->
            <div v-if="allSurveys.length === 0 && isLoading" class="loading-spinner"></div>
            <div v-else-if="allSurveys.length > 0" class="survey-list">
                <SurveyCard 
                    v-for="survey in allSurveys" 
                    :key="survey.id" 
                    :survey="survey" 
                    @click="navigateToDetail" 
                />
                <div ref="observerTarget" class="observer-target" v-show="hasMore">
                    <div v-if="isLoading" class="loading-spinner"></div>
                </div>
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
import { ref, onMounted, onUnmounted, watchEffect } from 'vue';
import SurveyCard from '@/components/common/SurveyCard.vue';
import SurveyHeader from '@/components/common/SurveyHeader.vue';
import ToolBar from '@/components/common/ToolBar.vue';

const router = useRouter();

const observerTarget = ref(null);
const page = ref(1);
const size = 5;
const isLoading = ref(false);
const hasMore = ref(true);
const allSurveys = ref([]);
let observer = null;

// 설문 데이터 가져오기
const fetchSurveys = async () => {
    if (isLoading.value || !hasMore.value) return;

    isLoading.value = true;

    try {
        const response = await fetchMockData();
        if (response.length < size) {
            hasMore.value = false;
        }
        allSurveys.value.push(...response);
        page.value++;
    } catch (error) {
        console.error('설문 데이터를 불러오는 중 오류 발생:', error);
    } finally {
        isLoading.value = false;
    }
};

// Mock 데이터 가져오기
const fetchMockData = () =>
    new Promise((resolve) => {
        setTimeout(() => {
            const sortedMockData = mockJoinedSurveys.sort((a, b) => {
                return new Date(b.expireDate) - new Date(a.expireDate);
            });

            const startIndex = (page.value - 1) * size;
            const mockData = sortedMockData.slice(startIndex, startIndex + size).map((survey) => ({
                id: survey.surveyId,
                title: survey.title,
                description: survey.description,
                creator: survey.creator,
                status: new Date(survey.expireDate) > new Date() ? '진행중' : '종료',
                createDate: new Date(survey.createDate),
                expireDate: new Date(survey.expireDate),
                creationInfo: `${survey.creator} | ${survey.createDate.split('T')[0]} ~ ${survey.expireDate.split('T')[0]}`,
            }));

            resolve(mockData);
        }, 500);
    });

// Intersection Observer 초기화
const initializeObserver = () => {
    observer = new IntersectionObserver(
        (entries) => {
            const target = entries[0];
            if (target.isIntersecting && !isLoading.value && hasMore.value) {
                fetchSurveys();
            }
        },
        {
            root: null,
            rootMargin: '100px',
            threshold: 0.1,
        }
    );

    if (observerTarget.value) {
        observer.observe(observerTarget.value);
    }
};

// Observer 감시
watchEffect(() => {
    if (observerTarget.value) {
        initializeObserver();
    }
});

// Cleanup
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

function goSearch() {
    router.push('/joined-survey/search');
}

function navigateToDetail() {
    router.push('/survey-participation-detail');
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
    justify-content: center;
    align-items: center;
    flex-direction: column;
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
    display: flex;
    align-items: center;
    justify-content: center;
}

.loading-spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #A2A2A3;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>