<template>
    <div id="root-container">

        <div class="header">
            <div class="back-btn">뒤로가기</div>
        </div>

        <div class="sign-up-section">
            <div class="step">
                단계 {{ step }} / 3
            </div>

            <div class="guide-text">
                회원가입을 시작합니다.
            </div>
        </div>

        <sign-up-step1 v-if="step === 1"/>
        <sign-up-step2 v-else-if="step === 2"/>
        <sign-up-step3 else/>


        <!-- <div class="logo-container">
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
        </div> -->
    </div>
</template>

<script setup>
import { ref } from 'vue'
import SignUpStep1 from './signUpStep/SignUpStep1.vue';
import SignUpStep2 from './signUpStep/SignUpStep2.vue';
import SignUpStep3 from './signUpStep/SignUpStep3.vue';

const step = ref(1);

// const userName = ref("")
// const userId = ref("")
// const password = ref("")
</script>

<style scoped>
.header {
    display : flex;
    align-items: center;
    justify-content: start;
    padding : 10px 10px;
    width : 100%;
}

.back-btn {
    text-indent : -999em;
    background: url("../../common/back_btn_icon.png") no-repeat;
    width : 32px;
    height : 32px;
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
    font-size : 1.25rem;
    color : #000000;
}
</style>