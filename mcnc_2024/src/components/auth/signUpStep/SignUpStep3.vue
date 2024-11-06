<template>
    <div id="root-container">
        <div class="sign-up-container">
            <div class="date-container">
                <VueDatePicker v-model="date" :enable-time-picker="false" :max-date="minDate" class="date-picker"/>
            </div>
            
            <div class="gender-container">
                <select name="gender" id="gender" class="gender-dropdown" v-model="gender">
                    <option class="dropdown-item" value="male">남성</option>
                    <option class="dropdown-item" value="female">여성</option>
                </select>
            </div>

            <button class="submit-btn" @click="goToSignUp">회원가입</button>
        </div>
    </div>
</template>

<script setup>
import { getTodayDate, formatDate } from '@/utils/dateCalculator'
import { ref, watch } from 'vue'

const minDate = getTodayDate();

const date = ref(new Date());
const birth = ref(getTodayDate());
const gender = ref("male");

watch(date, (newDate) => {
    console.log(newDate)
     birth.value = formatDate(newDate);
})
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

.submit-btn {
    box-sizing: border-box;
    height : 55px;
    border : solid 2px #1088E3;
    border-radius: 10px;
    margin : 8px 0;
    width : 90%;
    background-color: #1088E3;
    border : none;
    color : white;
    transition : all 0.2s;
}

.date-container, .gender-container {
    width : 90%;
    margin : 8px 0;
    padding : 0;
}


.gender-dropdown {
    border : solid 2px #1088E3;
    border-radius: 4px;
    padding : 0 10px;
    appearance: none;
    font-size : 1rem;
    width : 100%;
    box-sizing : border-box;
    height : 55px;
}

.dropdown-item {
    padding : 0 20px;
}

.submit-btn:hover {
    background-color: #0d6db7;
}
</style>