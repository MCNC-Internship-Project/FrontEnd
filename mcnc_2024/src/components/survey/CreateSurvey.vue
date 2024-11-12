<template>
    <div id="root-container">

        <header class="toolbar">
            <div class="back-container">
                <img class="back" src="../../assets/images/icon_arrow_left.svg" alt="back" @click="stepBack">
            </div>

            <div class="menu-container">
                <button class="submit-btn">생성</button>
            </div>

            
        </header>

        <div class="survey-section">
            <div class="survey-title-section">
                <div class="input-section">
                    <input type="text" name="survey-title" class="survey-title" value="설문조사 제목" maxlength="255"/>
                </div>
                
                <div class="input-section">
                    <input type="text" name="survey-description" class="survey-description" value="설문지 설명" maxlength="255">
                </div>

                <div class="select-deadline-section">
                    <div class="deadline">
                        설문 기간
                    </div>

                    <div class="select-deadline">
                        {{ selectDate === "" && selectTime === "" ? "미설정" : selectDate + " - " + selectTime }}
                    </div>

                    <div class="calender-container" @click="isShowModal = true">
                        calender
                    </div>
                </div>
            </div>

            <div class="survey-item-container">
                <div class="survey-item-section" v-for="com in totalComponent" :key="com.id">
                    <survey-item />
                    <div class="delete-btn-container">
                        <button @click="removeComponent(com.id)" class="delete-btn"></button>
                    </div>
                </div>
            </div>
        </div>

        <div class="create-btn-container">
             <div class="create-btn-section" @click="addComponent">
                <div class="add-icon-container">
                    <div class="add-icon">
                        add
                    </div>
                </div>
                질문 추가하기
             </div>
        </div>


        <div class="calender-modal" v-if="isShowModal">
            <div class="modal-background">
                <div class="modal-section">

                    <div class="modal-content-container">
                        모달창이욧 -> 데이트, 타임피커
                    </div>

                    <div class="modal-btn-container">

                        <div class="modal-btn-section modal-cancle-btn" @click="isShowModal = false">
                            취소
                        </div>
                        <div class="modal-btn-section modal-submit-btn" @click="initDeadline">
                            확인
                        </div>

                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import SurveyItem from './CreateSurveyItem/SurveyItem.vue';
import { ref } from 'vue';
import router from '@/router';
import { formatDate } from '@/utils/dateCalculator'

const totalComponent = ref([
    {id:0},
]);

const selectDate = ref("");
const selectTime = ref("");
const isShowModal = ref(false);


const addComponent = () => {
    const lastIndex = totalComponent.value.length > 0 
        ? totalComponent.value[totalComponent.value.length - 1].id 
        : -1;

    const newObj = {id: lastIndex+1}

    totalComponent.value.push(newObj);
}

const removeComponent = (id) => {
    totalComponent.value = totalComponent.value.filter((component) => component.id !== id);
};

const stepBack = () =>{
    router.push("/")
}

const initDeadline = () => {
    selectDate.value = formatDate(new Date());
    selectTime.value = "15 : 00"
    isShowModal.value = false;
}
</script>

<style scoped>
#root-container {
    width : 100%;
    display : flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.toolbar {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    left: 0;
    top: 0;
    right: 0;
    width: 100%;
    height: 64px;
}

.back-container {
    display: flex;
    align-items: center;
    padding-left: 24px;
}

.menu-container {
    display : flex;
    align-items: center;
    position: absolute;
    right: 0;
    padding-right: 24px;
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
    padding : 0 24px;
}

.survey-title-section {
    background-color: #EFF0F6;
    border-radius: 15px;
    margin-bottom : 20px;
    padding : 8px 8px;
    box-sizing: border-box;
}

.select-deadline-section {
    margin : 16px 16px 0 16px;
    height : 32px;
    display : flex;
    align-items: center;
    font-weight : bold;
    font-size : 0.8175rem;
    color : #757575;
}

.select-deadline {
    color : #ABABB6;
    margin : 0 8px;
    font-size : 0.8175rem;
}

.calender-container {
    text-indent : -999em;
    background: url("../../assets/images/icon_calendar.svg") no-repeat;
    background-size: contain;
    width : 20px;
    height : 20px;
}

.survey-item-container {
    width : 100%;
    display : flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
}

.survey-item-section {
    background-color: #FAF8F8;
    margin-bottom : 12px;
    display : flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0;
    border : solid 1px #eff0f6;
    border-radius : 15px;
    box-shadow : 0 2px 4px rgba(0, 0, 0, 0.3);
}

.delete-btn {
    text-indent : -999em;
    background: url("../../assets/images/icon_trash.svg") no-repeat;
    background-size: contain;
    width : 24px;
    height : 24px;
    margin-right : 12px;
}

.input-section {
    width : 100%;
    display : flex;
    justify-content: start;
}

input {
    width : 100%;
    margin : 0 16px;
    height : 44px;
    padding : 0 16px;
    outline: none;                 /* 포커스 outline 제거 */
    padding: 8px 0;                /* 위아래 여백 추가 */
    transition: all 0.3s; /* 포커스 시 애니메이션 */
}

.survey-title {
    border: none;                  /* 기본 테두리 제거 */
    font-size : 1rem;
    font-weight : bold;
    color : #464748;
}

.survey-description {
    font-size : 0.875rem;
    color : #C1C3C5;
}

.create-btn-container {
    width : 100%;
    padding : 0 24px;
    margin : 16px 0;
}

.create-btn-section {
    position : relative;
    background-color: #fff;
    height : 60px;
    display : flex;
    align-items: center;
    justify-content: center;
    border : solid 1px #EFF0F6;
    border-radius: 15px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    font-weight : bold;
    font-size : 1rem;
    color : #8C8C8C;
}

.add-icon-container {
    position : absolute;
    top : 18px;
    left : 24px;
}

.add-icon {
    text-indent : -999em;
    background: url("../../assets/images/icon_add.svg");
    background-size: contain;
    width : 24px;
    height : 24px;
}

.calender-modal {
    position: fixed;  /* 모달을 고정 */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;  /* 다른 요소들 위에 위치 */
}

.modal-background {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);  /* 배경을 반투명 회색으로 설정 */
    display: flex;
    justify-content: center;
    align-items: center; 
}

.modal-section {
    background-color: #fff;  /* 모달 창의 배경을 흰색으로 */
    padding: 20px;
    border-radius: 10px;
    width: 300px;
    display : flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.modal-btn-container {
    width : 100%;
    margin-top : 24px;
    display : flex;
    align-items: center;
    justify-content: space-around;
}

.modal-btn-section {
    width : 120px;
    height : 40px;
    font-size : 1rem;
    font-weight : bold;
    border-radius: 15px;
    border : solid 1px #757575;
    display : flex;
    align-items: center;
    justify-content: center;
}

.modal-cancle-btn {
    background-color: #fff;
    color : #757575;
}

.modal-submit-btn {
    background-color: #7796E8;
    color : #fff;
}
</style>