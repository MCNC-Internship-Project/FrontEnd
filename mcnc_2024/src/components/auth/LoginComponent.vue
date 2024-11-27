<template>
    <div class="root-container">
        <div class="parent-container">
            <div class="logo-container">
                <img src="../../assets/images/icon_logo.svg" class="logo" alt="logo">
                <div class="title">Survwey</div>
            </div>

            <form class="form-container" @submit.prevent="login">
                <input type="text" class="form-input" id="userId" placeholder="아이디"
                    autocomplete="new-password" v-model="userId">
                <input type="password" class="form-input" id="password" placeholder="비밀번호"
                    autocomplete="new-password" v-model="password">
                <button class="form-btn" @click="login" :disabled="!isPossible">로그인</button>
            </form>

            <div class="footer-container">
                <router-link to="/sign-up" class="sign-up">회원가입</router-link>
                <router-link to="/find-password" class="forgot-pw">비밀번호를 잊으셨나요?</router-link>
            </div>
        </div>

        <v-dialog v-model="showDialog" max-width="400">
            <v-card>
                <v-card-text>
                    {{ dialogMessage }}
                </v-card-text>
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
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
const baseUrl = process.env.VUE_APP_API_URL;

const router = useRouter();

const userId = ref("");
const password = ref("");
const isPossible = ref(false);

const showDialog = ref(false)
const dialogMessage = ref("")

const login = () => {
    const jsonData = {
        userId: userId.value, 
        password: password.value
    }

    axios.post(`${baseUrl}/auth/login`, JSON.stringify(jsonData), {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(() => {
            router.push("/");
        })
        .catch((error) => {
            showErrorDialog(error.response.data.errorMessage);
        });
}

const showErrorDialog = (message) => {
    dialogMessage.value = message
    showDialog.value = true
}

watch([userId, password], () => {
    isPossible.value = userId.value.length > 0 && password.value.length > 0;
});

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
    height: calc(var(--vh, 1vh) * 100);
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
    margin: 40px;
    max-width: 360px;
    min-width: 280px;
}

.form-input {
    width: 100%;
    height: 56px;
    margin-bottom: 12px;
    padding: 0 16px;
    border: solid 2px var(--primary);
    border-radius: 12px;
    outline: none;
    font-size: 0.875rem;
}

.form-input::placeholder {
    color: #C6C6C6;
}

.form-btn {
    width: 100%;
    height: 56px;
    margin-top: 8px;
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

.form-btn:hover:not([disabled]) {
    background-color: var(--secondary);
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

.v-card {
    background-color: #FAF8F8;
    border-radius: 16px !important;
    border: 1px solid #EFF0F6;
    padding: 16px 12px 12px 12px;
}

.v-card-text {
    font-size: 1rem !important;
    color: #757576;
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