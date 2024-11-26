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

                        <div class="footer-container">
                            <div class="item-participated">{{ survey.respondCount }}명 참여</div>
                            <v-progress-linear class="survey-progress" bg-color="#D9D9D9" bg-opacity="1"
                                color="var(--primary)" rounded rounded-bar height="4"
                                :model-value="calculateProgress(survey.createDate, survey.expireDate)"></v-progress-linear>
                            <div class="date-container">
                                <div class="date-start">{{ formatDate(survey.createDate) }}</div>
                                <div class="date-end">{{ formatDate(survey.expireDate) }}</div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <div v-else class="empty-container">
                <div v-if="!onLoading" class="empty-text">생성한 설문조사가 없습니다.</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios';

import dayjs from 'dayjs'

const baseUrl = process.env.VUE_APP_API_URL;
const router = useRouter();

const surveys = ref([])
const onLoading = ref(true)

const routeMySurvey = () => {
    router.push({ path: "/my-survey" });
}

const onItemClick = (survey) => {
    router.push({
        name: "SurveyResult",
        params: { id : survey.surveyId },
    });
};

const calculateProgress = (startDate, endDate) => {
    const currentDate = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    const totalDuration = end - start
    const elapsedDuration = currentDate - start

    let progress = (elapsedDuration / totalDuration) * 100

    if (progress < 0) progress = 0
    if (progress > 100) progress = 100

    return progress
};

const formatDate = (dateStr) => {
    return dayjs(dateStr).format('MM.DD');
};

onMounted(() => {
    axios.get(`${baseUrl}/survey/inquiry/created`, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        },
        params: {
            page: 0,
            size: 3
        }
    })
        .then((response) => {
            console.log(response);
            surveys.value = response.data.content;
            onLoading.value = false;
        })
        .catch(error => {
            console.error(error);

            // 임시 데이터
            surveys.value = [
                {
                    surveyId: 1,
                    title: "2024년 개발자 선호 프레임워크 조사",
                    description: "프론트엔드/백엔드 개발자들이 선호하는 프레임워크와 개발 도구를 조사합니다",
                    createDate: "2024-10-01T09:00:00.000Z",
                    expireDate: "2024-10-31T23:59:59.999Z",
                    respondCount: 145
                },
                {
                    surveyId: 2,
                    title: "원격근무 만족도 조사",
                    description: "코로나19 이후 정착된 원격근무 환경에 대한 직원들의 만족도를 조사합니다",
                    createDate: "2024-11-10T08:30:00.000Z",
                    expireDate: "2024-11-25T18:00:00.000Z",
                    respondCount: 78
                },
                {
                    surveyId: 3,
                    title: "신규 서비스 사용자 피드백",
                    description: "최근 출시된 베타 서비스에 대한 초기 사용자들의 의견을 수집합니다",
                    createDate: "2024-11-24T00:00:00.000Z",
                    expireDate: "2024-12-31T23:59:59.999Z",
                    respondCount: 32
                }
            ];
        })
});
</script>

<style scoped>
.root-container {
    width: 100%;
}

.title-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0 24px;
}

.title-text {
    font-size: 1.25rem;
    font-weight: bold;
    color: #464748;
}

.show-all-text {
    cursor: pointer;
    font-size: 1rem;
    color: #B4B4B4;
}

.list-container {
    width: 100%;
}

ul {
    display: flex;
    overflow-x: scroll;
    margin: 0;
    padding: 16px 8px 40px 24px;
    list-style: none;
}

.item-list {
    flex-shrink: 0;
    width: 240px;
    height: 168px;
    margin-right: 16px;
    border-radius: 12px;
    box-shadow: 0px 5px 16px rgba(8, 15, 52, 0.08);
    cursor: pointer;
}

.item-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 20px 20px 12px 20px;
}

.item-title {
    width: 100%;
    font-size: 1rem;
    font-weight: bold;
    color: #414141;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-word;
    white-space: nowrap;
}

.item-description {
    display: -webkit-box;
    width: 100%;
    margin-top: 4px;
    font-size: 0.875rem;
    color: #8D8D8D;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-word;
    white-space: normal;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.footer-container {
    margin-top: auto;
}

.item-participated {
    margin-bottom: 4px;
    font-size: 0.8125rem;
    color: var(--primary);
    text-align: right;
}

.date-container {
    display: flex;
    justify-content: space-between;
    font-size: 0.8125rem;
    color: #B7B7B7;
}

.empty-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 224px;
}

.empty-text {
    font-size: 1.125rem;
    color: #7796E8;
}
</style>