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


        <!-- <div class="logo-container">
            <img src="https://www.mcnc.co.kr/images/custom/favicon.png" class="logo" alt="logo" @click="goToHome">
        </div>

        <div class="sign-up-container">
            <form class="form-container" action="#" method="">
                <input type="text" class="form-item" placeholder="사용자명" v-model="userName">
                <input type="email" class="form-item" placeholder="아이디(이메일)" autocomplete="userId" v-model="userId">
                <input type="password" class="form-item" placeholder="비밀번호" autocomplete="new-password" v-model="password">
                <input type="password" class="form-item" placeholder="비밀번호 확인" autocomplete="new-password">

                <button class="submit-btn" type="submit">회원가입</button>
            </form>
        </div> -->
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