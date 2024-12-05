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
                    {{ stepTexts[store.step - 1] }}
                </div>
            </div>

            <div class="form-container">
                <find-password-step1 v-if="store.step === 1" />
                <find-password-step2 v-else-if="store.step === 2" />
                <find-password-step3 v-else @changePassword="changePassword" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useFindPasswordStore } from '@/stores/FindPasswordStore';
import FindPasswordStep1 from './find-password-step/FindPasswordStep1.vue';
import FindPasswordStep2 from './find-password-step/FindPasswordStep2.vue';
import FindPasswordStep3 from './find-password-step/FindPasswordStep3.vue';

const store = useFindPasswordStore(); // pinia store - 비밀번호 찾기 정보 임시 저장
const router = useRouter();

// 단계 별 텍스트
const stepTexts = [
    "아이디를 입력해주세요.",
    "회원정보에 등록한 이메일로 인증",
    "변경할 비밀번호 입력"
]

const stepBack = () => {
    router.replace('/login');
}

const changePassword = () => {
    // 비밀번호 변경 성공 시 로그인 화면으로 이동
    router.replace('/login');
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