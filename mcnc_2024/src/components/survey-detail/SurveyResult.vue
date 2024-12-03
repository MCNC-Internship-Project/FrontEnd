<template>
    <div class="root-container">
        <ToolBar @goBack="goBack" backgroundColor="#fff" zIndex="1000">
            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
                </template>
                <v-list>
                    <v-list-item v-for="(item, i) in items" :key="i" @click="item.action">
                        <v-list-item-title :class="{ deleteTitle: item.action === remove }">{{item.title}}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </ToolBar>

        <div v-if="surveyData" class="survey-container">
            <div class="header-container">
                <h1 class="survey-title">{{ surveyData.title }}</h1>
                <p class="description">{{ surveyData.description }}</p>
                <p class="period">설문 기간 {{ formatPeriod(surveyData.createDate, surveyData.expireDate) }}</p>
            </div>
            <div class="result-info">
                <div class="total-response">
                    <img src="../../assets/images/icon_total_response.svg" class="icon-total" />
                    총 응답자 {{ surveyData.responseCount }}명
                </div>
                <button class="download">
                    <img src="../../assets/images/icon_download.svg" class="icon-download" />
                </button>
            </div>
            <div class="result-container">
                <div class="text">응답자 성별</div>
                <GenderChart :genderCountList="surveyData.genderCountList" />
            </div>
            <div class="result-container">
                <div class="text">응답자 연령</div>
                <AgeChart :ageCountList="surveyData.ageCountList" />
            </div>
            <div v-for="question in surveyData.questionList" :key="question.quesId" class="question-container">
                <ResultRenderer :question="question" />
            </div>
        </div>
    </div>

    <v-dialog v-model="showDisabledModifyDialog" max-width="400">
        <v-card class="dialog-background">
            <div class="dialog-container">
                <div class="dialog-error-message">현재 설문에 응답자가 있어 수정이 불가능합니다.</div>
            </div>

            <v-card-actions>
                <v-btn class="dialog-close-btn" @click="showDisabledModifyDialog = false">
                    확인
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, defineProps, onMounted } from 'vue';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import ToolBar from '@/components/common/ToolBar.vue'
import AgeChart from './AgeChart.vue';
import GenderChart from './GenderChart.vue';
import ResultRenderer from '@/components/survey-detail/ResultRenderer.vue';

const surveyData = ref(null);
const secretKey = process.env.VUE_APP_API_KEY;
const baseUrl = process.env.VUE_APP_API_URL;
const router = useRouter();
const showDisabledModifyDialog = ref(false);

const props = defineProps({
    id: String,
})

// 암호화
const decryptId = (encryptedId) => {
    const bytes = CryptoJS.AES.decrypt(encryptedId, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}

// 메뉴 버튼 리스트
const items = [
    { title: '공유', action: share },
    { title: '수정', action: edit },
    { title: '종료', action: close },
    { title: '삭제', action: remove }
];

onMounted(() => {
    fetchSurveyData();
});

// 설문 데이터 가져오기 (api 연결)
async function fetchSurveyData() {
    try {
        const decryptedId = decryptId(props.id);
        const response = await axios.get(`${baseUrl}/survey/response/result/${decryptedId}`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        surveyData.value = response.data;
    } catch (error){
        console.error('설문 데이터를 불러오는 중 오류 발생:', error);
    }
}

// 공유 버튼 클릭
function share() {
    console.log('share button click');
}

// 수정 버튼 클릭
function edit() {
    axios.get(`${baseUrl}/survey/manage/modify/check/${Number(decryptId(props.id))}`, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((response) => {
            if (response.status === 200) {
                router.push({
                    name: "update-survey",
                    params: { id: props.id },
                });
            }
        })
        .catch((error) => {
            console.error(error);
            showDisabledModifyDialog.value = true;
        })
}

// 종료 버튼 클릭
function close() {
    console.log('close button click');
}

// 삭제 버튼 클릭
function remove() {
    console.log('remove button click');
}
function goBack() {
    router.back();
}

// YYYY.MM.DD 형식으로 변환하는 함수
function formatDateToYMD(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
}

// 설문 기간 포맷 함수
function formatPeriod(startDate, endDate) {
    return `${formatDateToYMD(startDate)} - ${formatDateToYMD(endDate)}`;
}
</script>

<style scoped>
.root-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.v-list-item-title {
    font-size: 0.875rem;
}

.deleteTitle {
    color: #F77D7D !important;
}

.survey-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    padding: 0 24px;
    margin-top: 68px;
    max-width: 800px;
}

.header-container {
    background-color: #F8FBFF;
    border: solid 1px #EFF0F6;
    box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.15);
    border-radius: 15px;
    padding: 8px 8px;
    box-sizing: border-box;
}

.survey-title {
    font-size: 1.25rem;
    font-weight: bold;
    color: #464748;
    text-decoration: underline;
    text-underline-position: under;
    margin: 12px 16px 0px;
}

.description {
    font-size: 1rem;
    color: #C1C3C5;
    margin: 12px 16px 0px;
    font-weight: bold;
}

.period {
    font-size: 0.875rem;
    color: #757575;
    margin: 32px 12px 0 12px;
    padding: 0 4px;
    height: 32px;
    font-weight: bold;
    font-size: 0.8175rem;
    color: #757575;
}

.result-info {
    width: 100%;
    padding: 12px;
    padding-bottom: 0px;
    display: flex;
    justify-content: space-between;
}

.total-response {
    font-size: 1rem;
    font-weight: bold;
    color: #464748;
}

.icon-total {
    width: 20px;
    height: 20px;
    position: relative;
    top: 4px;
}

.download {
    width: 20px;
}

.result-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #FAF8F8;
    border: solid 1px #EFF0F6;
    border-radius: 16px;
    box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.15);
    margin-bottom: 16px;
    padding: 20px 16px 0px 16px;
}

.text {
    color: #8C8C8C;
    font-weight: bold;
    font-size: 1rem;
    padding-left: 4px;
}

.v-card {
    padding: 0;
    border-radius: 16px !important;
}

.dialog-background {
    background-color: #FAF8F8;
    border: 1px solid #EFF0F6;
}

.dialog-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 32px 20px 32px;
}

.dialog-error-message {
    margin: 32px 0 16px 0;
    font-size: 1.125rem;
    font-weight: bold;
    color: #757576;
}

.v-card-actions {
    padding: 20px;
}

.v-card {
    padding: 0;
    border-radius: 16px !important;
}

.dialog-background {
    background-color: #FAF8F8;
    border: 1px solid #EFF0F6;
}

.dialog-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 32px 20px 32px;
}

.dialog-error-message {
    margin: 32px 0 16px 0;
    font-size: 1.125rem;
    font-weight: bold;
    color: #757576;
}

.v-card-actions {
    padding: 20px;
}

.v-card-actions .v-btn {
    width: 100%;
    margin: 0;
    color: #FFFFFF !important;
    background-color: var(--primary);
    border-radius: 16px;
    height: 48px;
    font-size: 0.875rem;
}

.v-card {
    padding: 0;
    border-radius: 16px !important;
}

.dialog-background {
    background-color: #FAF8F8;
    border: 1px solid #EFF0F6;
}

.dialog-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 32px 20px 32px;
}

.dialog-error-message {
    margin: 32px 0 16px 0;
    font-size: 1.125rem;
    font-weight: bold;
    color: #757576;
}

.v-card-actions {
    padding: 20px;
}

.v-card {
    padding: 0;
    border-radius: 16px !important;
}

.dialog-background {
    background-color: #FAF8F8;
    border: 1px solid #EFF0F6;
}

.dialog-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 32px 20px 32px;
}

.dialog-error-message {
    margin: 32px 0 16px 0;
    font-size: 1.125rem;
    font-weight: bold;
    color: #757576;
}

.v-card-actions {
    padding: 20px;
}

.v-card-actions .v-btn {
    width: 100%;
    margin: 0;
    color: #FFFFFF !important;
    background-color: var(--primary);
    border-radius: 16px;
    height: 48px;
    font-size: 0.875rem;
}
</style>