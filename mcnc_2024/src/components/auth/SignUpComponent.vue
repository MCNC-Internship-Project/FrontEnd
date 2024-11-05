<template>
    <div id="root-container">

        <div class="logo-container">
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
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const userName = ref("")
const userId = ref("")
const password = ref("")
</script>

<style scoped>
#root-container {
    padding : 0;
    width : 100%;
    height : 95vh;
    display : flex;
    flex-direction : column;
    align-items: center;
    justify-content: center;
}

.logo-container {
    width : 100%;
    margin : 52px 0;
    display : flex;
    align-items: center;
    justify-content: space-around;
}

.sign-up-container {
    width : 100%;
    display : flex;
    flex-direction : column;
    align-items: center;
    justify-content: center;
}

.form-container {
    width : 100%;
    display : flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
}

.form-item, .submit-btn {
    box-sizing: border-box;
    width : 80%;
    height : 55px;
    border : solid 2px #1088E3;
    border-radius: 10px;
    margin : 8px 0;
    padding : 0 10px;
}

.submit-btn {
    background-color: #1088E3;
    border : none;
    color : white;
    transition : all 0.2s;
}

.submit-btn:hover {
    background-color: #0d6db7;
}

/* 데스크탑 최소 너비 1200px */
@media (min-width: 1200px) {
    .logo {
        width : 10%;
        margin-top : 60px;
    }

    .form-container {
        width : 30%;
    }

    input, .submit-btn {
        height: 55px;
        font-size: 0.875rem;
        padding : 0 20px;
    }
}

/* 중형 화면(태블릿) 최대 너비 992px */
@media (max-width: 992px) {
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

    .logo {
        width : 40%;
    }

    input, .login-btn {
        height: 55px;
        font-size: 0.875rem;
        padding : 0 20px;
    }
}
</style>