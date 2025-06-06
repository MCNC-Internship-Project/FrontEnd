<template>
    <div class="root-container">
        <header class="toolbar">
            <img class="back" src="@/assets/images/icon_arrow_left.svg" alt="back" @click="stepBack">
        </header>

        <div class="body-container">
            <div class="step-container">
                <div class="step-text">
                    {{ store.step }} / 3 단계
                </div>

                <div class="guide-text">
                    회원가입을 진행합니다.
                </div>
            </div>

            <div class="form-container">
                <sign-up-step1 v-if="store.step === 1"/>
                <sign-up-step2 v-else-if="store.step === 2"/>
                <sign-up-step3 v-else @signUp="signUp" />
            </div>
        </div>

        <default-dialog v-model="dialog.isVisible" :message="dialog.message" :isPersistent=true @confirm="login" />
    </div>
</template>

<script setup>
/**
 * @fileoverview 회원가입 컴포넌트
 * @author 김원재 (kimwonjae@mcnc.co.kr)
 * @author 반명우 (banmyungwoo@mcnc.co.kr)
 * @date 2024-11-05
 * @lastModified 2024-12-12
 * @description 회원가입 화면
 */

import { ref, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSignUpStore } from '@/stores/SignUpStore';
import { encrypt } from '@/utils/crypto';
import axios from '@/utils/axiosInstance';
import SignUpStep1 from './sign-up-step/SignUpStep1.vue';
import SignUpStep2 from './sign-up-step/SignUpStep2.vue';
import SignUpStep3 from './sign-up-step/SignUpStep3.vue';

const store = useSignUpStore(); // pinia store - 회원가입 정보 임시 저장
const router = useRouter();

const dialog = ref({
    isVisible: false,
    message: ""
});

const showDialog = (message) => {
    dialog.value.message = message;
    dialog.value.isVisible = true;
}

// 뒤로가기 버튼 클릭 시
const stepBack = () => {
    // 2단계 이상이면 이전 단계로 이동, 1단계면 로그인 페이지로 이동
    if (store.step > 1) {
        store.prevStep();
    } else {
        router.push('/login');
    }
}

// 회원가입 성공
const signUp = () => {
    showDialog('회원가입에 성공했습니다.');
}

// 회원가입 성공 후 로그인
const login = () => {
    dialog.value.isVisible = false

    const requestBody = {
        userId: store.userId,
        password: encrypt(store.password)
    }

    // 로그인 API 호출
    axios.post(`/auth/login`, JSON.stringify(requestBody))
        .then(() => {
            sessionStorage.setItem(btoa('isLoggedIn'), btoa(true));
            // 로그인 성공 시 홈으로 이동
            router.replace("/");
        })
        .catch(() => {
            // 로그인 실패 시 로그인 페이지로 이동
            router.replace('/login');
        });
}

onUnmounted(() => {
    // store에 저장된 데이터 초기화
    store.reset();
});
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
</style>