<template>
    <div id="root-container">

        <div class="survey-header-section">
            <div class="input-section">
                <input type="text" name="title" id="title" class="survey-title" value="질문 제목"/>
            </div>
        </div>

        <div class="type-select-section">
            <select name="type" id="type" class="survey-type" v-model="surveyType">
                <option class="type-item" value="OBJ_SINGLE">단일 선택</option>
                <option class="type-item" value="OBJ_MULTI">다중 선택</option>
                <option class="type-item" value="SUBJECTIVE">주관식</option>
            </select>
        </div>

        <div class="isTypeSubj" v-if="surveyType === 'SUBJECTIVE'">
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

const surveyType = ref("OBJ_SINGLE")

watch(surveyType, (newType) => {
    surveyType.value = newType;
})
</script>

<style scoped>
#root-contaienr {
    width : 100%;
    padding : 0 20px;
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
    background-color: #fff;
}

.survey-title {
    width : 100%;
    height : 100%;
    color : #8c8c8c;
    font-size : 1rem;
    font-weight : bold;
    border: none;                  /* 기본 테두리 제거 */
    outline: none;                 /* 포커스 outline 제거 */
    padding: 8px 8px;                /* 위아래 여백 추가 */
    transition: all 0.3s; /* 포커스 시 애니메이션 */
}

.type-select-section {
    display: flex;
    justify-content: start;
    padding : 0 16px;
    width: 100%;
}

.survey-type {
    background-color: #fff;
    width : 100%;
    height : 36px;
    padding : 0 32px;
    border : solid 1px #D9D9D9;
    outline: none;  /* 포커스 outline 제거 */
}

.isTypeSubj {
    width : 100%;
    margin : 0;
    padding : 0 16px;
}

.isTypeObj {
    width : 100%;
    margin : 0;
    padding : 0 16px;
}

</style>