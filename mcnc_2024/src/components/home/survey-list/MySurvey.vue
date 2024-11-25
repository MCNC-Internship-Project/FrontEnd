<template>
    <div id="root-container">
        <div class="title-container">
            <div class="title-text">
                내 설문조사
            </div>

            <div class="show-all-text" @click="routeMySurvey">
                모두보기
            </div>
        </div>

        <div class="list-container">
            <ul v-if="surveys.length > 0">
                <li v-for="(survey, index) in surveys" :key="index" class="item-list" @click="onItemClick(survey)"
                    v-ripple>
                    <div class="item-container">
                        <div class="item-title">{{ survey.title }}</div>
                        <div class="item-description">{{ survey.description }}</div>

                        <div class="item-footer-container">
                            <div class="item-participated">{{ survey.participated }}명 참여</div>
                            <v-progress-linear class="survey-progress" bg-color="#D9D9D9" bg-opacity="1"
                                color="var(--primary)" rounded rounded-bar height="4"
                                :model-value="calculateProgress(survey.startDate, survey.endDate)"></v-progress-linear>
                            <div class="date-container">
                                <div class="date-start">{{ formatDate(survey.startDate) }}</div>
                                <div class="date-end">{{ formatDate(survey.endDate) }}</div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <div v-else class="empty-container">
                <div class="empty-text">생성한 설문조사가 없습니다.</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter();

const surveys = ref([
    {
        surveyId: 1,
        title: '설문조사 제목 1 설문조사 제목 1 설문조사 제목 1',
        description: '설문조사 설명 설문조사 설명 설문조사설명 설문조사 설명 설문조사 설명',
        participated: 10,
        startDate: '2024-11-06',
        endDate: '2024-11-13'
    },
    {
        surveyId: 2,
        title: '설문조사 제목 2',
        description: '설문조사 설명',
        participated: 15,
        startDate: '2024-11-01',
        endDate: '2024-11-25'
    },
    {
        surveyId: 3,
        title: '설문조사 제목 3',
        description: '설문조사 설명',
        participated: 5,
        startDate: '2024-11-05',
        endDate: '2024-11-30'
    },
])

const routeMySurvey = () => {
    router.push({ path: "/my-survey" });
}

const onItemClick = (survey) => {
    console.log(`surveyId: ${survey.surveyId} 클릭`);
};

function calculateProgress(startDate, endDate) {
    const currentDate = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    const totalDuration = end - start
    const elapsedDuration = currentDate - start

    let progress = (elapsedDuration / totalDuration) * 100

    if (progress < 0) progress = 0
    if (progress > 100) progress = 100

    return progress
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}.${day}`;
}
</script>

<style scoped>
.root-container {
    width: 100%;
}

.title-container {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 24px;
}

.title-text {
    color: #464748;
    font-weight: bold;
    font-size: 1.25rem;
}

.show-all-text {
    position: absolute;
    right: 24px;
    font-size: 1rem;
    color: #B4B4B4;
}

.list-container {
    width: 100%;
}

ul {
    margin: 0;
    padding: 16px 8px 40px 24px;
    overflow-x: scroll;
    list-style: none;
    white-space: nowrap;
    scrollbar-width: none;
    display: flex;
}

.item-list {
    width: 240px;
    height: 168px;
    margin-right: 16px;
    border-radius: 12px;
    box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
    flex-shrink: 0;
}

.item-container {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 20px;
}

.item-title {
    width: 100%;
    color: #414141;
    font-weight: bold;
    font-size: 1rem;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-word;
    white-space: nowrap;
}

.item-description {
    width: 100%;
    margin-top: 4px;
    font-size: 0.875rem;
    color: #8D8D8D;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-word;
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: normal;
}

.item-participated {
    margin-bottom: 4px;
    font-size: 0.8125rem;
    color: var(--primary);
    text-align: right;
}

.item-footer-container {
    position: absolute;
    bottom: 12px;
    left: 20px;
    right: 20px;
}

.date-container {
    display: flex;
    justify-content: space-between;
    font-size: 0.8125rem;
    color: #B7B7B7;
}

.empty-container {
    width: 100%;
    height: 224px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.empty-text {
    font-size: 1.125rem;
    color: #7796E8;
}
</style>