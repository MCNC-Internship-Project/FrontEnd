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
                <ul>
                    <li v-for="(survey, index) in surveys" :key="index" class="item-list"  @click="onItemClick(survey)" v-ripple>
                        <div class="item-container">
                            <div class="item-title">{{ survey.title }}</div>
                            <div class="item-description">{{ survey.description }}</div>
                            <div class="item-footer-container">
                                <div class="footer-container">
                                    <div class="item-participated">{{ survey.participated }}명 참여</div>
                                    <div class="item-date">{{ formatDate(survey.endDate) }}</div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';

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

const onItemClick = (survey) => {
    console.log(`surveyId: ${survey.surveyId} 클릭`);
};

function formatDate(dateStr) {
    return dateStr.replaceAll('-', '.');
}

const routeJoinSurvey = () => {
    router.push({path : "/joined-survey"});
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
    padding: 16px 24px 8px 24px;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    list-style: none;
    scrollbar-width: none;
}

.item-list {
    width: 100%;
    height: 108px;
    margin-bottom: 16px;
    border-radius: 12px;
    box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
    flex-shrink: 0;
}

.item-container {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 16px 16px 0 16px;
}

.item-title {
    font-size: 0.875rem;
    color: #464748;
    font-weight: bold;
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

.item-footer-container {
    position: absolute;
    bottom: 8px;
    left: 16px;
    right: 16px;
}

.footer-container {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
}

.item-participated {
    color: var(--primary);
}

.item-date {
    color: #B7B7B7;
}
</style>