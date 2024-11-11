<template>
    <div id="root-container">

        <div class="survey-header-section">

            <div class="input-section">
                <input type="text" name="title" id="title" class="survey-title" value="질문 제목"/>
            </div>

            <div class="type-select-section">
                <select name="type" id="type" class="survey-type" v-model="surveyType">
                    <option class="type-item" value="obj_radio">단일 선택</option>
                    <option class="type-item" value="obj_check">다중 선택</option>
                    <option class="type-item" value="subj">주관식</option>
                </select>
            </div>
        </div>

        <div class="isTypeSubj" v-if="surveyType === 'subj'">
            <subj-component />
        </div>

        <div class="isTypeObj" v-else>
            <obj-component :type="surveyType"/>
        </div>

    </div>
</template>

<script setup>
import ObjComponent from './typeComponent/ObjComponent.vue'
import SubjComponent from './typeComponent/SubjComponent.vue'
import { ref, watch } from 'vue';

const surveyType = ref("obj_radio")

watch(surveyType, (newType) => {
    surveyType.value = newType;
})
</script>

<style scoped>
#root-contaienr {
    width : 100%;
    background-color: #EFF0F6;
    display : flex;
    flex-direction : column;
    align-items : center;
    justify-content: center;
}

.survey-header-section {
    width : calc(100% - 32px);
    height : 60px;
    margin : 20px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding : 0 12px;
    background-color : #D9D9D9;
    border-radius : 10px;
}

.survey-title {
    width : 100%;
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

.input-section {
    flex : 3;
}

.type-select-section {
    flex : 1;
    display: flex;
    justify-content: center; /* 가로 중앙 정렬 */
    align-items: center;     /* 세로 중앙 정렬 */
    width: 100%;             /* 필요에 따라 섹션의 너비를 조정 */
}

.survey-type {
    outline: none;  /* 포커스 outline 제거 */
}

.survey-type option {
    text-align : center;
}

.isTypeSubj {
    width : 100%;
    margin : 0 22px;
    padding : 0 22px;
}

.isTypeObj {
    width : 100%;
    margin : 0 22px;
    padding : 0 22px;
}

</style>