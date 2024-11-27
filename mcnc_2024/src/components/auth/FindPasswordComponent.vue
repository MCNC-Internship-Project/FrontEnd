<template>
    <div class="root-container">
        <header class="toolbar">
            <img class="back" src="@/assets/images/icon_arrow_left.svg" alt="back" @click="stepBack">
        </header>

        <div class="body-container">
            <div class="step-container">
                <div class="step-text">
                    비밀번호 찾기
                </div>

                <div class="guide-text">
                    {{ stepTexts[step - 1] }}
                </div>
            </div>

            <div class="form-container">
                <find-password-step1 :step="step" v-show="step === 1" @nextStep="stepUpTo2" />
                <find-password-step2 :step="step" :userId="userId" :email="email" v-show="step === 2" @nextStep="stepUpTo3" />
                <find-password-step3 :step="step" v-show="step === 3" @changePassword="changePasswordRequest" />
            </div>
        </div>

        <v-dialog v-model="showDialog" max-width="400">
            <v-card>
                <div class="dialog-container">
                    <div class="dialog-error-message">{{ dialogMessage }}</div>
                </div>
                <v-card-actions>
                    <v-btn color="primary" text @click="showDialog = false">
                        확인
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import FindPasswordStep1 from './find-password-step/FindPasswordStep1.vue';
import FindPasswordStep2 from './find-password-step/FindPasswordStep2.vue';
import FindPasswordStep3 from './find-password-step/FindPasswordStep3.vue';
import router from '@/router';
import axios from 'axios';

const baseUrl = process.env.VUE_APP_API_URL;

const step = ref(1);
const stepTexts = [
    "아이디를 입력해주세요.",
    "회원정보에 등록한 이메일로 인증",
    "변경할 비밀번호 입력"
]

const userId = ref("");
const email = ref("");

const showDialog = ref(false)
const dialogMessage = ref("")

const stepBack = () => {
    router.replace('/login');
}

const stepUpTo2 = (data) => {
    userId.value = data.userId;
    email.value = data.email;
    step.value += 1;
}

const stepUpTo3 = () => {
    step.value += 1;
}

const changePasswordRequest = (data) => {
    const jsonData = {
        userId: userId.value,
        password: data.password
    }

    // TODO: 비밀번호 변경 API 호출
    axios.post(`${baseUrl}/account/modify/password`,  JSON.stringify(jsonData), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(() => {
            router.replace('/login');
        })
        .catch((error) => {
            showErrorDialog(error.response.data.errorMessage);
        });
}

const showErrorDialog = (message) => {
    dialogMessage.value = message
    showDialog.value = true
}
</script>

<style scoped>
.root-container {
    width: 100%;
}

.toolbar {
    display: flex;
    align-items: center;
    width: 100%;
    height: 64px;
}

.back {
    width: 20px;
    height: 20px;
    margin-left: 24px;
    cursor: pointer;
}

.body-container {
    margin: 0 auto;
    max-width: 400px;
}

.step-container {
    margin: 12px 24px 0;
}

.step-text {
    font-size: 0.75rem;
    color: #97969C;
}

.guide-text {
    margin-top: 8px;
    font-size: 1rem;
    font-weight: bold;
    color: #464748;
}

.form-container {
    margin-top: 36px;
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

.v-btn {
    width: 100%;
    margin: 0;
    color: #FFFFFF !important;
    background-color: var(--primary);
    border-radius: 16px;
    height: 48px;
    font-size: 0.875rem;
}
</style>