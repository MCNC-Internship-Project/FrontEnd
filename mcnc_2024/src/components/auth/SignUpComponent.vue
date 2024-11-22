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
            <sign-up-step1 :step="step" v-show="step === 1" :userInfo="{ userId: userId, email: email }"
                @nextStep="stepUpTo2" />
            <sign-up-step2 :step="step" v-show="step === 2" :userInfo="{ name: name, password: password }"
                @nextStep="stepUpTo3" />
            <sign-up-step3 :step="step" v-show="step === 3" :userInfo="{ birth: birth, gender: gender }"
                @signUp="postSignUpRequest" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios';
import SignUpStep1 from './sign-up-step/SignUpStep1.vue';
import SignUpStep2 from './sign-up-step/SignUpStep2.vue';
import SignUpStep3 from './sign-up-step/SignUpStep3.vue';
import router from '@/router';

const baseUrl = process.env.VUE_APP_API_URL;

const userId = ref("");
const email = ref("");
const password = ref("");
const birth = ref("");
const gender = ref("");
const name = ref("");



const step = ref(1);

const stepBack = () => {
    if (step.value > 1)
        step.value--;
    else
        router.push('/login');
}

const stepUpTo2 = (data) => {
    userId.value = data.userId;
    email.value = data.email;
    step.value += 1;
}

const stepUpTo3 = (data) => {
    name.value = data.userName;
    password.value = data.password;
    step.value += 1;
}

const postSignUpRequest = (data) => {
    birth.value = data.birth;
    gender.value = data.gender;

    const jsonData = {
        userId: userId.value,
        email: email.value,
        password: password.value,
        gender: gender.value,
        birth: birth.value,
        name: name.value
    }

    axios.post(`${baseUrl}/account/join`, JSON.stringify(jsonData), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });
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