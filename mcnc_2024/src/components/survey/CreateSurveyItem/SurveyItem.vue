<template>
    <div id="root-container">

        <div class="survey-header-section">

            <div class="input-section">
                <input type="text" name="title" id="title" class="survey-title" value="질문 제목"/>
            </div>

            <div class="type-select-section">
                <select name="type" id="type" class="survey-type" v-model="surveyType">
                    <option class="type-item" value="OBJ">객관식</option>
                    <option class="type-item" value="SUBJ">주관식</option>
                </select>
            </div>
        </div>

        <div class="isTypeOBJ" v-if="surveyType === 'OBJ'">
            여긴 객관식
        </div>

        <div class="isTypeSUBJ" v-else-if="surveyType === 'SUBJ'">
            여긴 주관식
        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue';

const surveyType = ref("OBJ")
</script>

<style scoped>
#root-contaienr {
    width : 100%;
    display : flex;
    flex-direction : column;
    align-items : center;
    justify-content: center;
}

.survey-header-section {
    width : calc(100% - 50px);
    height : 60px;
    margin : 36px 28px;
    padding : 16px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding : 0 16px;
    background-color : #D9D9D9;
    border-radius : 10px;
}

.survey-title {
    height : 100%;
    color : #464748;
    font-size : 1rem;
    border: none;                  /* 기본 테두리 제거 */
    border-bottom: 2px solid gray; /* 밑줄만 추가 */
    outline: none;                 /* 포커스 outline 제거 */
    padding: 8px 0;                /* 위아래 여백 추가 */
    transition: all 0.3s; /* 포커스 시 애니메이션 */
}

.survey-title:focus {
    border-bottom-color: blue;     /* 포커스 시 밑줄 색상 변경 */
}

.type-select-section {
    width : 100%;
    display : flex;
    align-items: center;
    justify-content: end;
}

.survey-type {
    outline: none;  /* 포커스 outline 제거 */
}

</style>