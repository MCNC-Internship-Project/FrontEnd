<template>
    <div id="root-container">
        <div class="header">
            <router-link to="/" class="back-btn">back</router-link>
            <button class="submit-btn">생성</button>
        </div>

        <div class="survey-title-section">
            <div class="input-section">
                <input type="text" name="survey-title" class="survey-title" value="설문조사 제목" maxlength="255"/>
            </div>
            
            <div class="input-section">
                <input type="text" name="survey-description" class="survey-description" value="설문지 설명" maxlength="255">
            </div>
        </div>

        <survey-item />

        <div class="create-btn-container">
            <button class="create-btn">create</button>
        </div>

    </div>
</template>

<script setup>
import SurveyItem from './CreateSurveyItem/SurveyItem.vue';
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

.survey-title-section {
    width : 100%;
    display : flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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
    border-bottom : solid 1px #D4D6DD;
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