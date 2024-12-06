<template>
    <div class="root-container">
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
                            <div class="item-participated" :class="{ 'expired': !survey.expireDateValid }" >{{ survey.respondCount }}명 참여</div>
                            <v-progress-linear class="survey-progress" bg-color="#D9D9D9" bg-opacity="1"
                                :color="survey.expireDateValid ? 'var(--primary)' : '#707070'" rounded rounded-bar height="4"
                                :model-value="calculateProgress(survey.createDate, survey.expireDate)"></v-progress-linear>
                            <div class="date-container">
                                <div class="date-start">{{ formatDate(survey.createDate) }}</div>
                                <div class="date-end">{{ formatDate(survey.expireDate) }}</div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>

            <div v-else-if="onLoading" class="skeleton-container">
                <v-skeleton-loader v-for="n in 10" :key="n" type="image" class="skeleton" />
            </div>

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
import { encrypt } from '@/utils/crypto';

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
        params: { id: encrypt(survey.surveyId) },
    });
};

const calculateProgress = (startDate, endDate) => {
    const current = dayjs();
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (current.isBefore(start)) {
        return 0;
    }

    if (current.isAfter(end)) {
        return 100;
    }

    if (start.isSame(end)) {
        return 100;
    }

    const total = end.diff(start);
    const elapsed = current.diff(start);

    return Math.max(0, Math.min(100, (elapsed / total) * 100));
};

const formatDate = (dateStr) => {
    const date = dayjs(dateStr);
    const isCurrentYear = date.year() === dayjs().year();
    return isCurrentYear ? date.format('MM.DD') : date.format('YY.MM.DD');
};

onMounted(() => {
    axios.get(`${baseUrl}/survey/inquiry/created`, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        },
        params: {
            page: 0,
            size: 10
        }
    })
        .then((response) => {
            surveys.value = response.data.content;
        })
        .catch((error) => {
            console.error(error);
        })
        .finally(() => {
            onLoading.value = false;
        });
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
    padding-bottom: 20px;
}

ul {
    display: flex;
    overflow-x: scroll;
    margin: 0;
    padding: 16px 8px 20px 24px;
    list-style: none;
}

.item-list {
    flex-shrink: 0;
    width: 240px;
    height: 168px;
    margin-right: 16px;
    border-radius: 12px;
    background-color: #FFF;
    border: 1px solid #EFF0F6;
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

.skeleton-container {
    display: flex;
    width: 100%;
    padding: 16px 8px 20px 24px;
}

:deep(.v-skeleton-loader__image) {
    width: 240px;
    height: 168px;
    border-radius: 12px;
    margin-right: 16px;
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

.expired {
    color: #707070;
}
</style>