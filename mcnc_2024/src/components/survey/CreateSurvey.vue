<template>
    <div id="root-container">
        <div class="header">
            <router-link to="/" class="back-btn">back</router-link>
            <button class="submit-btn">생성</button>
        </div>

        <div class="survey-section">
            <div class="survey-title-section">
                <div class="input-section">
                    <input type="text" name="survey-title" class="survey-title" value="설문조사 제목" maxlength="255"/>
                </div>
                
                <div class="input-section">
                    <input type="text" name="survey-description" class="survey-description" value="설문지 설명" maxlength="255">
                </div>
            </div>

            <div class="survey-item-container">
                <div class="survey-item-section" v-for="com in totalComponent" :key="com.id">
                    <survey-item />
                    <div class="delete-btn-container">
                        <button @click="removeComponent(com.id)" class="delete-btn">삭</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="create-btn-container">
            <button class="create-btn" @click="addComponent">create</button>
        </div>

    </div>
</template>

<script setup>
import SurveyItem from './CreateSurveyItem/SurveyItem.vue';
import { ref } from 'vue';

const totalComponent = ref([
    {id:0},
]);

const addComponent = () => {
    const lastIndex = totalComponent.value.at(-1);
    const newObj = {id: lastIndex+1}

    totalComponent.value.push(newObj);
}

const removeComponent = (id) => {
    totalComponent.value = totalComponent.value.filter((component) => component.id !== id);
};
</script>

<style scoped>
#root-container {
    width : 100%;
    display : flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.header {
    width : 100%;
    display : flex;
    align-items: center;
    justify-content: space-between;
    padding : 16px 16px;
}

.back-btn {
    text-indent : -999em;
    background: url("../../common/back_btn_icon.png") no-repeat;
    background-size : contain;
    width : 32px;
    height : 32px;
}

.submit-btn {
    display : inline-block;
    width : 36px;
    height : 36px;
    border : none;
    border-radius: 8px;
    text-align : center;
    background-color: #7796E8;
    font-size : 0.8125rem;
    color : white;
}

.survey-section {
    width : 100%;
    padding : 0 22px;
}

.survey-item-container {
    width : 100%;
    display : flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
}

.survey-item-section {
    background-color: #EFF0F6;
    margin-bottom : 12px;
    display : flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0 16px; /* 양쪽 padding 추가 */
}

.delete-btn {
    text-indent : -999em;
    background: url("../../common/icon_trash.png") no-repeat;
    background-size: contain;
    width : 24px;
    height : 24px;
    
}

.input-section {
    width : 100%;
    display : flex;
    justify-content: start;
}

input {
    width : 100%;
    margin : 0 16px 12px 16px;
    height : 44px;
    padding : 0 16px;
    font-weight : bold;
    border: none;                  /* 기본 테두리 제거 */
    border-bottom: 2px solid gray; /* 밑줄만 추가 */
    outline: none;                 /* 포커스 outline 제거 */
    padding: 8px 0;                /* 위아래 여백 추가 */
    transition: all 0.3s; /* 포커스 시 애니메이션 */
}

input:hover {
    border-bottom-color: blue;     /* 포커스 시 밑줄 색상 변경 */
}

.survey-title {
    font-size : 1.25rem;
    color : #464748;
}

.survey-description {
    font-size : 1rem;
    color : #C1C3C5;
}

.survey-item-section {
    width : calc(100%-40px);
    border-radius: 10px;
}

.create-btn-container {
    margin-top : 16px;
}

.create-btn {
    text-indent : -999em;
    background: url("../../common/icon_create_button.png");
    background-size: contain;
    width : 60px;
    height : 60px;
}
</style>