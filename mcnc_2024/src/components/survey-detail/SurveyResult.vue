<template>
    <div class="root-container">
        <ToolBar @goBack="goBack">
            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
                </template>
                <v-list>
                    <v-list-item v-for="(item, i) in items" :key="i" @click="item.action">
                        <v-list-item-title :class="{ deleteTitle: item.action === remove }">{{ item.title
                            }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </ToolBar>

        <div class="survey-container">
            <div class="header-card">
                <h1 class="survey-title">설문조사 제목</h1>
                <p class="description">설문지 설명</p>
                <p class="period">설문 기간</p>
            </div>
        </div>
        <div class="result-info">
            <div class="total-response">
                <img src="../../assets/images/icon_total_response.svg" class="icon-total" />
                총 응답자 00명
            </div>
            <button class="download">
                <img src="../../assets/images/icon_download.svg" class="icon-download" />
            </button>
        </div>
        <div class="gender-container">
            <div class="text">응답자 성별</div>
            <!-- <PieChart /> -->
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
import { ref, defineProps } from 'vue';
import ToolBar from '@/components/common/ToolBar.vue'
// import PieChart from '@/components/survey-detail/PieChart.vue';
import axios from 'axios';


const props = defineProps({
    id: Number,
})

const baseUrl = process.env.VUE_APP_API_URL;
const router = useRouter();

// 메뉴 버튼 리스트
const items = [
    { title: '공유', action: share },
    { title: '수정', action: edit },
    { title: '종료', action: close },
    { title: '삭제', action: remove }
];

const showDisabledModifyDialog = ref(false);

// 각 버튼에 대한 동작 정의
function share() {
    console.log('share button click');
}

function edit() {
    axios.get(`${baseUrl}/survey/manage/modify/check/${props.id}`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
                if(response.status === 200) {
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

function close() {
    console.log('close button click');
}

function remove() {
    console.log('remove button click');
}
function goBack() {
    router.back();
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
    width: 90%;
    background-color: #F8FBFF;
    border: solid 1px #EFF0F6;
    border-radius: 16px;
    box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.15);
    max-width: 800px;
    padding: 0 12px;
    margin-top: 68px;
}

.header-card {
    background-color: #F8FBFF;
    border: solid 1px #EFF0F6;
    border: none;
    font-size: 1.25rem;
    font-weight: bold;
    color: #464748;
    padding: 16px;
}

.survey-title {
    font-size: 1.25rem;
    font-weight: bold;
    color: #464748;
    text-decoration: underline;
    text-underline-position: under;
    margin-bottom: 4px;
}

.description {
    font-size: 1rem;
    color: #C1C3C5;
    margin-bottom: 20px;
}

.period {
    font-size: 0.875rem;
    color: #757575;
}

.result-info {
    width: 90%;
    max-width: 800px;
    padding: 12px;
    display: flex;
    justify-content: space-between;
    margin-top: 4px;
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

.gender-container {
    width: 90%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    background-color: #FAF8F8;
    border: solid 1px #EFF0F6;
    border-radius: 16px;
    box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.15);
    padding: 20px 16px;
    margin-bottom: 16px;
}
.text{
    color: #8C8C8C;
    font-weight: bold;
    font-size: 1rem;
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