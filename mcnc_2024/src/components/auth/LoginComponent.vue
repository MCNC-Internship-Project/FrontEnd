<template>
    <div id="root-container">
        <div class="logo-container">
            <img src="../../assets/images/icon_logo.svg" class="logo" alt="logo" @click="goToHome">
            <div class="logo-font">
                survwey
            </div>
        </div>

        <form action="" class="login-container">
            <input type="text" name="userId" id="user-id" class="user-id" placeholder="아이디" autocomplete="new-password" v-model="userId">
            <input type="password" name="password" id="password" placeholder="비밀번호" autocomplete="new-password" v-model="password">
            <button class="login-btn" @click="login" :disabled="!isPossible">로그인</button>
        </form>

        <div class="login-service">
            <router-link to="/signUp" class="sign-up">회원가입</router-link>
            <a href="#" class="find-password">비밀번호를 잊으셨나요?</a>
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

    const jsonData = {email: userId.value, password: password.value}
    console.log(JSON.stringify(jsonData));

    router.push("/");
}

const goToHome = () => {
    router.push("/")
}

watch([userId, password], () => {
    isPossible.value = userId.value.length >= 4 && password.value.length >= 8;
});

</script>

<style scoped>
#root-container {
    margin-top : 64px;
    padding : 0;
    width : 100%;
    height : 90vh;
    display : flex;
    flex-direction : column;
    align-items : center;
    justify-content: center;
}

.logo-container {
    width : 100%;
    display : flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom : 40px;
}

@font-face {
    font-family: 'Mont';
    src: url('../../assets/fonts/MontserratAlternates-Bold.ttf') format('truetype');
    font-weight: bold;
    font-style: normal;
}

/* 폰트를 사용할 스타일 정의 */
.logo-font {
    font-family: 'Mont', sans-serif;
    font-size : 2.5rem;
    color : #7796E8;
}

.login-container {
    margin : 0 20px;
}

p {
    margin : 0;
}

input, .login-btn {
    box-sizing: border-box;
    padding: 0 10px;
    width: 100%;
    height: 55px;
    border-radius: 10px;
    margin : 12px 0;
}

input {
    border : solid 2px #7796E8;
}

.login-btn {
    color : white;
    background-color : #7796E8;
    border : none;
    transition : all 0.2s ease;
}

.login-btn:disabled, .login-btn:disabled:hover {
    background-color: #ccc;
    cursor : not-allowed;
}

.login-btn:hover {
    background-color: #0d6db7;
}

.login-service {
    margin : 30px 30px;
    display : flex;
    flex-direction : column;
    align-items: center;
    justify-content: center;
}

a {
    text-decoration: none;
}

.sign-up {
    font-size : 0.875rem;
    color : red;
    margin-top : 24px;
}

.find-password {
    font-size : 0.875rem;
    color : #B2B2B2;
    margin : 16px 0;
}

/* 데스크탑 최소 너비 1200px */
@media (min-width: 1200px) {
    .login-container {
        width: 30%;
    }

    .logo {
        width : 10%;
        margin-top : 60px;
    }

    input, .login-btn {
        height: 55px;
        font-size: 0.875rem;
        padding : 0 20px;
    }
}

/* 중형 화면(태블릿) 최대 너비 992px */
@media (max-width: 992px) {
    .login-container {
        width: 50%;
    }

    .logo {
        width : 30%;
    }

    input, .login-btn {
        height: 55px;
        font-size: 0.875rem;
        padding : 0 20px;
    }
}

/* 모바일 최소 너비 480px */
@media (max-width: 480px) {
    .login-container {
        width: 80%;
        margin: 0;
    }

    .logo {
        width : 40%;
    }

    input, .login-btn {
        height: 55px;
        font-size: 0.875rem;
        padding : 0 20px;
    }

    .login-service {
        margin: 20px 0;
    }

    .sign-up, .find-password {
        font-size: 0.65rem;
    }
}
</style>