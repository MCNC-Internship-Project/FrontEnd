<template>
    <div id="root-container">

        <div class="sign-up-container">

            <input type="email" class="form-item" placeholder="아이디(이메일)" autocomplete="userId" v-model="userId">
            <button class="submit-btn" @click="stepTo2">다음</button>

        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
    step : Number,
})

const userId = ref("")

const emit = defineEmits(["nextStep"]);

function stepTo2() {
    emit("nextStep", {userId: userId.value, step: props.step + 1})
}

</script>

<style scoped>
#root-container {
    width : 100%;
    height : 10vh;
    margin-top : 24px;
    display : flex;
    flex-direction : column;
    align-items: center;
    justify-content: start;
}

.sign-up-container {
    width : 100%;
    display : flex;
    flex-direction : column;
    align-items: center;
    justify-content: center;
}

.form-item, .submit-btn {
    box-sizing: border-box;
    width : 90%;
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
    transition : all 0.2s ease;
}

.submit-btn:hover {
    background-color: #0d6db7;
}

/* 데스크탑 최소 너비 1200px */
@media (min-width: 1200px) {
    input, .submit-btn {
        height: 55px;
        font-size: 1rem;
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