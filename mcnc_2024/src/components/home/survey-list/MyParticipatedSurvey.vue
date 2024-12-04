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

                <div v-else-if="onLoading" class="skeleton-container">
                    <v-skeleton-loader v-for="n in 3" :key="n" type="image" class="skeleton" />
                </div>

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
import CryptoJS from 'crypto-js';
import dayjs from 'dayjs'

const secretKey = process.env.VUE_APP_API_KEY;
const baseUrl = process.env.VUE_APP_API_URL;
const router = useRouter();

const surveys = ref([])
const onLoading = ref(true)

const routeJoinSurvey = () => {
    router.push("/joined-survey");
}

const encryptId = (id) => {
    return CryptoJS.AES.encrypt(id.toString(), secretKey).toString();
}
const onItemClick = (survey) => {
    const id = survey.surveyId;
    router.push({
        name: "SurveyParticipationDetail",
        params: { id: encryptId(id) }
    })
};

const formatDate = (startDate, endDate) => {
    return `${dayjs(startDate).format('YYYY.MM.DD')} ~ ${dayjs(endDate).format('YYYY.MM.DD')}`;
};

onMounted(() => {
    axios.get(`${baseUrl}/survey/inquiry/respond`, {
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

.skeleton-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 16px 24px;
}

:deep(.v-skeleton-loader__image) {
    width: 100%;
    height: 108px;
    border-radius: 12px;
    margin-bottom: 16px;
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