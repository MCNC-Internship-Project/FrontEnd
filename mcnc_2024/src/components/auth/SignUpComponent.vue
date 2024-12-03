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
import { ref, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSignUpStore } from '@/stores/SignUpStore';
import axios from 'axios';
import SignUpStep1 from './sign-up-step/SignUpStep1.vue';
import SignUpStep2 from './sign-up-step/SignUpStep2.vue';
import SignUpStep3 from './sign-up-step/SignUpStep3.vue';

const baseUrl = process.env.VUE_APP_API_URL;
const store = useSignUpStore();
const router = useRouter();

const dialog = ref({
    isVisible: false,
    message: ""
});

const showDialog = (message) => {
    dialog.value.message = message;
    dialog.value.isVisible = true;
}

const stepBack = () => {
    if (store.step > 1) {
        store.prevStep();
    } else {
        router.push('/login');
    }
}

const signUp = () => {
    showDialog('회원가입에 성공했습니다.');
}

const login = () => {
    dialog.value.isVisible = false

    const requestBody = {
        userId: store.userId,
        password: store.password
    }

    axios.post(`${baseUrl}/auth/login`, JSON.stringify(requestBody), {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(() => {
            router.replace("/");
        })
        .catch(() => {
            router.replace('/login');
        });
}

onUnmounted(() => {
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