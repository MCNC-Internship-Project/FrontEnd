<template>
    <div class="root-container">

        <div class="title-section">
            <div class="title-container">
                <div class="title-text">
                    참여한 설문조사
                </div>

                <div class="show-all-text" @click="routeJoinSurvey">
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
                                <div class="item-date">{{ formatDate(survey.createDate, survey.expireDate) }}</div>
                            </div>
                        </div>
                    </li>
                </ul>
                <div v-else class="empty-container">
                    <div v-if="!onLoading" class="empty-text">참여한 설문조사가 없습니다.</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import axios from 'axios';

import dayjs from 'dayjs'

const baseUrl = process.env.VUE_APP_API_URL;
const router = useRouter();

const surveys = ref([])
const onLoading = ref(true)

const onItemClick = (survey) => {
    console.log(`surveyId: ${survey.surveyId} 클릭`);
};

const formatDate = (startDate, endDate) => {
    return `${dayjs(startDate).format('YYYY.MM.DD')} ~ ${dayjs(endDate).format('YYYY.MM.DD')}`;
};

const routeJoinSurvey = () => {
    router.push({ path: "/joined-survey" });
}

onMounted(() => {
    axios.get(`${baseUrl}/survey/inquiry/respond`, {
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
            surveys.value = response.data.content;
            onLoading.value = false;
        })
        .catch(error => {
            console.error(error);

            // 임시 데이터
            surveys.value = [
                {
                    surveyId: 4,
                    title: '2024년 회사 연말 행사 선호도 조사',
                    description: '직원들이 선호하는 연말 행사 형태와 시기를 조사합니다',
                    createDate: '2024-10-15T09:00:00.000Z',
                    expireDate: '2024-12-01T23:59:59.999Z',
                    respondCount: 82
                },
                {
                    surveyId: 5,
                    title: '사내 동호회 수요 조사',
                    description: '신규 동호회 개설을 위한 직원들의 관심사를 파악합니다',
                    createDate: '2024-11-01T09:00:00.000Z',
                    expireDate: '2024-12-15T23:59:59.999Z',
                    respondCount: 45
                },
                {
                    surveyId: 6,
                    title: '구내 식당 메뉴 만족도 조사',
                    description: '구내 식당 메뉴 개선을 위한 의견을 수집합니다',
                    createDate: '2024-11-20T09:00:00.000Z',
                    expireDate: '2024-12-20T23:59:59.999Z',
                    respondCount: 156
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
    margin: 0;
    padding: 16px 24px 8px 24px;
    list-style: none;
}

.item-list {
    flex-shrink: 0;
    width: 100%;
    height: 108px;
    margin-bottom: 16px;
    border-radius: 12px;
    box-shadow: 0px 5px 16px rgba(8, 15, 52, 0.08);
    cursor: pointer;
}

.item-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 16px 16px 8px 16px;
}

.item-title {
    font-size: 0.875rem;
    font-weight: bold;
    color: #464748;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-word;
    white-space: nowrap;
}

.item-description {
    margin-top: 2px;
    font-size: 0.875rem;
    color: #8D8D8D;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-word;
    white-space: nowrap;
}

.footer-container {
    display: flex;
    justify-content: flex-end;
    margin-top: auto;
    font-size: 0.75rem;
}

.item-date {
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