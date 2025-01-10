<!--
    - 홈 컴포넌트 내 내가 참여한 설문조사 컴포넌트
    
    - @author 반명우
-->

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
            <div class="body-container">
                <div v-if="surveys.length > 0" class="list-container">
                    <div class="item-container" v-for="(survey, index) in surveys" :key="index"
                        @click="onItemClick(survey)" v-ripple>
                        <div class="item-title">{{ survey.title }}</div>
                        <div class="item-description">{{ survey.description }}</div>
                        <div class="footer-container">
                            <div class="item-date">{{ formatDate(survey.createDate, survey.expireDate) }}</div>
                        </div>
                    </div>
                </div>

                <div v-else-if="onLoading" class="skeleton-container">
                    <v-skeleton-loader v-for="n in 9" :key="n" type="image" class="skeleton" />
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
import { encrypt } from '@/utils/crypto';
import axios from '@/utils/axiosInstance';
import dayjs from 'dayjs'

const router = useRouter();

const surveys = ref([])
const onLoading = ref(true)

const routeJoinSurvey = () => {
    router.push("/respond");
}

const onItemClick = (survey) => {
    const id = survey.surveyId;
    router.push({
        name: "RespondDetail",
        params: { id: encrypt(id) }
    })
};

const formatDate = (startDate, endDate) => {
    return `${dayjs(startDate).format('YYYY.MM.DD')} ~ ${dayjs(endDate).format('YYYY.MM.DD')}`;
};

onMounted(() => {
    axios.get(`/survey/inquiry/respond`, {
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

.body-container {
    width: 100%;
    padding: 16px 24px 92px 24px;
}

.list-container {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
}

.item-container {
    display: flex;
    flex-direction: column;
    height: 120px;
    padding: 16px 16px 8px 16px;
    border-radius: 12px;
    background-color: #FFF;
    border: 1px solid #EFF0F6;
    box-shadow: 0px 5px 16px rgba(8, 15, 52, 0.08);
    cursor: pointer;
    min-width: 0;
}

.item-title {
    font-size: 1rem;
    font-weight: bold;
    color: #464748;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-word;
    white-space: nowrap;
}

.item-description {
    margin-top: 2px;
    font-size: 1rem;
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
}

.item-date {
    color: #B7B7B7;
    font-size: 0.875rem;
}

.skeleton-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    width: 100%;
}

:deep(.v-skeleton-loader__image) {
    width: 100%;
    height: 120px;
    border-radius: 12px;
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

@media screen and (min-width: 768px) {
    .list-container {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .skeleton-container {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media screen and (min-width: 1200px) {
    .list-container {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .skeleton-container {
        grid-template-columns: repeat(3, 1fr);
    }
}
</style>