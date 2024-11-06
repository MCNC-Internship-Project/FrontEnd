<template>
    <div id="root-container">
        
        <div class="sign-up-container">
            <input type="text" class="form-item" placeholder="사용자명" v-model="userName">
            <input type="password" class="form-item" placeholder="비밀번호" autocomplete="new-password" v-model="password">
            <input type="password" class="form-item" placeholder="비밀번호 확인" autocomplete="new-password">

            <button class="submit-btn" @click="stepTo2">다음</button>
        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue'

const userName = ref("")
const password = ref("")
    
</script>

<style scoped>
#root-container {
    width : 100%;
    height : 95vh;
    margin-top : 36px;
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
    transition : all 0.2s;
}

.submit-btn:hover {
    background-color: #0d6db7;
}
</style>