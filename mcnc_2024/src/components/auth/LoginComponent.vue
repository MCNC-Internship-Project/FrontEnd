<template>
    <div class="root-container">
        <div class="parent-container">
            <div class="logo-container">
                <img src="../../assets/images/icon_logo.svg" class="logo" alt="logo">
                <div class="title">Survwey</div>
            </div>

            <div class="form-container">
                <input type="text" class="form-input" id="userId" placeholder="아이디"
                    autocomplete="new-password" v-model="userId">
                <input type="password" class="form-input" id="password" placeholder="비밀번호"
                    autocomplete="new-password" v-model="password">
                <button class="form-btn" @click="login" :disabled="!isPossible">로그인</button>
            </div>

            <div class="footer-container">
                <router-link to="/sign-up" class="sign-up">회원가입</router-link>
                <router-link to="/" class="forgot-pw">비밀번호를 잊으셨나요?</router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const userId = ref("");
const password = ref("");
const isPossible = ref(false);

const login = () => {
    const jsonData = { email: userId.value, password: password.value }
    console.log(JSON.stringify(jsonData));

    router.push("/");
}

watch([userId, password], () => {
    isPossible.value = userId.value.length >= 4 && password.value.length >= 8;
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
</style>