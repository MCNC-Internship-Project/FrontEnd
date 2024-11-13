<template>
    <div class="root-container">
        <header class="toolbar">
            <div class="back-container">
                <img class="back" src="../../assets/images/icon_arrow_left.svg" alt="back" @click="stepBack">
            </div>
        </header>

        <div class="step-container">
            <div class="step-text">
                {{ step }} / 3 단계
            </div>

            <div class="guide-text">
                회원가입을 진행합니다.
            </div>
        </div>

        <div class="form-container">
            <sign-up-step1 :step="step" v-if="step === 1" :userInfo="userId" @nextStep="stepUpTo2" />
            <sign-up-step2 :step="step" v-if="step === 2" :userInfo="{ userName: userName, password: password }"
                @nextStep="stepUpTo3" />
            <sign-up-step3 :step="step" v-if="step === 3" :userInfo="{ birth: userBirth, gender: userGender }"
                @signUp="postSignUpRequest" />
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
    if (step.value > 1)
        step.value--;
    else
        router.push('/login');
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
.root-container {
    position: relative;
    width: 100%;
}

.toolbar {
    position: relative;
    display: flex;
    align-items: center;
    left: 0;
    top: 0;
    right: 0;
    width: 100%;
    height: 64px;
}

.back-container {
    display: flex;
    align-items: center;
    padding-left: 24px;
}

.back {
    cursor: pointer;
}

.step-container {
    position: relative;
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
    position: relative;
    margin-top: 36px;
}
</style>