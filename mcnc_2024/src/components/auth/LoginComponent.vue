<template>
    <div id="root-container">

        <div class="login-container">
            <p>
                <input type="text" name="userId" id="userId" placeholder="아이디" v-model="userId">
            </p>
            <p>
                <input type="text" name="password" id="password" placeholder="비밀번호" v-model="password">
            </p>

            <button class="login-btn" @click="login">로그인</button>
        </div>

        <div class="login-service">
            <router-link to="/signUp">회원가입</router-link>
            <a href="#" class="find-password">비밀번호를 잊으셨나요?</a>
        </div>
        
    </div>
</template>

<script setup>
import { ref } from 'vue';

const userId = ref("");
const password = ref("");

const login = () => {
    console.log("로그인 시도 => ID : " + userId.value + ", PW : " + password.value)
}


</script>

<style scoped>
#root-container {
    width : 100%;
    height : 100vh;
    display : flex;
    flex-direction : column;
    align-items : center;
    justify-content: center;
}

.login-container {
    width : 80%;
    margin : 0 20px;
}

input, .login-btn {
    box-sizing: border-box;
    padding: 0 10px;
    width: 100%;
    height: 55px;
    border-radius: 10px;
}

input {
    border : solid 2px #1088E3;
}

.login-btn {
    color : white;
    background-color : #1088E3;
    border : none;
    transition : all 0.2s ease;
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
    font-size : 0.75rem;
    color : red;
}

.find-password {
    font-size : 0.875rem;
    color : #B2B2B2;
    margin : 20px 0;
}

/* 데스크탑 최소 너비 1200px */
@media (min-width: 1200px) {
    .login-container {
        width: 30%;
    }

    input, .login-btn {
        height: 45px;
        font-size: 0.875rem;
    }
}

/* 중형 화면(태블릿) 최대 너비 992px */
@media (max-width: 992px) {
    .login-container {
        width: 50%;
    }

    input, .login-btn {
        height: 45px;
        font-size: 0.875rem;
    }
}

/* 모바일 최소 너비 480px */
@media (max-width: 480px) {
    .login-container {
        width: 80%;
        margin: 0;
    }

    input, .login-btn {
        height: 40px;
        font-size: 0.75rem;
    }

    .login-service {
        margin: 20px 0;
    }

    .sign-up, .find-password {
        font-size: 0.65rem;
    }
}
</style>