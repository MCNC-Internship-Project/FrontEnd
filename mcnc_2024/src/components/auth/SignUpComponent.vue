<template>
    <div id="root-container">

        <div class="header">
            <div class="back-btn" @click="stepBack">뒤로가기</div>
        </div>

        <div class="sign-up-section">
            <div class="step">
                단계 {{ step }} / 3
            </div>

            <div class="guide-text">
                회원가입을 진행합니다.
            </div>
        </div>

        <sign-up-step1 :step="step" v-if="step === 1" @nextStep="stepUp"/>
        <sign-up-step2 :step="step" v-if="step === 2" @nextStep="stepUp"/>
        <sign-up-step3 :step="step" v-if="step === 3"/>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import SignUpStep1 from './signUpStep/SignUpStep1.vue';
import SignUpStep2 from './signUpStep/SignUpStep2.vue';
import SignUpStep3 from './signUpStep/SignUpStep3.vue';
import router from '@/router';

const step = ref(1);

const stepBack = () => {
    step.value -= 1

    if(step.value <= 0){
        router.push('/');
    }
}

const stepUp = () => {
    step.value += 1
}
</script>

<style scoped>
.header {
    display : flex;
    align-items: center;
    justify-content: start;
    padding : 10px 10px;
    width : 100%;
}

.back-btn {
    text-indent : -999em;
    background: url("../../common/back_btn_icon.png") no-repeat;
    width : 32px;
    height : 32px;
    background-size: contain;
}

/* 버튼  */
.sign-up-section {
    padding : 10px 20px;
}

.step {
    font-size : 0.75rem;
    color : #97969C;
}

.guide-text {
    margin-top : 8px;
    font-weight: bold;
    font-size : 1rem;
    color : #000000;
    font-family: 'Noto Sans', sans-serif;
}
</style>