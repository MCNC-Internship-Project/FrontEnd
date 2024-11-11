<template>
    <div id="root-container">
        <div class="sub-container">
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

            <sign-up-step1 :step="step" v-if="step === 1" :userInfo="userId" @nextStep="stepUpTo2"/>
            <sign-up-step2 :step="step" v-if="step === 2" :userInfo="{userName: userName, password: password}" @nextStep="stepUpTo3"/>
            <sign-up-step3 :step="step" v-if="step === 3" :userInfo="{birth: userBirth, gender: userGender}" @signUp="postSignUpRequest"/>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import SignUpStep1 from './signUpStep/SignUpStep1.vue';
import SignUpStep2 from './signUpStep/SignUpStep2.vue';
import SignUpStep3 from './signUpStep/SignUpStep3.vue';
import router from '@/router';

const userId = ref("");
const userName = ref("");
const password = ref("");
const userBirth = ref("");
const userGender = ref("");



const step = ref(1);

const stepBack = () => {
    step.value -= 1

    if(step.value <= 0){
        router.push('/');
    }
}

const stepUpTo2 = (data) => {
    userId.value = data.userId;
    step.value += 1;
}

const stepUpTo3 = (data) => {
    userName.value = data.userName;
    password.value = data.password;
    step.value += 1;
}


const postSignUpRequest = (data) => {
    userBirth.value = data.birth;
    userGender.value = data.gender;
    
    const jsonData = {
        email: userId.value,
        password: password.value,
        gender: userGender.value,
        birth: userBirth.value,
        name: userName.value,
    }
    console.log(JSON.stringify(jsonData));
}
</script>

<style scoped>
.header {
    display : flex;
    align-items: center;
    justify-content: start;
    padding : 24px 24px;
    width : 100%;
}

.back-btn {
    text-indent : -999em;
    background: url("../../assets/images/icon_arrow_left.svg") no-repeat;
    width : 20px;
    height : 20px;
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

/* 데스크탑 최소 너비 1200px */
@media (min-width: 1200px) {
    .sub-container {
        width : 50%;
        margin : 0 auto;
        display : flex;
        flex-direction: column;
        align-items: start;
        justify-content: center;
    }

    .header {
        display : flex;
        align-items: center;
        justify-content: start;
        padding : 10px 10px;
        width : 100%;
    }

    .back-btn {
        text-indent : -999em;
        background: url("../../assets/images/icon_arrow_left.svg") no-repeat;
        margin-left : 20px;
        width : 20px;
        height : 20px;
        background-size: contain;
    }

    /* 버튼  */
    .sign-up-section {
        margin : 0 32px;
        padding : 10px 10px;
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
}
</style>