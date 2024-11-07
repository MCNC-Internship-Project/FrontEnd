<template>
    <div id="root-container">
        
        <div class="sign-up-container">
            <input type="text" class="form-item" placeholder="사용자명" v-model="userName">
            <input type="password" class="form-item" placeholder="비밀번호" autocomplete="new-password" v-model="password">
            <input type="password" class="form-item" placeholder="비밀번호 확인" autocomplete="new-password">

            <button class="submit-btn" @click="stepTo3">다음</button>
        </div>

    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const userName = ref("")
const password = ref("")

const props = defineProps({
    step : Number,
})

const emit = defineEmits(["nextStep"])

function stepTo3() {
    emit("nextStep", {userName: userName.value, password: password.value, step: props.step + 1})
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
    border : solid 2px #7796E8;
    border-radius: 10px;
    margin : 8px 0;
    padding : 0 10px;
}

.submit-btn {
    background-color: #7796E8;
    border : none;
    color : white;
    transition : all 0.2s;
}

.submit-btn:hover {
    background-color: #7796E8;
}
</style>