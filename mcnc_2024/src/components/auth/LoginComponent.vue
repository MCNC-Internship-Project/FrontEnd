<template>
    <div class="root-container">
        <div class="logo-container">
            <img src="@/assets/images/icon_logo.svg" class="logo" alt="logo">
            <div class="title">Survwey</div>
        </div>

        <form class="form-container" @submit.prevent="login">
            <input v-model="userId" type="text" class="form-input" :class="{ 'error': isUserIdError }" placeholder="아이디"
                maxlength="20" @focus="isUserIdError = false">
            <div class="form-password-container" :class="{ 'error': isPasswordError }">
                <input v-model="password" :type="passwordInputType" class="form-input-password" placeholder="비밀번호"
                    maxlength="100" @focus="isPasswordError = false">
                <img class="form-input-password-icon" :src="passwordIcon" @click="changePasswordInputType" />
            </div>
            <button class="form-btn" v-ripple>로그인</button>
        </form>

        <div class="footer-container">
            <router-link to="/sign-up" class="sign-up">회원가입</router-link>
            <router-link to="/find-password" class="forgot-pw">비밀번호를 잊으셨나요?</router-link>
        </div>

        <default-dialog v-model="dialog.isVisible" :message="dialog.message" @confirm="dialog.isVisible = false" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { encrypt } from '@/utils/crypto';
import imgEyeClose from '@/assets/images/icon_eye_close.svg';
import imgEyeOpen from '@/assets/images/icon_eye_open.svg';

const baseUrl = process.env.VUE_APP_API_URL;

const route = useRoute();
const router = useRouter();

const userId = ref("");
const password = ref("");

const passwordInputType = ref("password");
const isUserIdError = ref(false);
const isPasswordError = ref(false);

const dialog = ref({
    isVisible: false,
    message: ""
});

const showDialog = (message) => {
    dialog.value.message = message;
    dialog.value.isVisible = true;
}

const changePasswordInputType = () => {
    passwordInputType.value = passwordInputType.value === "password" ? "text" : "password";
}

const passwordIcon = computed(() => {
    return passwordInputType.value === "password" ? imgEyeClose : imgEyeOpen;
});

const login = () => {
    if (userId.value.trim() === "") {
        isUserIdError.value = true;
        showDialog("아이디를 입력해주세요.");
        return;
    }

    if (password.value.trim() === "") {
        isPasswordError.value = true;
        showDialog("비밀번호를 입력해주세요.");
        return;
    }

    const requestBody = {
        userId: userId.value,
        password: encrypt(password.value)
    }

    axios.post(`${baseUrl}/auth/login`, JSON.stringify(requestBody), {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(() => {
            // 리다이렉션 route가 없으면 "/"로 이동
            let redirect = route.query.redirect || "/";

            // 외부 URL 리다이렉트 방지
            if (!redirect.startsWith("/")) {
                redirect = "/";
            }

            router.replace(redirect);
        })
        .catch((error) => {
            showDialog(error.response.data.errorMessage);
        });
}
</script>

<style scoped>
.root-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: relative;
    width: 100%;
    height: calc(var(--vh, 1vh) * 100 - 12px);
}

.logo {
    width: 140px;
}

.title {
    font-family: var(--font-mont);
    font-size: 2.5rem;
    color: var(--primary);
}

.form-container {
    width: 100%;
    max-width: 440px;
    min-width: 360px;
    padding: 40px;
}

.form-input,
.form-password-container {
    width: 100%;
    height: 56px;
    border: 2px solid var(--primary);
    border-radius: 12px;
    outline: none;
    font-size: 0.875rem;
}

.form-input {
    margin-bottom: 12px;
    padding: 0 52px 0 16px;
}

.form-input::placeholder,
.form-input-password::placeholder {
    color: #C6C6C6;
}

.form-password-container {
    display: flex;
    align-items: center;
    padding: 0 16px;
}

.form-input-password {
    width: 100%;
    height: 100%;
    padding-right: 16px;
    outline: none;
    font-size: 0.875rem;
}

.form-input-password-icon {
    width: 20px;
    height: 20px;
    cursor: pointer;
}

.form-btn {
    width: 100%;
    height: 56px;
    margin-top: 20px;
    border-radius: 12px;
    font-size: 0.875rem;
    background-color: var(--primary);
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
}

.form-btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.footer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.sign-up {
    font-size: 0.875rem;
    font-weight: bold;
    color: var(--accent);
}

.forgot-pw {
    font-size: 0.875rem;
    font-weight: bold;
    color: #B2B2B2;
    margin-top: 8px;
}

a {
    text-decoration: none;
}

.error {
    border-color: var(--accent);
}
</style>